from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

from owf_groups.models import OwfGroupPeople
from dashboards.models import Dashboard
from stacks.models import Stack
from domain_mappings.models import DomainMapping, RelationshipType, MappingType
from people.models import Person

requests = APIClient()

payload = {
    "password": "password",
    'version': 1,
    'enabled': True,
    'user_real_name': 'Test 1 User',
    'username': 'TestUser',
    'last_login': '2019-08-13T21:18:23.008000Z',
    'email_show': True,
    'email': 'testing@goss.com',
    'prev_login': '2019-08-13T21:18:23.008000Z',
    'description': 'Test',
    'last_notification': '2019-08-13T21:18:23.008000Z',
    'requires_sync': False,
    'is_active': True,
    'is_admin': False
}

payload2 = {
    "password": "password",
    'version': 1,
    'enabled': True,
    'user_real_name': 'Test 2 Admin User',
    'username': 'TestAdminUser',
    'last_login': '2019-08-13T21:18:23.008000Z',
    'email_show': True,
    'email': 'admin_testing@goss.com',
    'prev_login': '2019-08-13T21:18:23.008000Z',
    'description': 'Test Admin',
    'last_notification': '2019-08-13T21:18:23.008000Z',
    'requires_sync': False,
    'is_active': True,
    'is_admin': True
}


