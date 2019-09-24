from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStackOwner
from .models import Dashboard
from .serializers import DashboardBaseSerializer
from django_filters.rest_framework import DjangoFilterBackend


class DashboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    queryset = Dashboard.objects.all()
    serializer_class = DashboardBaseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['guid', ]
