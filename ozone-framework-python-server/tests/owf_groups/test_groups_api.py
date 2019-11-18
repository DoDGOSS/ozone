from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person
from owf_groups.models import OwfGroup, OwfGroupPeople

requests = APIClient()


class GroupsApiTests(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    def setUp(self):
        self.admin_user = Person.objects.get(pk=1)
        self.regular_user = Person.objects.get(pk=2)

        # create group
        self.group = OwfGroup.objects.create(name="group")
        self.group.add_user(self.regular_user)

    def test_admin_can_remove_user_from_group(self):  # TODO: John
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-people-detail', args=('0'))

        response = requests.delete(url, {'group_id': self.group.id, 'person_id': self.regular_user.id})

        self.assertEqual(response.status_code, 204)
        requests.logout()

    def test_nonadmin_cannot_remove_user_from_group(self):
        requests.login(email='user@goss.com', password='password')
        group_people = OwfGroupPeople.objects.get(person=self.regular_user, group=self.group)
        url = reverse('admin_groups-people-detail', args=(group_people.id,))

        response = requests.delete(url)

        self.assertEqual(response.status_code, 403)
        requests.logout()
