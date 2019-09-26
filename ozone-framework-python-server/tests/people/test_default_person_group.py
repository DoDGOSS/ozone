from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person
from owf_groups.models import OwfGroupPeople, OwfGroup
from django.conf import settings

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


class TestingPersonGroupCreation(TestCase):
    fixtures = ['people_data.json', 'groups_data.json']

    def test_that_the_groups_exist(self):
        base_group = settings.DEFAULT_USER_GROUP
        base_group_test = OwfGroup.objects.filter(name=base_group).exists()
        self.assertEqual(base_group_test, True)
        admin_group = settings.DEFAULT_ADMIN_GROUP
        admin_group_test = OwfGroup.objects.filter(name=admin_group).exists()
        self.assertEqual(admin_group_test, True)

    def test_headless_add_to_default_group(self):
        # Headless Create User Basic
        Person.objects.create_user(email='new_base_user@gmail.com',
                                   username='new_base_user',
                                   password='password')
        # Test in DB Base User should see basic group
        base_user = Person.objects.get(username='new_base_user')
        base_group = OwfGroup.objects.get(name=settings.DEFAULT_USER_GROUP)
        test_base = OwfGroupPeople.objects.filter(group_id=base_group, person_id=base_user.id).exists()
        self.assertEqual(test_base, True)
        # Headless Create User Admin/Super
        Person.objects.create_superuser(email='new_super_user@gmail.com',
                                        username='new_super_user',
                                        password='password')
        # Test in DB should see in admin group and basic group
        admin_user = Person.objects.get(username='new_super_user')
        admin_group = OwfGroup.objects.get(name=settings.DEFAULT_ADMIN_GROUP)
        test_admin = OwfGroupPeople.objects.filter(group_id=admin_group, person_id=admin_user.id).exists()
        self.assertEqual(test_admin, True)
        test_for_base = OwfGroupPeople.objects.filter(group_id=base_group, person_id=admin_user.id).exists()
        self.assertEqual(test_for_base, True)

    def test_endpoint_creation(self):
        requests.login(email='admin@goss.com', password='password')
        post_url = reverse('person-list')
        response_post = requests.post(post_url, payload)
        self.assertEqual(response_post.status_code, 201)
        test_basic = OwfGroupPeople.objects.filter(person_id=3)
        self.assertEqual(test_basic.count(), 1)
        requests.login(email='admin@goss.com', password='password')
        post_url = reverse('person-detail', args='3')
        payload['is_admin'] = True
        response_patch = requests.patch(post_url, payload)
        self.assertEqual(response_patch.status_code, 200)
        test_admin_basic = OwfGroupPeople.objects.filter(person_id=3)
        self.assertEqual(test_admin_basic.count(), 2)
        payload['is_admin'] = False
        response_patch2 = requests.patch(post_url, payload)
        self.assertEqual(response_patch2.status_code, 200)
        test_admin_basic = OwfGroupPeople.objects.filter(person_id=3)
        self.assertEqual(test_admin_basic.count(), 1)
