from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from owf_groups.models import OwfGroup
from domain_mappings.models import RelationshipType, DomainMapping
from dashboards.models import Dashboard
from stacks.models import Stack

requests = APIClient()

createStackPayload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}

class StacksApiTests(TestCase):
    fixtures = ['people_data.json']

    def test_user_can_create_stack(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('stack-list')
        response = requests.post(url, createStackPayload)
        userId = 1 # coming from the fixture that creates default users

        self.assertIsNotNone(response.data['id'])
        self.assertEqual(response.data['name'], createStackPayload['name'])
        self.assertEqual(response.data['description'], createStackPayload['description'])
        self.assertIsNotNone(response.data['stack_context'])
        self.assertEqual(response.data['owner'], userId)