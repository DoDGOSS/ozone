from rest_framework import serializers
from .models import WidgetDefinition, WidgetDefinitionWidgetTypes, WidgetDefIntent, WidgetDefIntentDataTypes, WidgetType


class WidgetDefinitionSerializer(serializers.ModelSerializer):
    intents = serializers.JSONField(initial=dict, required=False)

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

        ret.update(extra_ret)
        return ret

    class Meta:
        model = WidgetDefinition
        fields = '__all__'


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
