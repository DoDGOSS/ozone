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
        dashboards = Dashboard.objects.filter(user=request.user)

        serialized_user = PersonBaseSerializer(request.user)
        serialized_dashboards = DashboardBaseSerializer(dashboards, many=True)
        serialized_widgets = WidgetDefinitionSerializer(widgets, many=True)

        return Response({'user': serialized_user.data,
                         'dashboards': serialized_dashboards.data,
                         'widgets': serialized_widgets.data})


class PersonWidgetDefinitionViewSet(mixins.BulkDestroyModelMixin, viewsets.ModelViewSet):
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
