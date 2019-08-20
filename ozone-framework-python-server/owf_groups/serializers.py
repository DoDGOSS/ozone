from rest_framework import serializers
from .models import OwfGroup, OwfGroupPeople


class OWFGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwfGroup
        exclude = ('people', )


class OWFGroupBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwfGroup
        fields = "__all__"


class OWFGroupPeopleSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwfGroupPeople
        fields = "__all__"
