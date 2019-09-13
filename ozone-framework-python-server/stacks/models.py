import uuid
from django.utils import timezone
from django.db import models, IntegrityError
from owf_groups.models import OwfGroup, GroupStatus
from people.models import Person
from domain_mappings.models import RelationshipType, MappingType, DomainMapping
from dashboards.models import Dashboard


class Stack(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0, blank=True)
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=4000, blank=True, null=True)
    stack_context = models.CharField(unique=True, max_length=200, blank=True, default=uuid.uuid4)
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

    def add_dashboard(self, user, kwargs):
        # TODO: once we establish the layout config, add logic to regenerate the layout config
        new_group_dashboard = Dashboard.objects.create(
            stack=self,
            **kwargs)
        DomainMapping.create_group_dashboard_mapping(self.default_group, new_group_dashboard)

        new_user_dashboard = Dashboard.objects.create(
            stack=self,
            user=user,
            **kwargs)
        DomainMapping.create_user_dashboard_mapping(new_user_dashboard, new_group_dashboard)

        return new_user_dashboard

    @classmethod
    def create(cls, user, kwargs):
        default_group = OwfGroup.objects.create(
            name=str(uuid.uuid4()),
            stack_default=True,
            automatic=False,
            status=GroupStatus.active)

        new_stack = cls.objects.create(
            default_group=default_group,
            owner=user,
            **kwargs)

        # TODO: move the logic for creating a default group to a manager
        default_group.people.add(user)

        new_dashboard_layout_config = (kwargs['layout_config'] if hasattr(kwargs, "layout_config") else "")

        # TODO: move logic to create a default group dashboard to a manager
        new_group_dashboard = Dashboard.objects.create(
            layout_config=new_dashboard_layout_config,
            isdefault=False,
            stack=new_stack,
            name=new_stack.name,
            created_date=timezone.now()
        )

        # TODO: move the logic of creating new domain mapping to a manager
        new_group_dashboard_domain_mapping = DomainMapping.objects.create(
            src_id=default_group.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_id=new_group_dashboard.id,
            dest_type=MappingType.dashboard)

        # TODO: move logic of creating new user dashboard to a manager
        new_user_dashboard = Dashboard.objects.create(
            layout_config=new_dashboard_layout_config,
            stack=new_stack,
            name=new_stack.name,
            user=user,
            created_date=timezone.now()
        )

        # TODO: move logic of creating dashboard clone domain mapping to a manager
        new_user_dashboard_domain_mapping = DomainMapping.objects.create(
            src_id=new_user_dashboard.id,
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_id=new_group_dashboard.id,
            dest_type=MappingType.dashboard)

        return new_stack

    def add_group(self, group):
        payload = {
            'group': group,
            'stack': self
        }
        new_stack_group = StackGroups.objects.create(**payload)

        return new_stack_group

    class Meta:
        managed = True
        db_table = 'stack'


class StackGroupsManager(models.Manager):

    def create(self, **obj_data):
        try:
            stack = obj_data.pop('stack')
            group = obj_data.pop('group')
            new_stack_group = super().create(
                stack=stack,
                group=group
            )

            # Set requires_sync for all users in group added to stack
            group.people.all().update(requires_sync=True)

            return new_stack_group

        except IntegrityError:
            print("Relationship already exists")


class StackGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(OwfGroup, on_delete=models.CASCADE)
    stack = models.ForeignKey(Stack, on_delete=models.CASCADE)

    objects = StackGroupsManager()

    def __str__(self):
        return f'{self.group.name} for stack name {self.stack.name}'

    class Meta:
        managed = True
        db_table = 'stack_groups'
        unique_together = (('group', 'stack'),)
