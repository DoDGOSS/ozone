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
    fixtures = ['tests/people/fixtures/people_data.json', 'tests/widgets/fixtures/widget_data.json']

    def tearDown(self):
        requests.logout()

    def test_admin_authenticated_access(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('widgets-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)

    def test_user_authenticated_access(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('widgets-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 403)

    def test_admin_create_a_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('widgets-list')
        response = requests.post(url, payload, format='json')

        self.assertEqual(response.status_code, 201)

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

    def test_admin_list_a_widget_via_universal_name(self):
        requests.login(email='admin@goss.com', password='password')

        universal_name = 'org.owfgoss.owf.examples.HTMLViewer'
        url = reverse('widgets-list')
        filter_url = f'{url}?universal_name={universal_name}'
        response = requests.get(filter_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['universal_name'], universal_name)

    def test_admin_delete_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('widgets-detail', kwargs={'pk': 1})
        response = requests.delete(url)

        self.assertEquals(response.status_code, 204)

    def test_nonadmin_delete_widget(self):
        requests.login(email='user@goss.com', password='password')

        url = reverse('widgets-detail', kwargs={'pk': 1})
        response = requests.delete(url)

        self.assertEqual(response.status_code, 403)

    def test_admin_list_a_widget_showing_intents(self):
        requests.login(email='admin@goss.com', password='password')

        # create widget with intents
        url = reverse('widgets-list')
        created = requests.post(url, payload, format='json')

        self.assertEqual(created.status_code, 201)

        # list a widget to make sure intents are listed properly.
        url = reverse('widgets-detail', args=(f"{created.data['id']}",))
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['intents']['send'][0]['action'],
                         payload['intents']['send'][0]['action'])

        self.assertEqual(len(response.data['intents']['send'][0]['dataTypes']),
                         len(payload['intents']['send'][0]['dataTypes']))

        self.assertEqual(response.data['intents']['receive'][0]['action'],
                         payload['intents']['receive'][0]['action'])
