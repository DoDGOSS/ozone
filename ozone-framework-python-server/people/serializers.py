import json
from rest_framework import serializers

from preferences.models import Preference
from widgets.serializers import WidgetDefinitionSerializer
from .models import Person, PersonWidgetDefinition


class PersonBaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)

        groups_object_to_modify = [item for item in instance.groups.filter(stack_default=False).values()]
        for item in groups_object_to_modify:
            item['status'] = item['status'].value
        json_groups = json.dumps([dict(item) for item in groups_object_to_modify])

        # client panel theme for user
        try:
            theme = Preference.objects.get(namespace='owf', path='selected_theme', user_id=ret['id']).value
        except Preference.DoesNotExist:
            theme = ""

        extra_ret = {
            'user_id': ret['username'],
            'groups': json.loads(json_groups),
            'roles': [],
            'theme': theme,
        }
        ret.update(extra_ret)
        return ret

    class Meta:
        model = Person
        exclude = ('password',)


class PersonThinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'username', 'email')


class PersonWidgetDefinitionBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonWidgetDefinition
        fields = '__all__'
        extra_kwargs = {
            'person': {'required': True},
            'widget_definition': {'required': True}
        }


class PersonWidgetDefinitionSerializer(serializers.ModelSerializer):
    person = PersonBaseSerializer()
    widget_definition = WidgetDefinitionSerializer()

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        extra_ret = {}
        person = ret['person']
        widget_def = ret['widget_definition']['value']

        # UI Expectation
        extra_ret.update({
            # 'namespace': widget_def['display_name'],
            # 'url': widget_def['widget_url'],
            # 'headerIcon': widget_def['image_url_medium'],
            # 'image': widget_def['image_url_medium'],
            # 'smallIconUrl': widget_def['image_url_small'],
            # 'largeIconUrl': widget_def['image_url_medium'],
            # 'widgetTypes': widget_def['types'],

            # copy from person to widget_def object.
            'userId': str(person['id']),
            'userRealName': person['user_real_name'],

            # copy from person widget def to widget_def object
            'visible': bool(ret['visible']),
            'position': int(ret['pwd_position']) if ret['pwd_position'] else 0,
            'disabled': bool(ret['disabled']),
            'favorite': bool(ret['favorite']),
            'groupWidget': ret['group_widget'],
            'userWidget': ret['user_widget'],

            # # confirm these.
            # 'editable': False,
            # 'minimized': False,
            # 'maximized': False,
            # 'x': 0,
            # 'y': 0,
        })

        expectation = {
            'id': ret['id'],
            'widget_id': widget_def['id'],
            # 'path': str(ret['id']),
            'path': widget_def['widget_guid'],
            'namespace': "widget",
            'value': {**widget_def, **extra_ret},
            'person': person
        }

        return expectation

    class Meta:
        model = PersonWidgetDefinition
        fields = '__all__'
        extra_kwargs = {
            'person': {'required': True},
            'widget_definition': {'required': True}
        }
