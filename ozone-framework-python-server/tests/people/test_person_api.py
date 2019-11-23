from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person, PersonWidgetDefinition
from people.serializers import PersonWidgetDefinitionSerializer
from stacks.models import Stack
from dashboards.models import Dashboard
from dashboards.serializers import DashboardBaseSerializer
from widgets.models import WidgetDefinition

requests = APIClient()


class PersonApiTests(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    def setUp(self):
        self.regular_user = Person.objects.get(pk=2)

        self.create_stack_payload = {
            'name': 'test stack 1',
            'description': 'test description 1'
        }

        self.create_stack_payload_2 = {
            'name': 'test stack 2',
            'description': 'test description 2'
        }

        Stack.create(self.regular_user, self.create_stack_payload)
        Stack.create(self.regular_user, self.create_stack_payload_2)

        widget1 = WidgetDefinition.objects.create(
            visible=True,
            display_name="widget1",
            image_url_medium="image url medium",
            image_url_small="image url small",
            width=50,
            height=50,
            widget_url="widget url",
            description="widget assigned to user through group, but now removed from group",
            universal_name="widget1.universal.name"
        )

        PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=widget1,
            user_widget=True,
            group_widget=False
        )

    def tearDown(self):
        requests.logout()

    def test_sync_user_and_widgets_dashboards_endpoint(self):
        requests.login(email='user@goss.com', password='password')
        self.regular_user.requires_sync = True
        url = reverse('user-widgets-dashboards-detail')
        response = requests.get(url)

        # assure user's widgets are returned
        regular_user = Person.objects.get(id=2)
        widget_ids = regular_user.get_active_widgets()
        widgets = PersonWidgetDefinition.objects.filter(widget_definition__in=widget_ids, person=regular_user)
        serialized_widgets = PersonWidgetDefinitionSerializer(widgets, many=True)
        self.assertEqual(response.data['widgets'], serialized_widgets.data)

        # assure user's dashboards are returned
        dashboards = Dashboard.objects.filter(user=self.regular_user)
        serialized_dashboards = DashboardBaseSerializer(dashboards, many=True)
        self.assertEqual(response.data['dashboards'], serialized_dashboards.data)

        self.assertFalse(regular_user.requires_sync)
        self.assertEqual(response.status_code, 200)
