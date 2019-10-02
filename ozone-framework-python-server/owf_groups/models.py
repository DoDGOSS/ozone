import time
from django.dispatch import receiver
from django.db import models, IntegrityError
from django.dispatch import receiver
from enum import Enum
from django_enum_choices.fields import EnumChoiceField
from people.models import Person
from dashboards.models import Dashboard
from domain_mappings.models import DomainMapping, MappingType
from widgets.models import WidgetDefinition


class GroupStatus(Enum):
    active = 'active'
    inactive = 'inactive'


class OwfGroup(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    status = EnumChoiceField(GroupStatus, default=GroupStatus.active, max_length=8)
    email = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=200, unique=True, blank=False)
    automatic = models.BooleanField(default=True)
    display_name = models.CharField(max_length=200, blank=True, null=True)
    stack_default = models.BooleanField(default=False, blank=True, null=True)
    people = models.ManyToManyField(Person, through='OwfGroupPeople', related_name='groups')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.display_name is None:
            self.display_name = self.name
            self.version = int(time.time())
            super(OwfGroup, self).save(*args, **kwargs)
        else:
            self.version = int(time.time())
            super(OwfGroup, self).save(*args, **kwargs)

    def add_user(self, user):
        payload = {
            'person': user,
            'group': self
        }
        new_group_people = OwfGroupPeople.objects.create(**payload)

        return new_group_people

    def add_widget(self, widget):
        if not isinstance(widget, WidgetDefinition):
            widget = WidgetDefinition.objects.get(pk=widget)

        # based on the role update people to re-sync.
        self.people.update(requires_sync=True)

        return DomainMapping.create_group_widget_mapping(widget, self)

    def remove_widget(self, widget):
        if not isinstance(widget, WidgetDefinition):
            widget = WidgetDefinition.objects.get(pk=widget)

        # based on the role update people to re-sync.
        self.people.update(requires_sync=True)

        return DomainMapping.delete_group_widget_mapping(widget, self)

    class Meta:
        managed = True
        db_table = 'owf_group'

    def remove_user(self, user):
        group_people = OwfGroupPeople.objects.get(person=user, group=self)
        group_people.delete()


@receiver(models.signals.pre_delete, sender=OwfGroup)
def clean_group_mappings(sender, instance, *args, **kwargs):
    for user in instance.people.all():
        user.purge_dashboards_for_group(instance)
        user.purge_widgets_for_group(instance)
        user.requires_sync = True
        user.save()

    Dashboard.objects.get_dashboards_for_group(instance).delete()
    DomainMapping.objects.filter(src_id=instance.id, src_type=MappingType.group).delete()
    DomainMapping.objects.filter(dest_id=instance.id, dest_type=MappingType.group).delete()


class OwfGroupPeopleManager(models.Manager):

    def create(self, **obj_data):
        try:
            group = obj_data.pop('group')
            person = obj_data.pop('person')
            new_group_people = super().create(
                group=group,
                person=person
            )

            # Set requires_sync for user being added to group
            Person.objects.filter(id=person.id).update(requires_sync=True)

            return new_group_people

        except IntegrityError:
            print("Relationship already exists")


class OwfGroupPeople(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(OwfGroup, on_delete=models.CASCADE)
    person = models.ForeignKey('people.Person', on_delete=models.CASCADE)

    objects = OwfGroupPeopleManager()

    def __str__(self):
        return f'group  = {self.group.name} & person =  {self.person.username}'

    class Meta:
        managed = True
        db_table = 'owf_group_people'
        unique_together = (('group', 'person'),)


@receiver(models.signals.post_delete, sender=OwfGroupPeople)
def clean_mappings(sender, instance, *args, **kwargs):
    group = instance.group
    person = instance.person

    group.people.remove(person)
    person.purge_dashboards_for_group(group)
    person.purge_widgets_for_group(group)

    person.required_sync = True
    person.save()
