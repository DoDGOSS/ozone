from rest_framework import serializers
from django_enum_choices.serializers import EnumChoiceModelSerializerMixin

from owf_groups.serializers import OWFGroupSerializer
from .models import Stack, StackGroups
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


class StackGroupsSerializer(EnumChoiceModelSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = StackGroups
        fields = '__all__'


class StackGroupsSerializerList(EnumChoiceModelSerializerMixin, serializers.ModelSerializer):

    group = OWFGroupSerializer()
    stack = StackBaseSerializer()

    class Meta:
        model = StackGroups
        fields = ('group', 'stack')
