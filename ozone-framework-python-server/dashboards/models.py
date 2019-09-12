import uuid
import json
from django.db import models
from django.utils import timezone
from owf_groups.models import OwfGroup
from domain_mappings.models import RelationshipType, MappingType, DomainMapping


class Dashboard(models.Model):
    id = models.BigAutoField(primary_key=True)
    version = models.BigIntegerField(default=0)
    isdefault = models.BooleanField(blank=True, default=False)
    dashboard_position = models.IntegerField(blank=True, default=0)
    altered_by_admin = models.BooleanField(blank=True, default=False)
    guid = models.CharField(unique=True, max_length=255, default=uuid.uuid4)
    name = models.CharField(max_length=200)
    user = models.ForeignKey('people.Person', on_delete=models.CASCADE, blank=True, null=True,
                             related_name='dashboard_user')
    description = models.CharField(max_length=4000, blank=True, null=True)
    created_by = models.ForeignKey('people.Person', on_delete=models.SET_NULL, blank=True, null=True,
                                   related_name='dashboard_created_by')
    created_date = models.DateTimeField(blank=True, null=True, default=timezone.now)
    edited_by = models.ForeignKey('people.Person', on_delete=models.SET_NULL, blank=True, null=True,
                                  related_name='dashboard_edited_by')
    edited_date = models.DateTimeField(blank=True, null=True)
    layout_config = models.TextField(blank=True, null=True)
    locked = models.BooleanField(default=False, blank=True, null=True)
    stack = models.ForeignKey('stacks.Stack', on_delete=models.CASCADE, blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    icon_image_url = models.CharField(max_length=2083, blank=True, null=True)
    published_to_store = models.BooleanField(default=False, blank=True, null=True)
    marked_for_deletion = models.BooleanField(default=False, blank=True, null=True)

    def __str__(self):
        return self.name

    @staticmethod
    def purge_all_user_dashboards(user):
        for group in user.groups.all():
            Dashboard.purge_user_dashboards_for_group(user, group)

    @staticmethod
    def purge_user_dashboards_for_group(user, group):
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
            dest_id__in=group_dashboard_mappings.values("dest_id")
        )
        user_dashboards = Dashboard.objects.filter(
            pk__in=group_dashboard_clone_mappings.values("src_id"),
            user=user
        )
        user_dashboard_mappings = DomainMapping.objects.filter(
            src_id__in=user_dashboards.values("id"),
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_type=MappingType.dashboard
        )

        user_dashboards.delete()
        user_dashboard_mappings.delete()

    class Meta:
        managed = True
        db_table = 'dashboard'
