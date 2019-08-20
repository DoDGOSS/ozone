from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions


class SystemVersionView(APIView):
    """
    gets the system version (Back end)
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({'version': settings.SYSTEM_VERSION})
