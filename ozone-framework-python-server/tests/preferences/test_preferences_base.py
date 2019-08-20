from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()


class TestingPersonBaseUrl(TestCase):
    fixtures = ['people_data.json', 'stacks_database.json', 'dashboard_database.json', 'groups_database.json']

    def test_get_person(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('user_preferences-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 200)
        requests.logout()
