from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person
from owf_groups.models import OwfGroup

requests = APIClient()


class GroupsApiTests(TestCase):
    fixtures = ['people_data.json']

    def setUp(self):
        self.admin_user = Person.objects.get(pk=1)
        self.regular_user = Person.objects.get(pk=2)

        # create group
        self.group = OwfGroup.objects.create(name="group")
        self.group.people.add(self.regular_user)

    def test_admin_can_remove_user_from_group(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-people-list')
        response = requests.delete(url, {'user': self.regular_user.id, 'group': self.group.id})

        self.assertEqual(response.status_code, 405)
        requests.logout()

    def test_nonadmin_cannot_remove_user_from_group(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('admin_groups-people-list')
        response = requests.delete(url, {'user': self.regular_user.id, 'group': self.group.id})

        self.assertEqual(response.status_code, 403)
        requests.logout()
