from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Stack, StackGroups
from .serializers import StackSerializer, StackGroupsSerializer, StackGroupsSerializerList
from dashboards.permissions import IsStackOwner
from dashboards.models import Dashboard
from domain_mappings.models import DomainMapping, MappingType


class StackViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stacks to be viewed or edited.
    """
    # TODO - Should we filter this or return all as legacy did
    queryset = Stack.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = StackSerializer

    @action(methods=['post'], detail=True, permission_classes=(IsAuthenticated, IsStackOwner))
    def share(self, request, pk=None):
        stack = Stack.objects.get(pk=pk)
        stack.share()

        return Response(status=status.HTTP_200_OK)


class StackAdminViewSet(viewsets.ModelViewSet):
    queryset = Stack.objects.all()
    serializer_class = StackSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', ]

    def perform_destroy(self, stack):
        all_stack_dashboards = Dashboard.objects.filter(stack=stack)
        all_stack_dashboard_ids = list(all_stack_dashboards.values_list("id", flat=True))
        DomainMapping.objects.filter(src_id__in=all_stack_dashboard_ids, src_type=MappingType.dashboard).delete()
        DomainMapping.objects.filter(dest_id__in=all_stack_dashboard_ids, dest_type=MappingType.dashboard).delete()
        stack.default_group.delete()
        stack.delete()


class StackGroupsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stack groups to be viewed or edited
    """
    queryset = StackGroups.objects.all()
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['stack', 'group']

    def get_serializer_class(self):
        if self.action == 'list':
            return StackGroupsSerializerList
        else:
            return StackGroupsSerializer
