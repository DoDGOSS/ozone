import uuid
import json
from django.db import models
from django.utils import timezone
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
        return f'{self.name} for user: {self.user.id}'

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

    class Meta:
        managed = True
        db_table = 'dashboard'
