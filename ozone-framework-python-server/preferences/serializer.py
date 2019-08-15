from rest_framework import serializers
from .models import Preference
from people.models import Person
from people.serializers import PersonBaseSerializer


class PreferenceSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Person.objects.all(),)

    class Meta:
        model = Preference
        fields = (
            'id',
            'user',
            'namespace',
            'path',
            'value',
        )

    def to_representation(self, instance):
        ret = super(PreferenceSerializer, self).to_representation(instance)
        is_list_view = isinstance(self.instance, list)
        extra_ret = {'user': {
            'userId': instance.user.username
            }
        } if is_list_view else {'user': {
            'userId': instance.user.username
            }
        }
        ret.update(extra_ret)
        return ret


class PreferenceNestedSerializer(serializers.ModelSerializer):
    user = PersonBaseSerializer(many=False)

    class Meta:
        model = Preference
