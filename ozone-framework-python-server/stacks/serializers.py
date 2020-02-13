from rest_framework import serializers
from django_enum_choices.serializers import EnumChoiceModelSerializerMixin

from domain_mappings.models import DomainMapping, MappingType, RelationshipType
from owf_groups.models import OwfGroup
from owf_groups.serializers import OWFGroupSerializer
from .models import Stack, StackGroups
from people.serializers import PersonBaseSerializer


class StackSerializer(serializers.ModelSerializer):
    groups = OWFGroupSerializer(many=True, required=False, read_only=True)
    owner = PersonBaseSerializer(read_only=True)
    default_group = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    preset_layout = serializers.JSONField(write_only=True, required=False)

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        widgets_to_stack_count = DomainMapping.objects.filter(
            src_id=ret['default_group'],
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_type=MappingType.widget
        )

        try:
            total_users = OwfGroup.objects.get(id=ret['default_group']).people.count()
        except Exception:
            total_users = 0

        # UI Expectation
        extra_ret = {
            'totalDashboards': instance.dashboard_set.count(),
            'totalGroups': instance.stackgroups_set.count(),
            'totalWidgets': widgets_to_stack_count.count(),
            'totalUsers': total_users,
        }

        return {**ret, **extra_ret}

    class Meta:
        model = Stack
        read_only_fields = ('version', 'owner')
        extra_kwargs = {'name': {'required': True}}
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get("request")
        new_stack = Stack.create(request.user, validated_data)

        return new_stack


class StackBaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)

        widgets_to_stack_count = DomainMapping.objects.filter(
            src_id=ret['default_group'],
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_type=MappingType.widget
        )

        try:
            total_users = OwfGroup.objects.get(id=ret['default_group']).people.count()
        except Exception:
            total_users = 0

        # UI Expectation
        extra_ret = {
            'totalDashboards': instance.dashboard_set.count(),
            'totalGroups': instance.stackgroups_set.count(),
            'totalWidgets': widgets_to_stack_count.count(),
            'totalUsers': total_users,
        }

        return {**ret, **extra_ret}

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
