from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()

payload = {
            "version": 1,
            "created_date": "2019-08-29",
            "edited_date": "2019-08-29",
            "code": "owf.enable.cef.logging",
            "value": "False",
            "title": "Enable CEF Logging Update",
            "description": "None",
            "type": "Boolean",
            "group_name": "AUDITING",
            "sub_group_name": "None",
            "mutable": False,
            "sub_group_order": 1,
            "help": "help 2",
            "created_by": 1,
            "edited_by": 1
}


class TestingPersonBaseUrl(TestCase):
    fixtures = ['people_data.json', 'appconf_data.json']

    def test_access_users_url(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('applicationconfiguration-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 200)
        requests.logout()
        requests.login(email='user@goss.com', password='password')
        url = reverse('applicationconfiguration-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 403)
        requests.logout()

    def test_appconf_update(self):
        # URL
        url = reverse('applicationconfiguration-detail', args='1')
        # Login
        requests.login(email='admin@goss.com', password='password')
        # Request preload
        getting = requests.get(url)
        # Request Change
        response = requests.patch(url, data=payload)
        # Tests status and data validation
        self.assertEqual(response.status_code, 200)
        self.assertNotEquals(getting.data['title'], response.data['title'])
        self.assertEqual(response.data['title'], "Enable CEF Logging Update")
