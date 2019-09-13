from rest_framework import serializers
from people.models import Person
from owf_groups.models import OwfGroupPeople, OwfGroup
from django.conf import settings


class AdministrationOfUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Person
        fields = ('email', 'username', 'password', 'is_admin')

    def create(self, validated_data):
        if validated_data['is_admin']:
            user = Person.objects.create_superuser(email=validated_data['email'], username=validated_data['username'],
                                                   password=validated_data['password'])
            return user
        else:
            user = Person.objects.create_user(email=validated_data['email'], username=validated_data['username'],
                                              password=validated_data['password'])
        return user


class AdministrationOfUserSerializerFull(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Person
        fields = '__all__'

    def update(self, instance, validated_data):
        if not validated_data['is_admin'] and instance.is_admin is True:
            group = OwfGroup.objects.get(name=settings.DEFAULT_ADMIN_GROUP)
            remove_from = OwfGroupPeople.objects.get(group_id=group.id, person_id=instance.id)
            remove_from.delete()
        if validated_data['is_admin'] and instance.is_admin is False:
            group = OwfGroup.objects.get(name=settings.DEFAULT_ADMIN_GROUP)
            add_to_group = OwfGroupPeople(group_id=group.id, person_id=instance.id)
            add_to_group.save()
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super(AdministrationOfUserSerializerFull, self).update(instance, validated_data)
