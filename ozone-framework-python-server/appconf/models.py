from django.db import models
from django.utils import timezone


class ApplicationConfiguration(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    created_by = models.ForeignKey('people.Person', on_delete=models.SET_NULL, blank=True, null=True,
                                   related_name='appconf_created_by')
    created_date = models.DateField(default=timezone.now, blank=True, null=True)
    edited_by = models.ForeignKey('people.Person', on_delete=models.SET_NULL, blank=True, null=True,
                                  related_name='appconf_edited_by')
    edited_date = models.DateField(default=timezone.now, blank=True, null=True)
    code = models.CharField(unique=True, max_length=250)
    value = models.CharField(max_length=2000, blank=True, null=True)
    title = models.CharField(max_length=250)
    description = models.CharField(max_length=2000, blank=True, null=True)
    type = models.CharField(max_length=250)
    group_name = models.CharField(max_length=250)
    sub_group_name = models.CharField(max_length=250, blank=True, null=True)
    mutable = models.BooleanField()
    sub_group_order = models.BigIntegerField(blank=True, null=True)
    help = models.CharField(max_length=2000, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        managed = True
        db_table = 'application_configuration'
