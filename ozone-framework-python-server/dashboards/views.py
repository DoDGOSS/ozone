from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Dashboard
from .serializers import GeneralDashboardSerializer, DashBoardSerializer
from django_filters.rest_framework import DjangoFilterBackend


class DashboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    queryset = Dashboard.objects.all()
    serializer_class = GeneralDashboardSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['guid', ]


class DashboardNestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    queryset = Dashboard.objects.all()
    # serializer_class = DashBoardSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['guid', ]

    def get_serializer_class(self):
        if self.action == 'create':
            return GeneralDashboardSerializer
        if self.action == 'update':
            return GeneralDashboardSerializer
        if self.action == 'partial_update':
            return GeneralDashboardSerializer
        else:
            return DashBoardSerializer


