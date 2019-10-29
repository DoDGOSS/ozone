import time
import uuid
import json
from django.db import models
from django.utils import timezone
from domain_mappings.models import RelationshipType, MappingType, DomainMapping


class DashboardsManager(models.Manager):
    def get_dashboards_for_group(self, group):
        group_dashboard_domain_mapping_ids = DomainMapping.objects.filter(
            src_id=group.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_type=MappingType.dashboard
        ).values_list("dest_id", flat=True)
        return self.filter(pk__in=group_dashboard_domain_mapping_ids)

    def get_default_dashboard_for(self, dashboard):
        default_dashboard_id = DomainMapping.objects.filter(
            src_id=dashboard.id,
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_type=MappingType.dashboard
        ).values_list("dest_id", flat=True).first()
        return self.get(pk=default_dashboard_id)


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

    objects = DashboardsManager()

    def __str__(self):
        if self.user:
            return f'{self.name} for user: {self.user.id}'
        # Cloned dashboard
        else:
            return f'Group dashboard: {self.name}'

    def save(self, *args, **kwargs):
        # Version saver for incrementing as time
        self.version = int(time.time())
        super(Dashboard, self).save(*args, **kwargs)

    def get_widgets(self):
        from people.models import PersonWidgetDefinition
        try:
            layout_config = json.loads(self.layout_config)
        except ValueError as e:
            return []

        widgets = []
        for background_widget in layout_config["backgroundWidgets"]:
            user_widget = PersonWidgetDefinition.objects.get(pk=background_widget["userWidgetId"])
            widgets.append(user_widget.widget_definition)

        for panel in layout_config["panels"]:
            for user_widget in panel["widgets"]:
                user_widget = PersonWidgetDefinition.objects.get(pk=user_widget["userWidgetId"])
                widgets.append(user_widget.widget_definition)

        return widgets

    def restore(self):
        default_dashboard = Dashboard.objects.get_default_dashboard_for(self)
        self.name = default_dashboard.name
        self.description = default_dashboard.description
        self.icon_image_url = default_dashboard.icon_image_url
        self.type = default_dashboard.type
        self.locked = default_dashboard.locked
        self.marked_for_deletion = default_dashboard.marked_for_deletion
        self.layout_config = default_dashboard.layout_config
        self.save()

    @staticmethod
    def create_missing_dashboards_for_user(user, missing_dashboard_ids):
        if missing_dashboard_ids:
            missing_group_dashboards = Dashboard.objects.filter(pk__in=missing_dashboard_ids)
            dashboard_item = 0
            for dashboard in missing_group_dashboards.all():
                # Create cloned dashboard with new id
                dashboard.id = None
                dashboard.guid = uuid.uuid4()
                dashboard.user = user
                dashboard.save()
                # Create domain mapping entry for newly cloned dashboard
                DomainMapping.create_user_dashboard_mapping(dashboard, missing_group_dashboards[dashboard_item])
                dashboard_item += 1

    class Meta:
        managed = True
        db_table = 'dashboard'
