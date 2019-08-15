from rest_framework import serializers
from .models import Person


class PersonBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        exclude = ('password', )


