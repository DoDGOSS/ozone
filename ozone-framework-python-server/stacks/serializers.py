from rest_framework import serializers
from .models import Stack
from owf_groups.serializers import OWFGroupSerializer
from people.serializers import PersonBaseSerializer


class StackSerializer(serializers.ModelSerializer):
    owner = PersonBaseSerializer(read_only=True)
    default_group = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Stack
        read_only_fields = ('version', 'stack_context', 'owner')
        extra_kwargs = {'name': {'required': True}}
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get("request")
        new_stack = Stack.create(request.user, validated_data)

        return new_stack


class StackBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stack
        fields = '__all__'
