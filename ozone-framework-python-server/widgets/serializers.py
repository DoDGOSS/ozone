from rest_framework import serializers
from .models import WidgetDefinition, WidgetDefinitionWidgetTypes, WidgetDefIntent, WidgetDefIntentDataTypes, WidgetType


class WidgetDefinitionSerializer(serializers.ModelSerializer):
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
