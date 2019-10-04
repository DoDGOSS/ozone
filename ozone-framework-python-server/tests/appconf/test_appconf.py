from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person

requests = APIClient()

post_payload = {
            "code": "test_payload_owf.enable.cef.logging",
            "value": "False",
            "title": "Enable CEF Logging Update",
            "description": "None",
            "type": "Boolean",
            "group_name": "AUDITING",
            "sub_group_name": "None",
            "mutable": False,
            "sub_group_order": 1,
            "help": "help 2",
}

patch_payload = {"description": "Has Changed"}

put_payload = {
            "code": "test_payload_owf.enable.cef.logging",
            "value": "False",
            "title": "Enable CEF Logging Update",
            "description": "Change PUT",
            "type": "Boolean",
            "group_name": "AUDITING",
            "sub_group_name": "None",
            "mutable": False,
            "sub_group_order": 1,
            "help": "help 2",
}


class TestingApplicationConfigAPI(TestCase):
    fixtures = ['people_data.json', 'appconf_data.json']

    def test_admin_can_create_appconf_data(self):
        admin_user = Person.objects.get(email='admin@goss.com')

        requests.login(email='admin@goss.com', password='password')
        url = reverse('applicationconfiguration-list')
        response = requests.post(url, post_payload)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['edited_by'], None)
        self.assertEqual(response.data['created_by'], admin_user.id)

        requests.logout()

    def test_admin_can_list_appconf_endpoint(self):

        requests.login(email='admin@goss.com', password='password')
        url = reverse('applicationconfiguration-list')
        data = requests.get(url)

        self.assertEqual(data.status_code, 200)

        requests.logout()

    def test_admin_can_patch_appconf_data(self):
        admin_user = Person.objects.get(email='admin@goss.com')

        requests.login(email='admin@goss.com', password='password')
        url = reverse('applicationconfiguration-detail', args='1')
        response = requests.patch(url, patch_payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['edited_by'], admin_user.id)

        requests.logout()

    def test_admin_can_put_appconf_data(self):
        admin_user = Person.objects.get(email='admin@goss.com')

        requests.login(email='admin@goss.com', password='password')
        url = reverse('applicationconfiguration-detail', args='1')
        response = requests.put(url, put_payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['edited_by'], admin_user.id)

        requests.logout()

    def test_admin_can_delete_appconf_data(self):

        requests.login(email='admin@goss.com', password='password')
        url = reverse('applicationconfiguration-detail', args='1')
        response = requests.delete(url)

        self.assertEqual(response.status_code, 204)

        requests.logout()

    def test_admin_auth_only_appconf(self):

        requests.login(email='user@goss.com', password='password')
        url = reverse('applicationconfiguration-list')
        data = requests.get(url)

        self.assertEqual(data.status_code, 403)

        requests.logout()
