from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from config.helpers.tree import tree_to_json
import logging
from django.contrib.auth import login, logout
from rest_framework import views, generics, response, permissions, authentication
from .serializers import LoginSerializer
from people.serializers import PersonBaseSerializer
from rest_framework import status


logger = logging.getLogger('events.auditing')


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


class AuditView(APIView):
    """
    gets the help files and server location of the files
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({'message': 'Please use this format'})

    def post(self, request):
        if 'message' in request.data:
            logger.info(f"message: {request.data['message']}")
            return Response({'message': f'{request.data["message"]}'})
        else:
            return Response({'message': 'Please use this format'})


class AccessView(APIView):
    # The client is attempting to send this to the server looking for a 200 and a json object
    # http://localhost:8000/api/v2/access/getConfig?version=7.15.1-v1&dojo.preventCache=1574272184516

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):

        # version = self.request.query_params.get("version", None)
        # dojo = self.request.query_params.get("dojo.preventCache", None)
        return Response({}, status=status.HTTP_200_OK)
