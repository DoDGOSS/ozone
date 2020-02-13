from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsStackOwner
from .models import Dashboard
from .serializers import DashboardBaseSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status


class DashboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dashboards to be viewed or edited.
    """
    # TODO: filter out dashboard's that are marked for deletion on a GET
    serializer_class = DashboardBaseSerializer
    permission_classes = (IsAuthenticated, IsStackOwner)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['guid', ]

    def get_queryset(self):
        return Dashboard.objects.filter(user=self.request.user, marked_for_deletion=False)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == request.user:
            instance.marked_for_deletion = True
            instance.save()
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['post'], detail=True, permission_classes=(IsAuthenticated, ))
    def restore(self, request, pk=None):
        dashboard = self.get_object()

        if request.user != dashboard.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        dashboard.restore()
        dashboard.refresh_from_db()

        serialized_dashboard = DashboardBaseSerializer(dashboard)
        return Response(serialized_dashboard.data)


class DashboardAdminViewSet(viewsets.ModelViewSet):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardBaseSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['guid', ]
