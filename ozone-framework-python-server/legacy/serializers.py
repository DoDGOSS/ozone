from rest_framework import serializers
from preferences.models import Preference
from widgets.models import WidgetType


class PreferenceValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = (
            'value',
        )


class WidgetTypeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WidgetType
        fields = (
            'id',
            'name',
            'display_name',
        )
