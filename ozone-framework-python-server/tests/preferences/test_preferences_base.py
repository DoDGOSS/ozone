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
    "path": '124d-wedfe-we49-ewwe33-test',
    "namespace": 'namespace-test-1',
    "user": 1,
}

payload_2 = {
    "id": 2,
    "version": 1,
    "value": 'set testing value 2',
    "path": '12w4d-wehrdfe-wefefw49-ewfee33-test',
    "namespace": 'namespace-test-2',
    "user": 2,
}


class TestingPrefBaseUrl(TestCase):
    fixtures = ['people_data.json',
                'stacks_data.json',
                'dashboard_data.json',
                'groups_data.json',
                'pref_data.json']

    def test_post_person(self):
        requests.login(email='regular-user@goss.com', password='password')
        url = reverse('base_preferences-list')
        data = requests.post(url, payload_1, format="json")
        self.assertEqual(data.status_code, 201)
        self.assertEqual(Preference.objects.count(), 2)
        requests.logout()
        requests.login(email='admin@goss.com', password='password')
        url = reverse('base_preferences-list')
        data = requests.post(url, payload_2, format="json")
        self.assertEqual(data.status_code, 201)
        self.assertEqual(Preference.objects.count(), 3)
        requests.logout()

    def test_get_person(self):
        requests.login(email='regular-user@goss.com', password='password')
        url = reverse('base_preferences-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 200)
        requests.logout()
        requests.login(email='admin@goss.com', password='password')
        url = reverse('base_preferences-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 200)
        requests.logout()



