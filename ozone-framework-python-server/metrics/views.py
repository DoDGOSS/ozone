import requests
from django.conf import settings
from rest_framework import permissions
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class MetricsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if(settings.ENABLE_METRICS):
            try:
                response = requests.post(settings.METRICS_SERVER_URL, request.data)
                return Response(response.content, status=status.HTTP_201_CREATED)
            except requests.exceptions.RequestException as e:
                return Response('Request to metrics server failed.', status=status.HTTP_400_BAD_REQUEST)
        return Response('Metrics not enabled', status=status.HTTP_405_METHOD_NOT_ALLOWED)
