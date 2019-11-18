from rest_framework import serializers

from domain_mappings.models import DomainMapping, MappingType, RelationshipType
from people.serializers import PersonBaseSerializer
from .models import OwfGroup, OwfGroupPeople
from django_enum_choices.serializers import EnumChoiceModelSerializerMixin


class OWFGroupSerializer(EnumChoiceModelSerializerMixin, serializers.ModelSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)

        widgets_to_stack_count = DomainMapping.objects.filter(
            src_id=ret['id'],
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_type=MappingType.widget
        )

        # UI Expectation
        extra_ret = {
            'totalStacks': instance.stack_set.count(),
            'totalUsers': instance.people.count(),
            'totalWidgets': widgets_to_stack_count.count(),
        }

        return {**ret, **extra_ret}

    class Meta:
        model = OwfGroup
        exclude = ('people',)


class OWFGroupBaseSerializer(EnumChoiceModelSerializerMixin, serializers.ModelSerializer):
    people = PersonBaseSerializer(many=True, required=False)

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        widgets_to_stack_count = DomainMapping.objects.filter(
            src_id=ret['id'],
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_type=MappingType.widget
        )

        # UI Expectation
        extra_ret = {
            'totalStacks': instance.stack_set.count(),
            'totalUsers': instance.people.count(),
            'totalWidgets': widgets_to_stack_count.count(),
        }

        return {**ret, **extra_ret}

    class Meta:
        model = OwfGroup
        fields = "__all__"


class OWFGroupPeopleBaseSerializer(EnumChoiceModelSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = OwfGroupPeople
        fields = "__all__"


class OWFGroupPeopleSerializer(serializers.ModelSerializer):
    person = PersonBaseSerializer()
    group = OWFGroupSerializer()

    class Meta:
        model = OwfGroupPeople
        fields = "__all__"
