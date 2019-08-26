from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()


class TestingPersonBaseUrl(TestCase):
    fixtures = ['people_data.json', 'stacks_data.json', 'dashboard_data.json', 'groups_data.json']

    def test_get_person(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('stack-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 200)
        requests.logout()
