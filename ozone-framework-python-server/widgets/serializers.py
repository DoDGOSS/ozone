from django.db.models import Count
from rest_framework import serializers

from domain_mappings.models import DomainMapping, RelationshipType, MappingType
from owf_groups.models import OwfGroup
from .models import WidgetDefinition, WidgetDefinitionWidgetTypes, WidgetDefIntent, WidgetDefIntentDataTypes, WidgetType


class WidgetDefinitionWidgetTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = WidgetDefinitionWidgetTypes
        fields = '__all__'


class WidgetDefIntentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WidgetDefIntent
        fields = '__all__'


class WidgetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WidgetType
        fields = '__all__'


class WidgetDefIntentDataTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = WidgetDefIntentDataTypes
        fields = '__all__'


class WidgetDefinitionSerializer(serializers.ModelSerializer):
    intents = serializers.JSONField(initial=dict, required=False)
    types = WidgetTypeSerializer(many=True, required=False)

    def _intent_action_with_data_types(self, intent_qs):
        intents_obj = []
        actions = intent_qs.values_list('intent__action', flat=True)
        for action in actions:
            intents_obj.append({
                "action": action,
                "dataTypes": list(intent_qs.filter(intent__action=action).values_list(
                    'widgetdefintentdatatypes__intent_data_type__data_type', flat=True)),
            })
        return intents_obj

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        extra_ret = {}

        if not hasattr(instance, 'intents'):
            intents_obj = {"intents": {}}
            intent_send = WidgetDefIntent.objects.filter(widget_definition=instance, send=True)
            intent_receive = WidgetDefIntent.objects.filter(widget_definition=instance, receive=True)

            intents_obj["intents"]["send"] = self._intent_action_with_data_types(intent_send)
            intents_obj["intents"]["receive"] = self._intent_action_with_data_types(intent_receive)
            extra_ret.update(intents_obj)

        # Count Groups.
        domain_data_groups = DomainMapping.objects.filter(
            relationship_type=RelationshipType.owns,
            src_type=MappingType.group,
            dest_type=MappingType.widget,
            dest_id=instance.id
        )

        # Count Group Users.
        group_ids = domain_data_groups.values_list('src_id', flat=True)
        users_in_group = 0
        for group in OwfGroup.objects.filter(id__in=group_ids):
            users_in_group += group.people.count()

        # UI Expectation
        ret.update({
            'namespace': ret['display_name'],
            'url': ret['widget_url'],
            'headerIcon': ret['image_url_medium'],
            'image': ret['image_url_medium'],
            'smallIconUrl': ret['image_url_small'],
            'largeIconUrl': ret['image_url_medium'],
            'widgetTypes': ret['types'],

            'definitionVisible': ret['visible'],
            'mediumIconUrl': ret['image_url_medium'],
            'widgetVersion': str(ret['version']),
            'originalName': ret['display_name'],
            'background': bool(ret['background']),

            # confirm these.
            'allRequired': [],
            'directRequired': [],
            'totalGroups': domain_data_groups.count(),
            'totalUsers': users_in_group,
            'editable': False,
            'minimized': False,
            'maximized': False,
            'x': 0,
            'y': 0,
        })

        expectation = {
            'id': ret['id'],
            # 'path': str(ret['id']),
            'path': ret['widget_guid'],
            'namespace': "widget",
            'value': {**ret, **extra_ret},
        }

        return expectation

    class Meta:
        model = WidgetDefinition
        fields = '__all__'
