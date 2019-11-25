from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.schemas import AutoSchema, ManualSchema
from rest_framework.viewsets import GenericViewSet

from .serializers import PreferenceValueSerializer

from domain_mappings.models import RelationshipType, MappingType, DomainMapping

from owf_groups.models import OwfGroup

from people.models import PersonWidgetDefinition
from people.serializers import PersonBaseSerializer

from preferences.models import Preference
from preferences.serializer import PreferenceSerializer

from widgets.models import WidgetDefinition, WidgetType
from widgets.serializers import WidgetDefinitionSerializer, WidgetTypeSerializer


class PreferencesViewSet(GenericViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Preference.objects.all()
    parser_classes = (FormParser,)
    serializer_class = PreferenceValueSerializer

    value_form_param = openapi.Parameter(
        'value', openapi.IN_FORM, required=True, type=openapi.TYPE_STRING
    )

    @swagger_auto_schema(request_body=None, manual_parameters=[value_form_param])
    def create_update(self, request, namespace=None, path=None):
        value = request.POST['value']
        obj, created = Preference.objects.update_or_create(
            user=request.user, namespace=namespace, path=path,
            defaults={"value": value}
        )
        serialized = PreferenceSerializer(obj).data
        del(serialized['version'])
        return Response(serialized)

    def get(self, request, namespace=None, path=None):
        try:
            pref = Preference.objects.get(user=request.user, namespace=namespace, path=path)
            serialized = PreferenceSerializer(pref).data
            del(serialized['version'])
            return Response(serialized)
        except Preference.DoesNotExist:
            return Response({'success': True, 'preference': None})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def has_preference(request, namespace=None, path=None):
    exists = Preference.objects.filter(user=request.user, namespace=namespace, path=path).exists()
    return Response(
        {'preferenceExist': exists, 'statusCode': 200}
    )


@api_view(['GET'])
@parser_classes([FormParser])
def prefs_widget_list_user_and_group(request):
    filtered_ids = []
    if 'group_id' in request.data:
        try:
            group = OwfGroup.objects.get(id=request.data['group_id'])
            filtered_ids.extend(list(
                DomainMapping.objects.filter(
                    src_id=group.id,
                    src_type=MappingType.group,
                    relationship_type=RelationshipType.owns,
                    dest_type=MappingType.widget,
                ).values_list('dest_id', flat=True)
            ))
        except OwfGroup.DoesNotExist:
            pass

        if len(filtered_ids) == 0:
            return Response([])

    # Setup filtering.
    queryset = WidgetDefinition.objects.filter()
    if 'widgetName' in request.data:
        widget_name = request.data['widgetName']
        if widget_name.startswith('%') and widget_name.endswith('%'):
            queryset = queryset.filter(display_name__contains=widget_name.strip('%'))
        else:
            queryset = queryset.filter(display_name=widget_name)
    if 'widgetVersion' in request.data:
        queryset = queryset.filter(widget_version=request.data['widgetVersion'])
    if 'widgetGuid' in request.data:
        queryset = queryset.filter(widget_guid=request.data['widgetGuid'])
    if 'universalName' in request.data:
        queryset = queryset.filter(universal_name=request.data['universalName'])
    if len(filtered_ids) > 0:
        queryset = queryset.filter(id__in=filtered_ids)

    widgets = []
    for widget in queryset.iterator():
        model = _create_widget_definition_service_model(widget)
        widgets.append(model)

    return Response(widgets)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def server_resources(request):
    return Response({'serverVersion': settings.SYSTEM_VERSION})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def whoami(request):
    serialized_user = PersonBaseSerializer(request.user).data

    converted = {}
    converted['currentId'] = serialized_user['id']
    converted['currentUser'] = serialized_user['user_real_name']
    converted['currentUserName'] = serialized_user['username']
    converted['currentUserPrevLogin'] = serialized_user['prev_login']
    converted['email'] = serialized_user['email']

    return Response(converted)


def _create_widget_definition_service_model(widget):
    serialized = WidgetDefinitionSerializer(widget).data

    widget_guid = serialized['widget_guid']

    total_users = PersonWidgetDefinition.objects.filter(widget_definition=widget).count()
    total_groups = DomainMapping.objects.filter(
        src_id=widget.id,
        src_type=MappingType.widget,
        relationship_type=RelationshipType.owns,
        dest_type=MappingType.group,
    ).count()

    widget_types = []
    for widget_type in widget.types.iterator():
        widget_types.append(_create_widget_type_service_model(widget_type))

    # Add fields.
    serialized.update({
        'totalUsers': total_users,
        'totalGroups':  total_groups,
        'x': 0,
        'y': 0,
        'namespace': serialized['display_name'],
        'url': serialized['widget_url'],
        'headerIcon': serialized['image_url_medium'],
        'image': serialized['image_url_small'],
        'smallIconUrl': serialized['image_url_small'],
        'mediumIconUrl': serialized['image_url_medium'],
        'minimized': False,
        'maximized': False,
        'definitionVisible': serialized['visible'],
        'widgetTypes': widget_types,
    })

    # Delete unneeded fields.
    to_delete = [
        'id',
        'version',
        'image_url_small',
        'image_url_medium',
        'widget_url',
        'widget_guid',
        'display_name',
        'types',
    ]
    for field in to_delete:
        del serialized[field]

    model = {
        'id': widget_guid,
        'namespace': 'widget',
        'value': serialized,
        'path': widget_guid,
    }

    return model


def _create_widget_type_service_model(widget_type):
    model = WidgetTypeSerializer(widget_type).data
    del model['version']
    return model
