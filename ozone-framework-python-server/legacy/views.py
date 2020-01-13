from django.conf import settings
from django.utils.decorators import method_decorator
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .serializers import PreferenceValueSerializer, WidgetTypeListSerializer

from domain_mappings.models import RelationshipType, MappingType, DomainMapping

from owf_groups.models import OwfGroup

from people.serializers import PersonBaseSerializer

from preferences.models import Preference
from preferences.serializer import PreferenceSerializer

from widgets.models import WidgetDefinition, WidgetType
from widgets.serializers import WidgetDefinitionSerializer

from rest_framework.authentication import SessionAuthentication


# This is currently a work around for the legacy endpoints,
# used by the client widget api that do not attach a csrf token to the requests.
class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class PreferencesViewSet(GenericViewSet):
    authentication_classes = (CsrfExemptSessionAuthentication,)
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
        return Response(serialized)

    def get(self, request, namespace=None, path=None):
        try:
            pref = Preference.objects.get(user=request.user, namespace=namespace, path=path)
            serialized = PreferenceSerializer(pref).data
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
@permission_classes([IsAuthenticated])
def prefs_widget_list_user_and_group(request):
    filtered_ids = []
    lookup = {}

    if 'group_id' in request.GET:
        try:
            group = OwfGroup.objects.get(id=request.GET['group_id'])
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

        if len(filtered_ids) <= 0:
            return Response([])
        else:
            lookup = {'id__in': filtered_ids}

    # Setup filtering.
    queryset = WidgetDefinition.objects.filter()
    allowed_keys = {
        'widget_name': 'display_name',
        'widget_version': 'widget_version',
        'widget_guid': 'widget_guid',
        'universal_name': 'universal_name',
    }
    for k, v in request.GET.items():
        if k in allowed_keys:
            if v.startswith('%') or k.endswith('%'):
                lookup = {f'{allowed_keys[k]}__contains': v.strip('%')}
            else:
                lookup = {allowed_keys[k]: v.strip('%')}

    if lookup:
        queryset = queryset.filter(**lookup)

    serializer = WidgetDefinitionSerializer(queryset, many=True)
    return Response(serializer.data)


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def widget_has_marketplace(request):
    exists = WidgetDefinition.objects.filter(types__name='marketplace').exists()
    return Response({'data': exists})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def widget_type_list(request):
    order = request.GET.get('order', 'asc')
    widget_types = WidgetType.objects.all().order_by('-display_name' if order == 'desc' else 'display_name')
    serialized = WidgetTypeListSerializer(widget_types, many=True).data

    response = {
        'success': True,
        'count': len(serialized),
        'results': serialized,
    }

    return Response(response)
