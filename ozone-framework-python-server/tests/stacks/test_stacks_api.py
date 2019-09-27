from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from stacks.models import Stack
from people.models import Person

requests = APIClient()

create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}


class StacksApiTests(TestCase):
    fixtures = ['people_data.json']

    def tearDown(self):
        requests.logout()

    def test_user_can_create_stack(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('stacks-list')
        response = requests.post(url, create_stack_payload)
        user_id = 2  # coming from the fixture that creates default users

        self.assertTrue(response.data['id'])
        self.assertTrue(response.data['default_group'])
        self.assertEqual(response.data['name'], create_stack_payload['name'])
        self.assertEqual(response.data['description'], create_stack_payload['description'])
        self.assertTrue(response.data['stack_context'])
        self.assertEqual(response.data['owner']['id'], user_id)

    def test_owner_of_stack_can_share_stack(self):
        regular_user = Person.objects.get(pk=2)
        stack = Stack.create(regular_user, {
            'name': 'test stack 1',
            'description': 'test description 1'
        })
        requests.login(email='user@goss.com', password='password')
        url = reverse('stacks-share', args=f'{stack.id}')
        response = requests.post(url)

        self.assertEqual(response.status_code, 200)

    def test_nonowner_of_stack_cannot_share_stack(self):
        regular_user = Person.objects.get(pk=2)
        stack = Stack.create(regular_user, {
            'name': 'test stack 1',
            'description': 'test description 1'
        })
        requests.login(email='user2@goss.com', password='password')
        url = reverse('stacks-share', args=f'{stack.id}')
        response = requests.post(url)

        self.assertEqual(response.status_code, 401)
