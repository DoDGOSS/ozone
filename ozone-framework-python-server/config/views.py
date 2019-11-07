from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from config.helpers.tree import tree_to_json
import logging
from django.contrib.auth import login, logout
from rest_framework import views, generics, response, permissions, authentication
from .serializers import LoginSerializer
from people.serializers import PersonBaseSerializer

# Get an instance of a logger
logger = logging.getLogger(__name__)


class SystemVersionView(APIView):
    """
    gets the system version (Back end)
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({'version': settings.SYSTEM_VERSION})


class HelpFileView(APIView):
    """
    gets the help files and server location of the files
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response(tree_to_json(settings.HELP_FILES))


class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return response.Response(PersonBaseSerializer(user).data)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        print("logging out")
        logout(request)
        return response.Response()
