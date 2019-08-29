from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()

payload = {
            'version': 1,
            'status': 'active',
            'email': 'admin@geocent.com',
            'description': 'Description for test group 2',
            'name': 'Test Group 2',
            'automatic': False,
            'display_name': 'Test Group 2',
            'stack_default': False
}


class TestingGroups(TestCase):
    fixtures = ['people_data.json', 'groups_data.json']

    def test_access_groups(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('owfgroup-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 200)
        requests.logout()
        requests.login(email='regular-user@goss.com', password='password')
        url = reverse('owfgroup-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 403)
        requests.logout()

    def test_groups_url(self):
        # Add / Post new group || 2
        requests.login(email='admin@goss.com', password='password')
        url_list = reverse('owfgroup-list')
        response_post = requests.post(url_list, payload)
        self.assertEqual(response_post.status_code, 201)
        # Get all of the groups & check update
        response = requests.get(url_list)
        self.assertEqual(response.data['count'], 2)
        # Get detail of new post
        url_detail = reverse('owfgroup-detail', args='2')
        response_detail = requests.get(url_detail)
        self.assertEqual(response_detail.data['id'], 2)
        # edit the new post || 2
        post_update_data = response_detail.data
        post_update_data['display_name'] = 'Test Group 2 update'
        response_update = requests.put(url_detail, data=post_update_data)
        self.assertEqual(response_update.status_code, 200)
        response_detail_2 = requests.get(url_detail)
        self.assertEqual(response_detail_2.data['id'], 2)
        self.assertEqual(response_detail_2.data['display_name'], 'Test Group 2 update')
        # delete the new post || 2
        del_data = requests.delete(url_detail)
        self.assertEqual(del_data.status_code, 204)
        response_2 = requests.get(url_list)
        self.assertEqual(response_2.data['count'], 1)
        requests.logout()
