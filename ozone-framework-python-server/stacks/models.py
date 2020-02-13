import time
import json
import uuid
from django.dispatch import receiver
from django.utils import timezone
from django.db import models, IntegrityError
from owf_groups.models import OwfGroup, GroupStatus, OwfGroupPeople
from people.models import Person, PersonWidgetDefinition
from domain_mappings.models import RelationshipType, MappingType, DomainMapping
from dashboards.models import Dashboard
from widgets.models import WidgetDefinition


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

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())

        if not self.stack_context:
            self.stack_context = uuid.uuid4()

        super(Stack, self).save(*args, **kwargs)

    def add_dashboard(self, user, kwargs):
        # TODO: once we establish the layout config, add logic to regenerate the layout config
        new_group_dashboard = Dashboard.objects.create(
            stack=self,
            **kwargs)
        DomainMapping.create_group_dashboard_mapping(self.default_group, new_group_dashboard)

        if 'guid' in kwargs.keys():
            kwargs.pop('guid')
        new_user_dashboard = Dashboard.objects.create(
            stack=self,
            user=user,
            **kwargs)
        DomainMapping.create_user_dashboard_mapping(new_user_dashboard, new_group_dashboard)

        return new_group_dashboard, new_user_dashboard

    def share(self):
        self.approved = True
        self.save()

        group_dashboard_mappings = DomainMapping.objects.get_group_dashboard_mappings(self.default_group.id)

        for group_dashboard_mapping in group_dashboard_mappings:
            group_dashboard = Dashboard.objects.get(pk=group_dashboard_mapping.dest_id)
            cloned_dashboard_mappings = DomainMapping.objects.get_dashboard_clone_mappings(group_dashboard.id)
            cloned_dashboard_ids = list(cloned_dashboard_mappings.values_list("src_id", flat=True))
            owner_dashboard = Dashboard.objects.get(pk__in=cloned_dashboard_ids, user=self.owner)

            if (owner_dashboard.marked_for_deletion):
                cloned_dashboards = Dashboard.objects.filter(pk__in=cloned_dashboard_ids)

                # cloned_dashboards will include the owner's dashboard
                cloned_dashboards.delete()
                cloned_dashboard_mappings.delete()
                group_dashboard.delete()
                group_dashboard_mapping.delete()

            else:
                group_dashboard.name = owner_dashboard.name
                group_dashboard.description = owner_dashboard.description
                group_dashboard.type = owner_dashboard.type
                group_dashboard.locked = owner_dashboard.locked
                group_dashboard.dashboard_position = owner_dashboard.dashboard_position
                group_dashboard.layout_config = owner_dashboard.layout_config

                owner_dashboard.published_to_store = True
                owner_dashboard.save()
                group_dashboard.published_to_store = True
                group_dashboard.save()

            widgets_to_add_to_stack = group_dashboard.get_widgets()
            for widget in widgets_to_add_to_stack:
                self.default_group.add_widget(widget)

    def restore(self, user):
        group_dashboard_mappings = DomainMapping.objects.get_group_dashboard_mappings(self.default_group.id)

        group_dashboard_clone_mappings = DomainMapping.objects. \
            get_group_dashboard_clone_mappings(group_dashboard_mappings)

        user_dashboards_for_group = Dashboard.objects.filter(
            pk__in=list(group_dashboard_clone_mappings.values_list("src_id", flat=True)),
            user=user
        )

        for user_dashboard in user_dashboards_for_group:
            Dashboard.restore(user_dashboard)

        group_dashboard_ids = group_dashboard_mappings.values_list("dest_id", flat=True)

        user_cloned_dashboards_ids_for_group = DomainMapping.objects.filter(
            src_id__in=list(user_dashboards_for_group.values_list("id", flat=True)),
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_type=MappingType.dashboard
        ).values_list("dest_id", flat=True)

        # Create missing dashboards
        # TODO: extract this into a method for reuse. Same logic exists in people/models.py
        # TODO: modify this to use .exclude(). This was originally refactored, because of issues
        #       using .difference() on querysets with mysql.
        missing_dashboard_ids = []
        for group_dashboard_id in group_dashboard_ids:
            if group_dashboard_id not in user_cloned_dashboards_ids_for_group:
                missing_dashboard_ids.append(group_dashboard_id)
        Dashboard.create_missing_dashboards_for_user(user, missing_dashboard_ids)

    @classmethod
    def create(cls, user, kwargs):
        new_dashboard_layout_config = ''
        try:
            new_dashboard_layout_config = kwargs.pop('preset_layout')
        except KeyError:
            pass

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

        # TODO: move logic to create a default group dashboard to a manager
        new_group_dashboard = Dashboard.objects.create(
            layout_config=new_dashboard_layout_config,
            isdefault=False,
            stack=new_stack,
            name=new_stack.name,
            description=kwargs.get('description'),
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
            description=kwargs.get('description'),
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
        stack = obj_data.pop('stack')
        group = obj_data.pop('group')
        new_stack_group, _ = super().get_or_create(
            stack=stack,
            group=group
        )

        # Set requires_sync for all users in group added to stack
        group.people.all().update(requires_sync=True)

        return new_stack_group


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
        constraints = [
            models.UniqueConstraint(fields=['group', 'stack'], name='unique_stack_groups')
        ]


@receiver(models.signals.post_delete, sender=StackGroups)
def stack_group_cleanup(sender, instance, *args, **kwargs):
    stack = instance.stack
    group = instance.group

    default_dashboard_ids = DomainMapping.objects.get_default_dashboard_ids(stack)
    user_cloned_dashboards_ids = DomainMapping.objects.get_user_cloned_dashboards_ids(default_dashboard_ids)

    users_dashboards = Dashboard.objects.filter(pk__in=user_cloned_dashboards_ids)
    stack_groups_filter_stack = StackGroups.objects.filter(stack=stack).values('group')

    for user_dashboard in users_dashboards:
        if not OwfGroupPeople.objects.filter(group=stack.default_group, person=user_dashboard.user).exists():
            if not OwfGroupPeople.objects.filter(
                    group_id__in=stack_groups_filter_stack, person=user_dashboard.user
            ).exists():
                delete_domain_mapping = DomainMapping.objects.get_user_clone_of_groups_dashboard_domain_mapping(
                    user_dashboard_id=user_dashboard.id, default_dashboard_ids_query=default_dashboard_ids
                )

                delete_domain_mapping.delete()
                user_dashboard.delete()
    group.people.update(requires_sync=True)
