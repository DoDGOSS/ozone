from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

from .models import OwfGroup, OwfGroupPeople
from .serializers import OWFGroupBaseSerializer, OWFGroupPeopleSerializer
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


class OWFGroupPeopleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows owf groups to be viewed or edited.
    """
    queryset = OwfGroupPeople.objects.all()
    serializer_class = OWFGroupPeopleSerializer
    permission_classes = (IsAdminUser,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['group', 'person']


class OWFGroupDomainMapping(APIView):

    permission_classes = (IsAdminUser,)

    def get(self, request, format=None):

        group_id = request.query_params.get('group_id', None)
        widget_id = request.query_params.get('widget_id', None)

        # TODO: Find the URL for this in the legacy code.
        if group_id is None and widget_id is None:
            # Get all groups & all widgets

            return Response({'Error': 'Needs Parameter Either group_id or widget_id'})

        elif group_id is not None and widget_id is None:
            # specific group
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
                                 'widgets': [widget_serializer.data]})
            else:
                return Response({'Error': 'Group Does Not Exist'})

        elif widget_id is not None and group_id is None:
            # specific widget
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

            return Response({'Error': 'Widget Does Not Exist'})

        else:

            return Response({'Error': 'Query Error'})
