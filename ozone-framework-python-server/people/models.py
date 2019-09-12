from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.db import models
from roles.models import Role
from widgets.models import WidgetDefinition
from datetime import datetime


class MyUserManager(BaseUserManager):
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
        return user


class Person(AbstractBaseUser):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    enabled = models.BooleanField(default=True)
    user_real_name = models.CharField(max_length=200)
    username = models.CharField(unique=True, max_length=200, blank=False)
    last_login = models.DateTimeField(default=datetime.now, blank=True)
    email_show = models.BooleanField(default=True)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    prev_login = models.DateTimeField(default=datetime.now, blank=True)
    description = models.CharField(max_length=255, blank=True)
    last_notification = models.DateTimeField(default=datetime.now, blank=True)
    requires_sync = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f'{self.username} @ {self.email}'

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
        return self.display_name

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
