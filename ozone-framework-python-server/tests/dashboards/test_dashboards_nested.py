from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from django.conf import settings
from dashboards.models import Dashboard


requests = APIClient()

payload = {
            "id": 1,
            "version": 1,
            "isdefault": False,
            "dashboard_position": 1,
            "altered_by_admin": False,
            "guid": "ef8b5d6f-4b16-4743-9a57-31683c94100100--testing",
            "name": "test_dashboard",
            "description": "testdash1",
            "created_date": "2019-08-13T18:22:05Z",
            "edited_date": "2019-08-13T18:22:10Z",
            "layout_config": "\"{\r\n        \\\"backgroundWidgets\\\":[\r\n\r\n        ],\r\n        \\\"panels\\\":[\r\n\r\n        ],\r\n        \\\"tree\\\":null\r\n      }\"",
            "locked": False,
            "type": "None",
            "icon_image_url": "None",
            "published_to_store": False,
            "marked_for_deletion": False,
            "user": 1,
            "created_by": 1,
            "edited_by": 1,
            "stack": 1
        }


class NestedDashboardsBasicTesting(TestCase):
    fixtures = ['dashboard_database.json', 'people_data.json', 'stacks_database.json', 'groups_database.json']

    def test_get_action(self):
        # admin user
        requests.login(email='admin@goss.com', password='password')
        url = reverse('nested-dashboard-list')
        request = requests.get(url)
        self.assertEqual(request.status_code, 200)
        self.assertEqual(Dashboard.objects.count(), 4)
        requests.logout()
        # Anon User
        url = reverse('nested-dashboard-list')
        request = requests.get(url)
        self.assertEqual(request.status_code, 401)
        requests.logout()
        # Regular User
        requests.login(email='regular-user@goss.com', password='password')
        url = reverse('nested-dashboard-list')
        request = requests.get(url)
        self.assertEqual(request.status_code, 200)
        requests.logout()

    def test_dashboard_guid(self):
        # regular user
        requests.login(email='regular-user@goss.com', password='password')
        url = reverse('nested-dashboard-list')
        request = requests.post(url, payload, format='json')
        self.assertEqual(request.status_code, 201)
        self.assertEqual(Dashboard.objects.count(), 5)
        # admin
        requests.login(email='admin@goss.com', password='password')
        url = reverse('nested-dashboard-list')
        payload['guid'] = 'ef8b5d6f-4b16-4743-9a57-31683c94xxxxxxxtest'
        request = requests.post(url, payload, format='json')
        self.assertEqual(request.status_code, 201)
        self.assertEqual(Dashboard.objects.count(), 6)
        requests.logout()
        # Replicate item in DB expect fail
        requests.login(email='admin@goss.com', password='password')
        url = reverse('nested-dashboard-list')
        payload['guid'] = 'ef8b5d6f-4b16-4743-9a57-31683c94xxxxxxxtest'
        request = requests.post(url, payload, format='json')
        self.assertEqual(request.status_code, 400)
        self.assertEqual(Dashboard.objects.count(), 6)
        requests.logout()





