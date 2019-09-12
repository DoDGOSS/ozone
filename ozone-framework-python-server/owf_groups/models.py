from django.db import models, IntegrityError
from enum import Enum
from django_enum_choices.fields import EnumChoiceField
from people.models import Person


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
            super(OwfGroup, self).save(*args, **kwargs)
        else:
            super(OwfGroup, self).save(*args, **kwargs)

    def add_user(self, user):
        payload = {
            'person': user,
            'group': self
        }
        new_group_people = OwfGroupPeople.objects.create(**payload)

        return new_group_people

    class Meta:
        managed = True
        db_table = 'owf_group'


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
            person = Person.objects.get(id=person.id)
            person.requires_sync = True
            person.save()

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
