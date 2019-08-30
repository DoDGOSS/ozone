import datetime
import uuid
from django.utils import timezone
from django.db import models
from owf_groups.models import OwfGroup
from people.models import Person
from domain_mappings.models import RelationshipType, DomainMapping
from dashboards.models import Dashboard


class Stack(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0, blank=True)
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=4000, blank=True, null=True)
    stack_context = models.CharField(unique=True, max_length=200, blank=True)
    image_url = models.CharField(max_length=2083, blank=True, null=True)
    descriptor_url = models.CharField(max_length=2083, blank=True, null=True)
    unique_widget_count = models.BigIntegerField(default=0, blank=True, null=True)
    owner = models.ForeignKey(Person, on_delete=models.SET_NULL, blank=True, null=True)
    approved = models.BooleanField(blank=True, null=True)
    default_group = models.ForeignKey(OwfGroup, on_delete=models.SET_NULL, blank=True, null=True,
                                      related_name="default_stack_group")

    groups = models.ManyToManyField(OwfGroup, through='StackGroups')

    def __str__(self):
        return self.name

    @classmethod
    def create(cls, user, kwargs):
        defaultGroup = OwfGroup.objects.create(
            version=0,
            name=str(uuid.uuid4()),
            stack_default=True,
            automatic=False,
            status='active')

        newStack = cls.objects.create(
            version=0,
            default_group=defaultGroup,
            owner=user,
            **kwargs)

        # TODO: move the logic for creating a default group to a manager
        defaultGroup.people.add(user)

        newDashboardLayoutConfig = (kwargs['layout_config'] if hasattr(kwargs, "layout_config") else "")

        # TODO: move logic to create a default group dashboard to a manager
        newGroupDashboard = Dashboard.objects.create(
            layout_config=newDashboardLayoutConfig,
            dashboard_position=0,
            guid=str(uuid.uuid4()),
            isdefault=False,
            stack=newStack,
            name=newStack.name,
            created_date=timezone.now())

        # TODO: move the logic of creating new domain mapping to a manager
        newGroupDashDomainMapping = DomainMapping.objects.create(
            src_id=defaultGroup.id,
            src_type=type(defaultGroup).__name__,
            relationship_type=RelationshipType.owns.name,
            dest_id=newGroupDashboard.id,
            dest_type=type(newGroupDashboard).__name__)

        # TODO: move logic of creating new personal dashboard to a manager
        newPersonalDashboard = Dashboard.objects.create(
            layout_config=newDashboardLayoutConfig,
            dashboard_position=0,
            guid=str(uuid.uuid4()),
            stack=newStack,
            name=newStack.name,
            user=user,
            created_date=timezone.now())

        # TODO: move logic of creating dashboard clone domain mapping to a manager
        newPersonalDashDomainMapping = DomainMapping.objects.create(
            src_id=newPersonalDashboard.id,
            src_type=type(newPersonalDashboard).__name__,
            relationship_type=RelationshipType.cloneOf.name,
            dest_id=newGroupDashboard.id,
            dest_type=type(newGroupDashboard).__name__)

        return newStack

    class Meta:
        managed = True
        db_table = 'stack'


class StackGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(OwfGroup, on_delete=models.CASCADE)
    stack = models.ForeignKey(Stack, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.group.name} for stack name {self.stack.name}'

    class Meta:
        managed = True
        db_table = 'stack_groups'
        unique_together = (('group', 'stack'),)
