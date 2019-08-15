from rest_framework import serializers
from .models import IntentDataTypes, IntentDataType, Intent


class IntentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intent
        fields = '__all__'


class IntentDataTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntentDataTypes
        fields = '__all__'


class IntentDataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntentDataType
        fields = '__all__'
