import time
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.db import models
from django.utils import timezone
from django.conf import settings
from django.apps import apps
from dashboards.models import Dashboard
from domain_mappings.models import MappingType, RelationshipType, DomainMapping
from widgets.models import WidgetDefinition
from django.dispatch import receiver


class MyUserManager(BaseUserManager):
    def default_person_group_manager_util(self, username):
        groups_people = apps.get_model('owf_groups', 'OwfGroupPeople')
        groups = apps.get_model('owf_groups', 'OwfGroup')
        settings_group = settings.DEFAULT_USER_GROUP
        person = Person.objects.get(username=username)
        group = groups.objects.get(name=settings_group)
        inject = groups_people(group_id=group.id, person_id=person.id)
        return inject.save(using=self._db)

    def admin_person_group_manager_util(self, username):
        groups_people = apps.get_model('owf_groups', 'OwfGroupPeople')
        groups = apps.get_model('owf_groups', 'OwfGroup')
        settings_group = settings.DEFAULT_ADMIN_GROUP
        person = Person.objects.get(username=username)
        group = groups.objects.get(name=settings_group)
        inject = groups_people(group_id=group.id, person_id=person.id)
        return inject.save(using=self._db)

    def create_user(self, email, username, password=None):
        """
        Creates and saves a User with the given email, username
         and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        self.default_person_group_manager_util(username)
        return user

    def create_superuser(self, email, username, password):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            username=username,
        )
        user.is_admin = True
        user.save(using=self._db)
        self.admin_person_group_manager_util(username)
        return user


class Person(AbstractBaseUser):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    enabled = models.BooleanField(default=True)
    user_real_name = models.CharField(max_length=200)
    username = models.CharField(unique=True, max_length=200, blank=False)
    last_login = models.DateTimeField(default=timezone.now, blank=True)
    email_show = models.BooleanField(default=True)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    prev_login = models.DateTimeField(default=timezone.now, blank=True)
    description = models.CharField(max_length=255, blank=True)
    last_notification = models.DateTimeField(default=timezone.now, blank=True)
    requires_sync = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f'{self.username} @ {self.email}'

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(Person, self).save(*args, **kwargs)

    def purge_all_dashboards(self):
        user_dashboards = Dashboard.objects.filter(user=self)
        user_dashboard_mappings = DomainMapping.objects.filter(
            src_id__in=list(user_dashboards.values_list("id", flat=True)),
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_type=MappingType.dashboard
        )
        user_dashboards.delete()
        user_dashboard_mappings.delete()

    def purge_dashboards_for_group(self, group):
        group_dashboard_mappings = DomainMapping.objects.filter(
            src_id=group.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_type=MappingType.dashboard
        )
        group_dashboard_clone_mappings = DomainMapping.objects.filter(
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_type=MappingType.dashboard,
            dest_id__in=list(group_dashboard_mappings.values_list("dest_id", flat=True))
        )
        user_dashboards_for_group = Dashboard.objects.filter(
            pk__in=list(group_dashboard_clone_mappings.values_list("src_id", flat=True)),
            user=self
        )
        user_dashboard_mappings = DomainMapping.objects.filter(
            src_id__in=list(user_dashboards_for_group.values_list("id", flat=True)),
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_type=MappingType.dashboard
        )
        user_dashboards_for_group.delete()
        user_dashboard_mappings.delete()

    def purge_widgets_for_group(self, group):
        group_widget_mappings = DomainMapping.objects.filter(
            src_id=group.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_type=MappingType.widget
        )
        group_widget_ids = list(group_widget_mappings.values_list('dest_id', flat=True))

        user_widgets_assigned_through_group = PersonWidgetDefinition.objects.filter(
            person=self,
            user_widget=False,
            widget_definition__in=group_widget_ids
        )
        user_widgets_assigned_through_group.delete()

        user_widgets = PersonWidgetDefinition.objects.filter(
            person=self,
            user_widget=True,
            widget_definition__in=group_widget_ids
        )
        for user_widget in user_widgets:
            user_widget.group_widget = False
            user_widget.save()

    def get_directly_assigned_stacks(self):
        from stacks.models import Stack
        stack_groups = self.groups.filter(stack_default=True)

        return Stack.objects.filter(default_group__in=list(stack_groups.values_list(flat=True)))

    def has_perm(self, perm, obj=None):
        """
        Does the user have a specific permission?
        Simplest possible answer: Yes, always
        """
        return True

    def has_module_perms(self, app_label):
        """
        Does the user have permissions to view the app `app_label`?
        Simplest possible answer: Yes, always
        """
        return True

    @property
    def is_staff(self):
        """
        Is the user a member of staff?"
        Simplest possible answer: All admins are staff
        """
        return self.is_admin

    class Meta:
        managed = True
        db_table = 'person'


@receiver(models.signals.pre_delete, sender=Person)
def clean_mapping_of_user(sender, instance, *args, **kwargs):
    instance.purge_all_dashboards()


class PersonRole(models.Model):
    id = models.BigAutoField(primary_key=True)
    person_authorities_id = models.BigIntegerField(blank=True, null=True)
    role_id = models.BigIntegerField(blank=True, null=True)

    def __str__(self):
        return self.person_authorities_id

    class Meta:
        managed = True
        db_table = 'person_role'


class PersonWidgetDefinitionManager(models.Manager):
    def create(self, **obj_data):
        person = obj_data.pop('person')
        widget_definition = obj_data.pop('widget_definition')

        obj, created = super().get_or_create(
            person=person,
            widget_definition=widget_definition,
            defaults=obj_data,
        )

        # save a query and check user_widget
        if not created and obj.user_widget is not True:
            obj.user_widget = True
            obj.save(update_fields=['user_widget', ])

        return obj


class PersonWidgetDefinition(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0, blank=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    visible = models.BooleanField(default=True)
    pwd_position = models.IntegerField(blank=True, null=True)
    widget_definition = models.ForeignKey('widgets.WidgetDefinition', on_delete=models.CASCADE)
    group_widget = models.BooleanField(blank=True, null=True, default=False)
    favorite = models.BooleanField(blank=True, null=True)
    display_name = models.CharField(max_length=256, blank=True, null=True)
    disabled = models.BooleanField(blank=True, null=True)
    user_widget = models.BooleanField(blank=True, null=True, default=False)

    objects = PersonWidgetDefinitionManager()

    def __str__(self):
        return f'person  = {self.person.username} & widget =  {self.widget_definition.display_name}'

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(PersonWidgetDefinition, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.group_widget:
            self.user_widget = False
            self.save(update_fields=['user_widget', ])
            return self
        else:
            return super(PersonWidgetDefinition, self).delete(*args, **kwargs)

    class Meta:
        managed = True
        db_table = 'person_widget_definition'
        constraints = [
            models.UniqueConstraint(fields=['person', 'widget_definition'], name='unique_person_widget_definition')
        ]
