from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework import status
from django.utils.translation import ugettext_lazy as _

from config.owf_mixins import mixins
from .models import OwfGroup, OwfGroupPeople
from .serializers import OWFGroupBaseSerializer, OWFGroupPeopleBaseSerializer, OWFGroupPeopleSerializer
from rest_framework.response import Response
from domain_mappings.models import DomainMapping, RelationshipType, MappingType
from widgets.models import WidgetDefinition
from widgets.serializers import WidgetDefinitionSerializer


class OWFGroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows owf groups to be viewed or edited.
    """
    queryset = OwfGroup.objects.filter(stack_default=False)
    serializer_class = OWFGroupBaseSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name']


class OWFGroupPeopleViewSet(mixins.BulkDestroyModelMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows group people to be viewed or edited.
    """
    queryset = OwfGroupPeople.objects.all()
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['group', 'person']

    # TODO - May need to update this to include DELETE
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OWFGroupPeopleBaseSerializer
        else:
            return OWFGroupPeopleSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            filters = {'group_id': request.data.get('group_id')}
            id_list = request.data and request.data.get('id')
            person_id = request.data and request.data.get('person_id')
            person_ids = request.data and request.data.get('person_ids')

            if id_list:
                filters.update({
                    'id__in': list(map(int, id_list))
                })
            elif person_id:
                filters.update({
                    'person_id': person_id
                })
            elif person_ids:
                filters.update({
                    'person_id__in': list(map(int, person_ids))
                })
            else:
                return Response({'detail': 'missing person_id or person_ids'}, status=status.HTTP_400_BAD_REQUEST)

            return self.bulk_destroy(request, **filters)
        except (ValueError,):
            return Response(status=status.HTTP_400_BAD_REQUEST)


class OWFGroupWidgetViewSet(APIView):
    permission_classes = (IsAdminUser,)
    default_error_messages = {
        'object_404': _('Object not found for {0}')
    }

    def get(self, request, format=None):

        group_id = request.query_params.get('group_id', None)
        widget_id = request.query_params.get('widget_id', None)

        # TODO: Find the URL for this in the legacy code.
        if group_id is None and widget_id is None:
            # Get all groups & all widgets

            return Response({'Error': 'Needs Parameter Either group_id or widget_id'},
                            status=status.HTTP_400_BAD_REQUEST)

        elif group_id is not None and widget_id is None:
            # specific group
            # TODO - May want to consider moving this to the model
            if OwfGroup.objects.filter(id=group_id).exists():
                group_widgets_domain_mappings = DomainMapping.objects.filter(
                    relationship_type=RelationshipType.owns,
                    src_type=MappingType.group, src_id=group_id,
                    dest_type=MappingType.widget
                )
                group_widgets_domain_mappings = group_widgets_domain_mappings.values_list(
                    'dest_id', flat=True
                )
                widgets = WidgetDefinition.objects.filter(id__in=group_widgets_domain_mappings)
                group = OwfGroup.objects.get(id=group_id)
                serialize_group = OWFGroupBaseSerializer(group)
                widget_serializer = WidgetDefinitionSerializer(widgets, many=True)
                return Response({'group': serialize_group.data,
                                 'widgets': widget_serializer.data})
            else:
                return Response({'Error': 'Group Does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

        elif widget_id is not None and group_id is None:
            # specific widget
            # TODO - May want to consider moving this to the model
            if DomainMapping.objects.filter(dest_id=widget_id).exists():
                get_widget_from_domain_mapping = DomainMapping.objects.filter(
                    relationship_type=RelationshipType.owns,
                    src_type=MappingType.group,
                    dest_type=MappingType.widget,
                    dest_id=widget_id
                )

                group_widgets_domain_mappings = get_widget_from_domain_mapping.values_list(
                    'src_id', flat=True
                )
                groups = OwfGroup.objects.filter(id__in=group_widgets_domain_mappings)
                widget = WidgetDefinition.objects.get(id=widget_id)
                serialize_widget = WidgetDefinitionSerializer(widget)
                serialize_groups = OWFGroupBaseSerializer(groups, many=True)
                return Response({'widget': serialize_widget.data,
                                 'groups': serialize_groups.data})

            return Response({'Error': 'Widget Does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'Error': 'Query Error'}, status=status.HTTP_400_BAD_REQUEST)

    def get_widget_and_groups_via_request_data(self, request):
        group_filters = {}
        group_ids = request.data and request.data.get('group_ids')

        if group_ids:
            group_filters.update({
                'id__in': list(map(int, group_ids))
            })
        else:
            group_filters.update({
                'id__in': (request.data.get('group_id'), )
            })

        widget = WidgetDefinition.objects.get(pk=request.data.get('widget_id'))
        groups = OwfGroup.objects.filter(**group_filters)
        return widget, groups

    def post(self, request):
        try:
            widget, groups = self.get_widget_and_groups_via_request_data(request)
            if not groups:
                raise OwfGroup.DoesNotExist

            for _group in groups:
                instance, _ = _group.add_widget(widget=widget)

        except OwfGroup.DoesNotExist:
            return Response({"group_id": [(self.default_error_messages['object_404']).format('OwfGroup')]},
                            status=status.HTTP_400_BAD_REQUEST)

        except WidgetDefinition.DoesNotExist:
            return Response({"widget_id": [(self.default_error_messages['object_404']).format('WidgetDefinition')]},
                            status=status.HTTP_400_BAD_REQUEST)

        else:
            serialize_widget = WidgetDefinitionSerializer(widget)
            serialize_groups = OWFGroupBaseSerializer(groups, many=True)
            return Response({'widget': serialize_widget.data,
                             'groups': serialize_groups.data},
                            status=status.HTTP_201_CREATED)

    def delete(self, request):
        try:
            widget, groups = self.get_widget_and_groups_via_request_data(request)
            if not groups:
                raise OwfGroup.DoesNotExist

            for _group in groups:
                _group.remove_widget(widget=widget)

        except OwfGroup.DoesNotExist:
            return Response({"group_id": [(self.default_error_messages['object_404']).format('OwfGroup')]},
                            status=status.HTTP_400_BAD_REQUEST)

        except WidgetDefinition.DoesNotExist:
            return Response({"widget_id": [(self.default_error_messages['object_404']).format('WidgetDefinition')]},
                            status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(status=status.HTTP_204_NO_CONTENT)