class TestingPersonBaseUrl(TestCase):
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json',
                'tests/owf_groups/fixtures/groups_data.json',
                'tests/dashboards/fixtures/dashboard_data.json',
                'tests/domain_mappings/fixtures/domain_mapping_data.json',
                'tests/stacks/fixtures/stacks_data.json',
                'tests/appconf/fixtures/appconf_data.json',
                ]

    def test_admin_post_user(self):
        requests.login(email='admin@goss.com', password='password')
        # Add / Post new user || 3
        url_post = reverse('person-list')
        response_post = requests.post(url_post, payload)

        self.assertEqual(response_post.status_code, 201)

        url = reverse('person-list')
        response = requests.get(url)

        self.assertEqual(response.data['count'], 3)

        requests.logout()

    def test_admin_list_user(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('person-list')
        response = requests.get(url)

        self.assertEqual(response.data['count'], 2)

        requests.logout()

    def test_admin_detail_user(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('person-detail', args='2')
        del_data = requests.get(url)

        self.assertEqual(del_data.status_code, 200)

        requests.logout()

    def test_admin_update_user(self):
        requests.login(email='admin@goss.com', password='password')
        # Update user 3 with new email
        url = reverse('person-detail', args='2')
        payload['email'] = 'test@goss.com'
        update_data = requests.put(url, payload)

        self.assertEqual(update_data.status_code, 200)

        url = reverse('person-detail', args='2')
        response = requests.get(url)

        self.assertEqual(response.data['email'], 'test@goss.com')
        # End Test
        requests.logout()

    def test_password_update(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('person-detail', args='2')
        data = requests.get(url)
        new_pw = data.data
        new_pw['password'] = 'password test'
        update_data = requests.put(url, new_pw)

        self.assertEqual(update_data.status_code, 200)

        requests.logout()

        requests.login(email='user@goss.com', password='password test')
        check_new_pw = reverse('user-detail')
        sanity_check = requests.get(check_new_pw)

        self.assertEqual(sanity_check.status_code, 200)
        self.assertEqual(sanity_check.data['username'], 'user')

        requests.logout()

    def test_admin_delete_user(self):
        # Delete user 2
        requests.login(email='admin@goss.com', password='password')
        url = reverse('person-detail', args='2')
        del_data = requests.delete(url)

        self.assertEqual(del_data.status_code, 204)

        url = reverse('person-list')
        response = requests.get(url)

        self.assertEqual(response.data['count'], 1)

        requests.logout()

    def test_admin_auth_only_users(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('person-list')
        data = requests.get(url)

        self.assertEqual(data.status_code, 403)

        requests.logout()


class TestingPersonCleanUp(TestCase):
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json',
                'tests/owf_groups/fixtures/groups_data.json',
                'tests/dashboards/fixtures/dashboard_data.json',
                'tests/domain_mappings/fixtures/domain_mapping_data.json',
                'tests/stacks/fixtures/stacks_data.json',
                'tests/appconf/fixtures/appconf_data.json',
                ]

    create_stack_payload = {
        'name': 'test stack 1',
        'description': 'test description 1'
    }

    def setUp(self):
        Person.objects.create_user(email='testing@goss.com', username='testing', password='password')
        Person.objects.create_superuser(email='admin_testing@goss.com', username='admin_testing', password='password')

    def test_user_creates_stack_dashboard_mappings(self):
        # Create Stack
        regular_user = Person.objects.get(username='testing')
        Stack.create(regular_user, self.create_stack_payload)
        domain_mappings_check = DomainMapping.objects.filter(src_type=MappingType.dashboard, src_id=6,
                                                             relationship_type=RelationshipType.cloneOf,
                                                             dest_type=MappingType.dashboard, dest_id=5).count()
        group_check_created = OwfGroupPeople.objects.filter(person_id=regular_user.id).count()
        dashboard_check_created = Dashboard.objects.filter(user_id=regular_user.id).count()
        stack_owner = Stack.objects.filter(owner_id=regular_user.id).count()
        stack_total = Stack.objects.all().count()

        # Test Create Stack, Groups, Dashboards and Domain Mappings
        self.assertEqual(stack_owner, 1)
        self.assertEqual(stack_total, 3)
        self.assertEqual(dashboard_check_created, 1)
        self.assertEqual(group_check_created, 2)
        self.assertEqual(domain_mappings_check, 1)

        # Login as Admin user again and delete the new user that we created
        requests.login(email='admin@goss.com', password='password')
        delete_user_url = reverse('person-detail', args=f'{regular_user.id}')
        delete_user_response = requests.delete(delete_user_url)
        group_check_deleted = OwfGroupPeople.objects.filter(person_id=regular_user.id).count()
        dashboard_check_deleted = Dashboard.objects.filter(user_id=regular_user.id).count()
        stack_owner_deleted = Stack.objects.filter(owner_id=regular_user.id).count()
        stack_total_2 = Stack.objects.all().count()
        # Check that the domain mappings are gone for the personal dashboard
        domain_mappings_check_delete = DomainMapping.objects.filter(src_type=MappingType.dashboard, src_id=6,
                                                                    relationship_type=RelationshipType.cloneOf,
                                                                    dest_type=MappingType.dashboard, dest_id=5).count()

        # Test Delete Stack, Groups, Dashboards and Domain Mappings
        self.assertEqual(domain_mappings_check_delete, 1)
        self.assertEqual(stack_owner_deleted, 0)
        self.assertEqual(stack_total_2, 3)
        self.assertEqual(dashboard_check_deleted, 0)
        self.assertEqual(group_check_deleted, 0)
        self.assertEqual(domain_mappings_check_delete, 1)
        self.assertEqual(delete_user_response.status_code, 204)

        requests.logout()

    def test_admin_deletion_self_and_super_restrictions(self):

        # Check that admin cannot delete super user or self
        requests.login(email='admin_testing@goss.com', password='password')

        # Admin user cannot delete super user
        delete_user_super_url = reverse('person-detail', args='1')
        delete_user_super_response = requests.delete(delete_user_super_url)
        self.assertEqual(delete_user_super_response.status_code, 409)

        # Admin user cannot delete self
        delete_user_self_url = reverse('person-detail', args='4')
        delete_user_self_response = requests.delete(delete_user_self_url)
        self.assertEqual(delete_user_self_response.status_code, 409)

        # Admin user can delete a user
        delete_user_normal_url = reverse('person-detail', args='2')
        delete_user_normal_response = requests.delete(delete_user_normal_url)
        self.assertEqual(delete_user_normal_response.status_code, 204)

        requests.logout()
