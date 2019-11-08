from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .serializers import PreferenceValueSerializer

from people.serializers import PersonBaseSerializer

from preferences.models import Preference
from preferences.serializer import PreferenceSerializer


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
