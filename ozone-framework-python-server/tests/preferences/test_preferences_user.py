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
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json',
                'tests/stacks/fixtures/stacks_data.json',
                'tests/dashboards/fixtures/dashboard_data.json',
                'tests/owf_groups/fixtures/groups_data.json',
                'tests/preferences/fixtures/pref_data.json']

    def test_get_person(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('user_preferences-list')
        response = requests.get(url)

        self.assertEqual(len(response.data['results']), 0)
        self.assertEqual(response.status_code, 200)
        requests.logout()

    def test_post_admin(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('user_preferences-list')
        data = requests.post(url, payload_1, format="json")

        self.assertEqual(data.status_code, 201)
        self.assertEqual(Preference.objects.count(), 6)
        requests.logout()

    def test_get_admin(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('user_preferences-list')
        response = requests.get(url)

        self.assertEqual(len(response.data['results']), 5)
        self.assertEqual(response.status_code, 200)
        requests.logout()
