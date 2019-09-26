from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person
from stacks.models import Stack

requests = APIClient()


class DashboardsApiTests(TestCase):
    fixtures = ['people_data.json']

    def setUp(self):
        self.admin_user = Person.objects.get(pk=1)
        self.regular_user = Person.objects.get(pk=2)
        self.create_stack_payload = {
            'name': 'test stack 1',
            'description': 'test description 1'
        }

        self.create_dashboard_payload = {
            'name': 'test dashboard 1',
            'description': 'test dash description 1'
        }

    def tearDown(self):
        requests.logout()

    def test_owner_of_stack_can_add_new_dashboard_to_stack(self):
        stack = Stack.create(self.regular_user, self.create_stack_payload)
        self.create_dashboard_payload['stack'] = stack.id

        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-list')
        response = requests.post(url, self.create_dashboard_payload)

        self.assertEqual(response.status_code, 201)

    def test_add_dashboard__for_nonowner_user__should_fail(self):
        stack = Stack.create(self.admin_user, self.create_stack_payload)
        self.create_dashboard_payload['stack'] = stack.id

        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-list')
        response = requests.post(url, self.create_dashboard_payload)
        self.assertEqual(response.status_code, 403)

    def test_delete_dashboard_as_stack_owner(self):
        stack = Stack.create(self.regular_user, self.create_stack_payload)
        dashboard = stack.add_dashboard(self.regular_user, self.create_dashboard_payload)

        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-detail', args=(f'{dashboard.id}',))
        response = requests.delete(url)
        dashboard.refresh_from_db()

        self.assertEqual(response.status_code, 204)
        self.assertTrue(dashboard.marked_for_deletion)

    def test_delete_dashboard_as_stack_nonowner(self):
        stack = Stack.create(self.admin_user, self.create_stack_payload)
        dashboard = stack.add_dashboard(self.regular_user, self.create_dashboard_payload)

        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-detail', args=(f'{dashboard.id}',))
        response = requests.delete(url)

        self.assertEqual(response.status_code, 403)
