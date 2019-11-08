from rest_framework import serializers
from preferences.models import Preference


class PreferenceValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = (
            'value',
        )
