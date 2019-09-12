from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()

payload = {
    "version": 0,
    "name": "stack_name",
    "description": "stack description",
    "stack_context": "the context",
    "image_url": None,
    "descriptor_url": None,
    "unique_widget_count": 0,
    "approved": True,
    "owner": 1
}


class StacksAdminApiTests(TestCase):
    fixtures = ['people_data.json',
                'stacks_data.json',
                'dashboard_data.json',
                'groups_data.json']

    def test_admin_create_stack(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-list')
        response = requests.post(url, payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertGreaterEqual(response.data['id'], 2)
        requests.logout()

    def test_admin_list_stack(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.data['count'], 1)
        requests.logout()

    def test_admin_detail_stack(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-detail', args='1')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 1)
        requests.logout()

    def test_admin_update_stack(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-detail', args='1')
        payload['description'] = 'description updated'
        response = requests.put(url, payload, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['description'], 'description updated')
        requests.logout()

    def test_admin_delete_stack(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-detail', args='1')
        response = requests.delete(url)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.data, None)
        requests.logout()

    def test_admin_filter_stack(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-list')
        filter_url = f'{url}?name=Test Stack 1'
        response = requests.get(filter_url, format="json")

        self.assertGreaterEqual(response.data['count'], 1)
        self.assertEqual(response.status_code, 200)

        filter_url = f'{url}?name=stack_name_invalid'
        response_fail = requests.get(filter_url, format="json")

        self.assertEqual(response_fail.status_code, 200)
        self.assertEqual(response_fail.data['count'], 0)
        requests.logout()

    def test_admin_auth_only_stacks(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('admin_stacks-list')
        filter_url = f'{url}?user=2'
        response = requests.get(filter_url, format="json")

        self.assertEqual(response.status_code, 403)
        requests.logout()
