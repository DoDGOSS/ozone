from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

from stacks.models import StackGroups, Stack
from people.models import Person
from owf_groups.models import OwfGroup
from dashboards.models import Dashboard
from domain_mappings.models import DomainMapping, RelationshipType, MappingType

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
    fixtures = ['resources/fixtures/default_data.json', ]

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
        filter_url = f'{url}?name=Sample'
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
        self.assertEqual(response.data['owner']['id'], 1)

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
    fixtures = ['resources/fixtures/default_data.json', 'tests/stacks/fixtures/stacks_test_data.json']

    stack_id_test_pass = 1
    stack_id_test_fail = 100

    def setUp(self):
        # Create the test data for stack groups
        Person.objects.create_user(email='test_user_3@goss.com', username='test_user_3', password='password')
        OwfGroup.objects.create(name='test_group_delete')
        OwfGroup.objects.create(name='test_group_non_delete')

        # add users association to groups
        self.test_group_no_delete = OwfGroup.objects.get(name='test_group_delete')
        self.user = Person.objects.get(username='user')
        self.test_group_no_delete.add_user(self.user)
        self.test_group_delete = OwfGroup.objects.get(name='test_group_non_delete')
        self.test_user_3 = Person.objects.get(username='test_user_3')
        self.test_group_delete.add_user(self.test_user_3)
        self.test_group_delete.add_user(self.user)

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

    def test_delete_stack_group_and_associated_data(self):

        requests.login(email='admin@goss.com', password='password')
        url_create_stack = reverse('admin_stacks-list')
        requests.post(url_create_stack, data={
            "name": "sg-rc-1",
            "description": "string",
            "image_url": "string",
            "descriptor_url": "string",
            "unique_widget_count": 0,
            "approved": True
        })

        stack_groups_post_url = reverse('admin_stacks-groups-list')

        stack_created = Stack.objects.get(name="sg-rc-1")

        stack_groups_response_no_del = requests.post(stack_groups_post_url, data={
            "group": self.test_group_no_delete.id,
            "stack": stack_created.id,
        })

        stack_groups_response_del = requests.post(stack_groups_post_url, data={
            "group": self.test_group_delete.id,
            "stack": stack_created.id,
        })

        self.assertEqual(stack_groups_response_no_del.status_code, 201)

        self.assertEqual(stack_groups_response_del.status_code, 201)

        user = Person.objects.get(username='user')
        user.sync()

        test_user_3 = Person.objects.get(username='test_user_3')
        test_user_3.sync()

        self.assertEqual(Dashboard.objects.filter(user=test_user_3).exists(), True)

        self.assertEqual(Dashboard.objects.filter(user=user).exists(), True)

        test_user_3_dashboard = Dashboard.objects.get(user=test_user_3, name='sg-rc-1')
        user_dashboard = Dashboard.objects.get(user=user, name='sg-rc-1')

        stack_groups_detail_url = reverse('admin_stacks-groups-detail',
                                          args=(f"{stack_groups_response_del.data['id']}",))

        stack_groups_delete_response = requests.delete(stack_groups_detail_url, {'stack_id': stack_created.id,
                                                                                 'group_id': self.test_group_delete.id})

        self.assertEqual(stack_groups_delete_response.status_code, 204)

        # Users Dashboard should be removed due to being in the group that was deleted
        self.assertEqual(Dashboard.objects.filter(user=test_user_3, name='sg-rc-1').exists(), False)
        # Users Dashboard should be not be removed due to being in the group that was
        # deleted and a different group associated with the stack
        self.assertEqual(Dashboard.objects.filter(user=user).exists(), True)

        domain_mapping_search_for_dashboard_test_user_3 = DomainMapping.objects.filter(
            src_id=test_user_3_dashboard.id,
            src_type=MappingType.dashboard,
            dest_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf
        )

        domain_mapping_search_for_dashboard_user = DomainMapping.objects.filter(
            src_id=user_dashboard.id,
            src_type=MappingType.dashboard,
            dest_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf
        )

        # Users Mapping should be removed due to being in the group that was deleted
        self.assertEqual(domain_mapping_search_for_dashboard_test_user_3.exists(), False)
        # Users Mapping should be not be removed due to being in the group that was
        # deleted and a different group associated with the stack
        self.assertEqual(domain_mapping_search_for_dashboard_user.exists(), True)

        # Both Users were in the group that was deleted and should be now synced
        self.assertEqual(Person.objects.get(username='test_user_3').requires_sync, True)
        self.assertEqual(Person.objects.get(username='user').requires_sync, True)

        requests.logout()
