from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()

create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}


class StacksApiTests(TestCase):
    fixtures = ['people_data.json']

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
