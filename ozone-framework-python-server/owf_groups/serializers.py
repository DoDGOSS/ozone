from rest_framework import serializers
from people.serializers import PersonBaseSerializer
from .models import OwfGroup, OwfGroupPeople
from django_enum_choices.serializers import EnumChoiceModelSerializerMixin


class OWFGroupSerializer(EnumChoiceModelSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = OwfGroup
        exclude = ('people', )


class OWFGroupBaseSerializer(EnumChoiceModelSerializerMixin, serializers.ModelSerializer):
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
