from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()

payload = {
    'version': 1,
    'status': 'active',
    'email': 'admin@goss.com',
    'description': 'Description for test group 4',
    'name': 'Test Group 4',
    'automatic': False,
    'display_name': 'Test Group 4',
    'stack_default': False
}


class GroupsAdminApiTests(TestCase):
    fixtures = ['people_data.json', 'groups_data.json']

    def test_admin_create_group(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-list')
        response = requests.post(url, payload)

        self.assertEqual(response.status_code, 201)
        requests.logout()

    def test_admin_read_group(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.data['count'], 3)
        requests.logout()

    def test_admin_read_one_group(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-detail', args='1')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 1)
        requests.logout()

    def test_admin_update_group(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-detail', args='1')
        payload['name'] = 'name updated'
        response = requests.put(url, payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['name'], 'name updated')
        requests.logout()

    def test_admin_delete_group(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-detail', args='1')
        response = requests.delete(url)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.data, None)
        requests.logout()

    def test_admin_filter_group(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-list')
        filter_url = f'{url}?name=Test Group 2'
        response = requests.get(filter_url)

        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.data['count'], 1)

        filter_url = f'{url}?name=No Group'
        response_fail = requests.get(filter_url)

        self.assertEqual(response_fail.status_code, 200)
        self.assertEqual(response_fail.data['count'], 0)
        requests.logout()

    def test_admin_auth_only_groups(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('admin_groups-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 403)
        requests.logout()


create_group_people_payload = {
    "group": 2,
    "person": 2,
}


class GroupsPeopleApiTests(TestCase):
    fixtures = ['people_data.json', 'groups_data.json']

    def test_admin_list_groups_people(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-people-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)
        requests.logout()

    def test_admin_add_user_to_group(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-people-list')
        response = requests.post(url, create_group_people_payload)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['group'], create_group_people_payload['group'])
        self.assertEqual(response.data['person'], create_group_people_payload['person'])
        requests.logout()

    def test_admin_auth_only_groups_people(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('admin_groups-people-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 403)
        requests.logout()