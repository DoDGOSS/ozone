from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()


class TestAuthenticationApi(TestCase):
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json',
                ]

    def test_authentication_via_email(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('user-detail')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)

        requests.logout()

    def test_authentication_via_email_as_username(self):
        requests.login(email='admin', password='password')
        url = reverse('user-detail')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)

        requests.logout()

    def test_authentication_via_username(self):
        requests.login(username='admin', password='password')
        url = reverse('user-detail')
        response = requests.get(url)

        self.assertEqual(response.status_code, 200)

        requests.logout()
