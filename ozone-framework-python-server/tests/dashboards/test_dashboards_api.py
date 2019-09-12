from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person
from stacks.models import Stack

requests = APIClient()

create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}

create_dashboard_payload = {
    'name': 'test dashboard 1',
    'description': 'test dash description 1'
}


class DashboardsApiTests(TestCase):
    fixtures = ['people_data.json']

    def test_owner_of_stack_can_add_new_dashboard_to_stack(self):
        regular_user = Person.objects.get(pk=2)
        stack = Stack.create(regular_user, create_stack_payload)
        create_dashboard_payload['stack'] = stack.id

        requests.login(email='regular-user@goss.com', password='password')
        url = reverse('dashboards-list')
        response = requests.post(url, create_dashboard_payload)

    def test_add_dashboard__for_nonowner_user__should_fail(self):
        admin_user = Person.objects.get(pk=1)
        stack = Stack.create(admin_user, create_stack_payload)
        create_dashboard_payload['stack'] = stack.id

        requests.login(email='regular-user@goss.com', password='password')
        url = reverse('dashboards-list')
        response = requests.post(url, create_dashboard_payload)
        self.assertEqual(response.status_code, 401)
