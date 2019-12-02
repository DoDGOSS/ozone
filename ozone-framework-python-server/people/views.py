from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import ugettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from config.owf_mixins import mixins
from dashboards.models import Dashboard
from widgets.models import WidgetDefinition
from dashboards.serializers import DashboardBaseSerializer
from stacks.serializers import StackBaseSerializer
from .models import Person, PersonWidgetDefinition
from .serializers import PersonBaseSerializer, PersonWidgetDefinitionSerializer, PersonWidgetDefinitionBaseSerializer
from widgets.serializers import WidgetDefinitionSerializer


class PersonDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serialized_user = PersonBaseSerializer(request.user).data

        return Response(serialized_user)


class PersonDashboardsWidgetsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """
        Return the details of the currently logged in user's details, widgets, and dashboards
        """

        # Sync dashboards and widgets
        request.user.sync()

        # Only return widgets that are directly assigned or assigned to active groups
        widgets = request.user.get_active_widgets()
        dashboards = Dashboard.objects.filter(user=request.user, marked_for_deletion=False)

        serialized_user = PersonBaseSerializer(request.user)
        serialized_dashboards = DashboardBaseSerializer(dashboards, many=True)

        # widget_definitions to person_widget_definitions
        widget_ids = widgets.values_list('id', flat=True)
        person_widgets = PersonWidgetDefinition.objects.filter(widget_definition__in=widget_ids, person=request.user)
        serialized_widgets = PersonWidgetDefinitionSerializer(person_widgets, many=True)

        return Response({
            'user': serialized_user.data,
            'dashboards': serialized_dashboards.data,
            'widgets': serialized_widgets.data
        })


class PersonWidgetDefinitionViewSet(mixins.BulkDestroyModelMixin,
                                    viewsets.ModelViewSet):
    """
    API endpoint that allows users-widgets to be viewed or edited.
    """
    permission_classes = (IsAdminUser,)
    queryset = PersonWidgetDefinition.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['widget_definition', 'person']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PersonWidgetDefinitionBaseSerializer
        elif self.request.method == 'PUT':
            return PersonWidgetDefinitionBaseSerializer
        else:
            return PersonWidgetDefinitionSerializer

    def create(self, request, *args, **kwargs):
        user_ids = request.data and request.data.get('person_ids')
        if user_ids:
            request.data.pop('person_ids', None)
            for user_id in user_ids:
                try:
                    payload = request.data.copy()
                    payload.update({"person": user_id})
                    serializer = self.get_serializer(data=payload)
                    serializer.is_valid(raise_exception=True)
                    self.perform_create(serializer)
                except Exception:
                    continue
            instances = PersonWidgetDefinition.objects.filter(widget_definition=request.data.get('widget_definition'))
            serializer = self.get_serializer(instances, many=True)
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        try:
            filters = {}
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

            if request.data.get('widget_id'):
                filters.update({
                    'widget_definition': request.data.get('widget_id')
                })

            return self.bulk_destroy(request, **filters)
        except (ValueError,):
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PersonStackViewset(APIView):
    """
    API endpoint that allows you to get all stacks assigned to a user.
    """
    permission_classes = (IsAdminUser,)
    default_error_messages = {
        'object_404': _('Object not found for {0}')
    }

    def get(self, request, format=None):

        person_id = request.query_params.get('person', None)

        if person_id is None:
            return Response({'Error': 'Needs Parameter: person'},
                            status=status.HTTP_400_BAD_REQUEST)

        else:
            person = Person.objects.filter(id=person_id).first()
            if person:
                stacks = person.get_directly_assigned_stacks()
                serialize_person = PersonBaseSerializer(person)
                stack_serializer = StackBaseSerializer(stacks, many=True)

                return Response({'user': serialize_person.data,
                                 'stacks': stack_serializer.data})

            else:
                return Response({'Error': 'Person Does Not Exist'},
                                status=status.HTTP_400_BAD_REQUEST)
