from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class Person(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=1)
    user_real_name = models.CharField(null=False, blank=False, max_length=200)
    last_notification = models.DateTimeField(blank=True, null=True)
    requires_sync = models.BooleanField(blank=False, default=False)
    prev_login = models.DateTimeField(blank=True, null=True)
    email_show = models.BooleanField(blank=False, default=False)
    username = models.CharField(null=False, blank=False, max_length=200, unique=True)
    enabled = models.BooleanField(blank=False, default=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

    class Meta:
        db_table = 'person'

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Person.objects.create(user=instance)
    instance.person.save()
