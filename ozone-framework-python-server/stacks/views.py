from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from config.owf_mixins import mixins
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

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['post'], detail=True, permission_classes=(IsAuthenticated, ))
    def restore(self, request, pk=None):
        stack = Stack.objects.get(pk=pk)

        stack.restore(user=request.user)
        stack.refresh_from_db()

        serialized_stack = StackSerializer(stack)
        return Response(serialized_stack.data)

    def perform_destroy(self, instance):
        # removing user from group will clean up the dashboards and widgets
        instance.default_group.remove_user(self.request.user)


class StackAdminViewSet(viewsets.ModelViewSet):
    queryset = Stack.objects.all()
    serializer_class = StackSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'stack_context']

    @action(methods=['patch'], detail=True, permission_classes=(IsAdminUser,))
    def assign_to_me(self, request, pk=None):
        stack = self.get_object()
        stack.owner = request.user
        stack.default_group.people.add(request.user)
        stack.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, stack):
        all_stack_dashboards = Dashboard.objects.filter(stack=stack)
        all_stack_dashboard_ids = list(all_stack_dashboards.values_list("id", flat=True))
        DomainMapping.objects.filter(src_id__in=all_stack_dashboard_ids, src_type=MappingType.dashboard).delete()
        DomainMapping.objects.filter(dest_id__in=all_stack_dashboard_ids, dest_type=MappingType.dashboard).delete()
        if stack.default_group:
            stack.default_group.delete()
        stack.delete()


class StackGroupsViewSet(mixins.BulkDestroyModelMixin, viewsets.ModelViewSet):
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

    # Support deletion using stack_id and group_id or list of group_ids, so that we don't have to
    # modify the frontend to keep track of the PK of the intermediary tables
    def destroy(self, request, *args, **kwargs):
        try:
            filters = {'stack_id': request.data.get('stack_id')}
            id_list = request.data and request.data.get('id')
            group_id = request.data and request.data.get('group_id')
            group_ids = request.data and request.data.get('group_ids')

            if id_list:
                filters.update({
                    'id__in': list(map(int, id_list))
                })
            elif group_id:
                filters.update({
                    'group_id': group_id
                })
            elif group_ids:
                filters.update({
                    'group_id__in': list(map(int, group_ids))
                })
            else:
                return Response({'detail': 'missing group_id or group_ids'}, status=status.HTTP_400_BAD_REQUEST)

            return self.bulk_destroy(request, **filters)
        except (ValueError,):
            return Response(status=status.HTTP_400_BAD_REQUEST)
