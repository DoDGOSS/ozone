from django.db import models
from people.models import Person


class OwfGroup(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField()
    status = models.CharField(max_length=8)
    email = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=200)
    automatic = models.BooleanField()
    display_name = models.CharField(max_length=200, blank=True, null=True)
    stack_default = models.BooleanField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        managed = True
        db_table = 'owf_group'


class OwfGroupPeople(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(OwfGroup, models.DO_NOTHING)
    person = models.ForeignKey('people.Person', models.DO_NOTHING)

    def __str__(self):
        return f'group  = {self.group.name} & person =  {self.person.username}'

    class Meta:
        managed = True
        db_table = 'owf_group_people'
        unique_together = (('group', 'person'),)
