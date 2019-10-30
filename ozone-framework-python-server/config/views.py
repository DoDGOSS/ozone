from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from config.helpers.tree import tree_to_json


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
