from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from config.helpers.tree import tree_to_json
import logging
import os
import subprocess
from django.contrib.auth import login, logout
from rest_framework import views, response, permissions
from django.utils import timezone
from datetime import datetime

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

    def _file_write(self, data, path, filename):
        os.makedirs(path, exist_ok=True)
        if data:
            with open('{}/{}.txt'.format(path, filename), 'w+') as outfile:
                outfile.write(data)
            outfile.close()

    def _file_read(self, path, filename):
        f = open('{}/{}.txt'.format(path, filename), "r")
        return f.read()

    def execute_task_clean_inactive_users(self):
        path = "appconf"
        filename = "inactive_users"
        try:
            last_time = self._file_read(path=path, filename=filename)
            last_time = datetime.strptime(last_time, '%Y-%m-%d %H:%M:%S.%f%z')
            if (timezone.now() - last_time).days >= 1:
                # execute command in background.
                # WinAPI uses CreateProcess, so using DETACHED_PROCESS to detach from parent process.
                params = {'creationflags': 0x00000008} if (os.name == 'nt') else {'close_fds': True}
                subprocess.Popen(["python", "manage.py", "clean_inactive_users"], **params)
                self._file_write(str(timezone.now()), path=path, filename=filename)
        except FileNotFoundError:
            self._file_write(str(timezone.now()), path=path, filename=filename)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)

        # clean inactive users
        # determine last check if greater than 24 hours, run the command.
        self.execute_task_clean_inactive_users()

        return response.Response(PersonBaseSerializer(user).data)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
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
