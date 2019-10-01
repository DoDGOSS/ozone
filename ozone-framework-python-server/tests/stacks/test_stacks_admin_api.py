from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

from stacks.models import StackGroups, Stack

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

    def test_admin_switch_owner_of_a_stack(self):
        requests.login(email='admin@goss.com', password='password')

        # delete our requesting admin from the default group to validate further.
        Stack.objects.get(pk=1).default_group.people.remove(1)
        self.assertFalse(Stack.objects.get(pk=1).default_group.people.filter(id=1).exists())

        # owner from fixtures is 2
        url = reverse('admin_stacks-detail', args='1')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['owner']['id'], 2)

        # switch the owner to requesting admin, ie 1
        url = reverse('admin_stacks-assign-to-me', args='1')
        response = requests.patch(url, payload, format="json")

        self.assertEqual(response.status_code, 204)

        # read the owner again by visiting detail page
        url = reverse('admin_stacks-detail', args='1')
        response = requests.get(url)

        self.assertEqual(response.data['owner']['id'], 1)

        # make sure requesting admin was added to its default group.
        self.assertTrue(Stack.objects.get(pk=1).default_group.people.filter(pk=1).exists())

        requests.logout()


create_stack_group_payload = {
    "group": 3,
    "stack": 1,
}


class StacksGroupsAdminApiTests(TestCase):
    fixtures = ['people_data.json',
                'stacks_data.json',
                'dashboard_data.json',
                'groups_data.json']

    stack_id_test_pass = 1
    stack_id_test_fail = 9

    def test_admin_list_stack_groups(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-groups-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)
        requests.logout()

    def test_admin_add_group_to_stack(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-groups-list')
        response = requests.post(url, create_stack_group_payload)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['group'], create_stack_group_payload['group'])
        self.assertEqual(response.data['stack'], create_stack_group_payload['stack'])
        requests.logout()

    def test_admin_auth_only_stack_groups(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('admin_stacks-groups-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 403)
        requests.logout()

    def test_admin_filter_by_group_stack_groups(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-groups-list')
        filter_url = f'{url}?group={self.stack_id_test_pass}'
        response = requests.get(filter_url)
        data_stack_groups = StackGroups.objects.filter(group=self.stack_id_test_pass).count()

        self.assertEqual(response.data['count'], data_stack_groups)
        self.assertEqual(response.status_code, 200)

        filter_url_fails = f'{url}?group={self.stack_id_test_fail}'
        response_no_exist = requests.get(filter_url_fails)

        self.assertEqual(response_no_exist.status_code, 400)

        requests.logout()

    def test_admin_filter_by_stack_stack_groups(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-groups-list')
        filter_url = f'{url}?stack={self.stack_id_test_pass}'
        response = requests.get(filter_url)
        data_stack_groups = StackGroups.objects.filter(stack=self.stack_id_test_pass).count()

        self.assertEqual(response.data['count'], data_stack_groups)
        self.assertEqual(response.status_code, 200)

        filter_url_fails = f'{url}?stack={self.stack_id_test_fail}'
        response_no_exist = requests.get(filter_url_fails)

        self.assertEqual(response_no_exist.status_code, 400)

        requests.logout()
