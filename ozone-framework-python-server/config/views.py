from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from config.helpers.tree import file_tree_helper


class SystemVersionView(APIView):
    """
    gets the system version (Back end)
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({'version': settings.SYSTEM_VERSION})


class HelpFileView(APIView):
    """
    gets the media files version (Back end)
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        help_file_location = settings.HELP_FILES
        return Response(file_tree_helper(url=settings.HOST_URL_HELPER, destination=help_file_location))
