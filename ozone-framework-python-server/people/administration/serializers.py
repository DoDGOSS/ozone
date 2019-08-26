from rest_framework import serializers
from people.models import Person


class AdministrationOfUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Person
        fields = '__all__'

    def create(self, validated_data):
        user = super(AdministrationOfUserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super(AdministrationOfUserSerializer, self).update(instance, validated_data)
