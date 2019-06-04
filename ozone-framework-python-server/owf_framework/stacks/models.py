from django.db import models
from owf_framework.owf_groups.models import OWFGroup

class Stack(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=1)
    owner_id = models.BigIntegerField(blank=True, null=True)
    stack_context = models.CharField(null=False, blank=False, max_length=200)
    default_group_id = models.BigIntegerField(blank=True, null=True)
    unique_widget_count = models.IntegerField(blank=False)
    name = models.CharField(null=False, blank=False, max_length=256)
    approved = models.BooleanField(blank=True, null=True)
    image_url = models.CharField(null=True, blank=True, max_length=2083)
    descriptor_url = models.CharField(null=True, blank=True, max_length=2083)
    description = models.CharField(blank=True, null=True, max_length=2000)
    groups = models.ManyToManyField(OWFGroup, through='StackGroup')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'stack'


class StackGroup(models.Model):
    group = models.ForeignKey(OWFGroup, on_delete=models.CASCADE)
    stack = models.ForeignKey(Stack, on_delete=models.CASCADE)

    class Meta:
        db_table = 'stack_groups'
