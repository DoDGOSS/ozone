from django.urls import reverse
from django.test import TestCase
from stacks.models import Stack
from people.models import Person
from rest_framework.test import APIClient
from dashboards.models import Dashboard
from domain_mappings.models import DomainMapping, MappingType
from owf_groups.models import OwfGroupPeople

requests = APIClient()


class StacksApiTests(TestCase):
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json',]

    def tearDown(self):
        requests.logout()

    def setUp(self):
        self.admin_user = Person.objects.get(pk=1)
        self.regular_user = Person.objects.get(pk=2)

        self.stack = Stack.create(self.regular_user, {
            'name': 'test stack 1',
            'description': 'test description 1'
        })

    def tearDown(self):
        requests.logout()

    def test_user_can_create_stack(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('stacks-list')
        create_stack_payload = {
            'name': 'test stack 2',
            'description': 'testing user can create a stack'
        }
        response = requests.post(url, create_stack_payload)
        user_id = 2  # coming from the fixture that creates default users

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data['id'])
        self.assertTrue(response.data['default_group'])
        self.assertEqual(response.data['name'], create_stack_payload['name'])
        self.assertEqual(response.data['description'], create_stack_payload['description'])
        self.assertTrue(response.data['stack_context'])
        self.assertEqual(response.data['owner']['id'], user_id)

    def test_owner_of_stack_can_share_stack(self):
        regular_user = Person.objects.get(pk=2)
        stack = Stack.create(regular_user, {
            'name': 'test stack 1',
            'description': 'test description 1'
        })
        requests.login(email='user@goss.com', password='password')
        url = reverse('stacks-share', args=(f'{stack.id}',))
        response = requests.post(url)

        self.assertEqual(response.status_code, 204)

    def test_nonowner_of_stack_cannot_share_stack(self):
        regular_user = Person.objects.get(pk=2)
        stack = Stack.create(regular_user, {
            'name': 'test stack 1',
            'description': 'test description 1'
        })
        requests.login(email='user2@goss.com', password='password')
        url = reverse('stacks-share', args=f'{stack.id}')
        response = requests.post(url)

        self.assertEqual(response.status_code, 401)

    def test_admin_can_delete_stack(self):
        dashboard_ids_for_stack = list(Dashboard.objects.filter(stack=self.stack).values_list("id", flat=True))
        stack_default_group_id = self.stack.default_group.id
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_stacks-detail', args=(f'{self.stack.id}',))
        response = requests.delete(url)

        self.assertEqual(response.status_code, 204)

        # check that all dashboards associated with the stack are deleted
        self.assertFalse(Dashboard.objects.filter(stack=self.stack).exists())
        # check that all domain mappings for dashboards associated with the stack are deleted
        self.assertFalse(DomainMapping.objects.filter(
            src_id__in=dashboard_ids_for_stack,
            src_type=MappingType.dashboard)
        )
        self.assertFalse(DomainMapping.objects.filter(
            dest_id__in=dashboard_ids_for_stack,
            dest_type=MappingType.dashboard)
        )
        # check that all domain mappings for widgets assigned to the stack are deleted
        self.assertFalse(DomainMapping.objects.filter(src_id=stack_default_group_id, src_type=MappingType.group))

    def test_nonadmin_can_delete_stack(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('stacks-detail', args=(f'{self.stack.id}',))
        reponse = requests.delete(url)

        self.assertFalse(OwfGroupPeople.objects.filter(
            group=self.stack.default_group,
            person=self.regular_user).exists()
        )
