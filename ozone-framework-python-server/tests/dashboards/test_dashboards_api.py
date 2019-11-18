from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person
from stacks.models import Stack

requests = APIClient()


class DashboardsApiTests(TestCase):
    fixtures = [
        'resources/fixtures/default_data.json',
        'tests/dashboards/fixtures/default_test_dashboards.json',
    ]

    def setUp(self):
        self.admin_user = Person.objects.get(pk=1)
        self.regular_user = Person.objects.get(pk=2)
        self.create_stack_payload = {
            'name': 'test stack 1',
            'description': 'test description 1'
        }

        self.create_dashboard_payload = {
            'name': 'test dashboard 1',
            'description': 'test dash description 1',
            'layout_config': '{"backgroundWidgets": [], "panels": [], "tree": null}'
        }

    def tearDown(self):
        requests.logout()

    def test_owner_of_stack_can_add_new_dashboard_to_stack(self):
        stack = Stack.create(self.regular_user, self.create_stack_payload)
        self.create_dashboard_payload['stack_id'] = stack.id

        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-list')
        response = requests.post(url, self.create_dashboard_payload)

        self.assertEqual(response.status_code, 201)

    def test_nonowner_of_stack_cannot_add_dashboard(self):
        stack = Stack.create(self.admin_user, self.create_stack_payload)
        self.create_dashboard_payload['stack'] = stack.id

        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-list')
        response = requests.post(url, self.create_dashboard_payload)
        self.assertEqual(response.status_code, 403)

    def test_owner_of_stack_can_delete_dashboard(self):
        stack = Stack.create(self.regular_user, self.create_stack_payload)
        group_dashboard, user_dashboard = stack.add_dashboard(self.regular_user, self.create_dashboard_payload)

        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-detail', args=(f'{user_dashboard.id}',))
        response = requests.delete(url)
        user_dashboard.refresh_from_db()

        self.assertEqual(response.status_code, 204)
        self.assertTrue(user_dashboard.marked_for_deletion)

    def test_nonowner_of_stack_cannot_delete_dashboard(self):
        stack = Stack.create(self.admin_user, self.create_stack_payload)
        group_dashboard, user_dashboard = stack.add_dashboard(self.regular_user, self.create_dashboard_payload)

        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-detail', args=(f'{user_dashboard.id}',))
        response = requests.delete(url)

        self.assertEqual(response.status_code, 403)

    def test_owner_of_dashboard_can_restore_dashboard(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('dashboards-restore', args=('101',))
        response = requests.post(url)

        self.assertEqual(response.status_code, 200)

    def test_nonowner_of_dashboard_cannot_restore_dashboard(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('dashboards-restore', args=('2'))
        response = requests.post(url)

        self.assertEqual(response.status_code, 404)
