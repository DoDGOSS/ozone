from django.http import QueryDict
from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person, PersonWidgetDefinition
from stacks.models import Stack

requests = APIClient()

payload = {
    "person": 2,
    "widget_definition": 1
}


class PersonWidgetDefinitionAdminApiTests(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    def test_admin_create_person_widget(self):
        requests.login(email='admin@goss.com', password='password')

        # create - new item does not exists yet.
        url = reverse('admin_users-widgets-list')
        response = requests.post(url, payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertGreaterEqual(response.data['id'], 2)
        self.assertEqual(response.data['user_widget'], True)

        # create again - this item exists already
        url = reverse('admin_users-widgets-list')
        response = requests.post(url, payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertGreaterEqual(response.data['id'], 2)
        self.assertEqual(response.data['user_widget'], True)
        requests.logout()

    def test_admin_create_person_widget_bulk_users(self):
        requests.login(email='admin@goss.com', password='password')

        # create - new item does not exists yet.
        url = reverse('admin_users-widgets-list')
        payload = {"person_ids": [1, 2], "widget_definition": 1}
        response = requests.post(url, payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.data), 2)

        requests.logout()

    def test_admin_list_person_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_users-widgets-list')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 21)
        requests.logout()

    def test_admin_detail_person_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_users-widgets-detail', args='8')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 8)
        self.assertEqual(response.data['value']['display_name'], "Channel Shouter")
        requests.logout()

    def test_admin_update_person_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_users-widgets-detail', args='3')
        payload['display_name'] = 'Widget Def Two Updated'
        response = requests.put(url, payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['display_name'], 'Widget Def Two Updated')
        requests.logout()

    def test_admin_filter_by_user_person_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_users-widgets-list')
        filter_url = f'{url}?person=1'
        response = requests.get(filter_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 13)

        # Non existing group_people entry
        filter_url = f'{url}?person=3'
        response_fail = requests.get(filter_url)

        self.assertEqual(response_fail.status_code, 400)
        requests.logout()

    def test_admin_filter_by_widget_person_widget(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_users-widgets-list')
        filter_url = f'{url}?widget_definition=1'
        response = requests.get(filter_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

        # Non existing group_people entry
        filter_url = f'{url}?widget_definition=0'
        response_fail = requests.get(filter_url)

        self.assertEqual(response_fail.status_code, 400)
        requests.logout()

    def test_admin_delete_person_widget_should_not_hard_delete(self):
        group_widget = PersonWidgetDefinition.objects.get(id=3)
        group_widget.group_widget = True
        group_widget.save()

        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_users-widgets-detail', args='0')
        response = requests.delete(url,
                                   {'widget_id': group_widget.widget_definition.id,
                                    'person_id': group_widget.person.id})

        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.data, None)

        # read detail
        url = reverse('admin_users-widgets-detail', args='3')
        response = requests.get(url)

        self.assertEqual(response.data['value']['groupWidget'], True)
        self.assertEqual(response.data['value']['userWidget'], False)
        requests.logout()

    def test_admin_delete_person_widget_should_hard_delete_admin(self):
        requests.login(email='admin@goss.com', password='password')

        # create new for hard delete.
        url = reverse('admin_users-widgets-list')
        created = requests.post(url, payload, format="json")
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.data['group_widget'], False)

        # delete
        url = reverse('admin_users-widgets-detail', args=('0'))
        response = requests.delete(url,
                                   {'widget_id': created.data["widget_definition"],
                                    'person_id': created.data["person"]})

        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.data, None)

        # read again detail
        url = reverse('admin_users-widgets-detail', args=(f'{created.data["id"]}',))
        response = requests.get(url)

        self.assertEqual(response.status_code, 404)
        requests.logout()

    def test_admin_auth_only_person_widget(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('admin_users-widgets-list')
        filter_url = f'{url}?user=2'
        response = requests.get(filter_url, format="json")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['detail'].code, 'permission_denied')
        requests.logout()


create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}

create_stack_payload2 = {
    'name': 'test stack 2',
    'description': 'test description 2'
}


class PersonStacksAdminApiTests(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    def setUp(self):
        self.admin_user = Person.objects.get(pk=1)

    def test_admin_filter_by_user_users_stacks(self):
        # Get all stacks directly assigned to user
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_users-stacks')
        filter_url = f'{url}?person={self.admin_user.id}'
        response = requests.get(filter_url)

        stacks = response.data['stacks']

        self.assertEqual(len(stacks), 2)
        self.assertEqual(response.status_code, 200)

    def test_admin_auth_only_groups_people(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('admin_users-stacks')
        filter_url = f'{url}?person=1'
        response = requests.get(filter_url)

        self.assertEqual(response.status_code, 403)
        requests.logout()
