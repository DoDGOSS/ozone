from rest_framework import serializers

from dashboards.models import Dashboard
from people.models import Person
from owf_groups.models import OwfGroupPeople, OwfGroup
from django.conf import settings


class AdministrationOfUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Person
        fields = ('email', 'username', 'password', 'is_admin')

    def create(self, validated_data):
        if 'is_admin' in validated_data and validated_data['is_admin']:
            user = Person.objects.create_superuser(email=validated_data['email'], username=validated_data['username'],
                                                   password=validated_data.get('password'))
            return user
        else:
            user = Person.objects.create_user(email=validated_data['email'], username=validated_data['username'],
                                              password=validated_data.get('password'))
        return user


class AdministrationOfUserSerializerFull(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        # UI Expectation
        expectation = {
            'totalDashboards': Dashboard.objects.filter(user_id=ret['id']).count(),
            'totalGroups': instance.groups.count(),
            'totalStacks': Person.get_directly_assigned_stacks(instance).count(),
            'totalWidgets': instance.personwidgetdefinition_set.count(),
        }

        ret.update(expectation)
        return ret

    class Meta:
        model = Person
        fields = '__all__'

    def update(self, instance, validated_data):
        if 'is_admin' not in validated_data and instance.is_admin is True:
            group = OwfGroup.objects.get(name=settings.DEFAULT_ADMIN_GROUP)
            remove_from = OwfGroupPeople.objects.get(group_id=group.id, person_id=instance.id)
            remove_from.delete()
        if 'is_admin' in validated_data and instance.is_admin is False:
            group = OwfGroup.objects.get(name=settings.DEFAULT_ADMIN_GROUP)
            add_to_group = OwfGroupPeople(group_id=group.id, person_id=instance.id)
            add_to_group.save()
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super(AdministrationOfUserSerializerFull, self).update(instance, validated_data)
