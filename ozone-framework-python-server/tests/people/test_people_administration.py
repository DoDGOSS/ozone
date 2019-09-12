from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

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


class TestingPersonBaseUrl(TestCase):
    fixtures = ['people_data.json']

    def test_access_users_url(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('person-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 200)
        requests.logout()
        requests.login(email='user@goss.com', password='password')
        url = reverse('person-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 403)
        requests.logout()

    def test_operations_users_url(self):
        # Delete user 2
        requests.login(email='admin@goss.com', password='password')
        url = reverse('person-detail', args='2')
        del_data = requests.delete(url)
        self.assertEqual(del_data.status_code, 204)
        url = reverse('person-list')
        response = requests.get(url)
        self.assertEqual(response.data['count'], 1)
        # Add / Post new user || 3
        url_post = reverse('person-list')
        response_post = requests.post(url_post, payload)
        self.assertEqual(response_post.status_code, 201)
        url = reverse('person-list')
        response = requests.get(url)
        self.assertEqual(response.data['count'], 2)
        # Update user 3 with new email
        url = reverse('person-detail', args='3')
        payload['email'] = 'test@goss.com'
        update_data = requests.put(url, payload)
        self.assertEqual(update_data.status_code, 200)
        url = reverse('person-detail', args='3')
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
