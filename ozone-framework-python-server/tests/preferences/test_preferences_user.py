import json
from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from preferences.models import Preference

requests = APIClient()

payload_1 = {
    "id": 1,
    "version": 1,
    "value": 'set testing value',
    "path": '124d-wedfe-we49-ewwe33',
    "namespace": 'namespace-test-1',
    "user": 1,
}


class TestingPrefUser(TestCase):
    fixtures = ['people_data.json',
                'stacks_data.json',
                'dashboard_data.json',
                'groups_data.json',
                'pref_data.json']

    def test_get_person(self):
        requests.login(email='regular-user@goss.com', password='password')
        url = reverse('user_preferences-list')
        response = requests.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']), 0)
        self.assertEqual(response.status_code, 200)
        requests.logout()

    def test_post_admin(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('user_preferences-list')
        data = requests.post(url, payload_1, format="json")
        self.assertEqual(data.status_code, 201)
        self.assertEqual(Preference.objects.count(), 2)
        requests.logout()

    def test_get_admin(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('user_preferences-list')
        response = requests.get(url)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']), 1)
        self.assertEqual(response.status_code, 200)
        requests.logout()
