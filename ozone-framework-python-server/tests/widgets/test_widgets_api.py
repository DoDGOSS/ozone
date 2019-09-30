from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()

payload = {
    "version": 1,
    "visible": True,
    "image_url_medium": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "image_url_small": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "singleton": False,
    "width": 200,
    "widget_version": "1",
    "height": 200,
    "widget_url": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "widget_guid": '0137f81c-a6c6-4254-914c-de0ebe6a488c',
    "display_name": "Test Widget",
    "background": False,
    "universal_name": "test_widget_x",
    "descriptor_url": "Description for a url",
    "description": "Description...",
    "mobile_ready": False,
    "intents": {
        "send": [
            {"action": "act", "dataTypes": ["type-1", "type-2"]}
        ],
        "receive": [
            {"action": "act", "dataTypes": ["type-2"]}
        ]
    }
}


class TestingWidgetsApi(TestCase):
    fixtures = ['people_data.json', 'widget_data.json']

    def test_admin_authenticated_access(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('widgets-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)

        requests.logout()

    def test_user_authenticated_access(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('widgets-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 403)

        requests.logout()

    def test_admin_create_a_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('widgets-list')
        response = requests.post(url, payload, format='json')

        self.assertEqual(response.status_code, 201)

        requests.logout()
        return response.data

    def test_admin_update_a_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('widgets-detail', args='1')

        del payload["display_name"]
        payload["name"] = "Test Widget (different param instead of display_name)"
        response = requests.put(url, payload, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['display_name'], payload['name'])

        self.assertEqual(response.data['intents']['send'][0]['action'],
                         payload['intents']['send'][0]['action'])

        self.assertEqual(len(response.data['intents']['send'][0]['dataTypes']),
                         len(payload['intents']['send'][0]['dataTypes']))

        self.assertEqual(response.data['intents']['receive'][0]['action'],
                         payload['intents']['receive'][0]['action'])

        requests.logout()

    def test_admin_update_a_widget_via_universal_name(self):
        requests.login(email='admin@goss.com', password='password')

        universal_name = 'test_widget'
        url = reverse('widgets-detail', kwargs={'pk': universal_name})
        response = requests.put(url, payload, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['universal_name'], 'test_widget_x')

        requests.logout()
