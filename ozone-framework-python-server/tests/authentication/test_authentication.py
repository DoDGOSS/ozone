from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

from appconf.models import ApplicationConfiguration
from people.models import PersonSession

requests = APIClient()
requests_2 = APIClient()
requests_3 = APIClient()


class TestAuthenticationApi(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

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

    def test_session_mgnt(self):
        session_mgnt_settings = ApplicationConfiguration.objects.get(code='owf.session.control.enabled')
        session_mgnt_settings.value = 'True'
        session_mgnt_settings.save()
        self.assertEqual(ApplicationConfiguration.objects.get(code='owf.session.control.enabled').value, 'True')
        count_of_user_sessions = PersonSession.objects.filter(person_id=1).count()
        self.assertEqual(count_of_user_sessions, 0)
        change_max = ApplicationConfiguration.objects.get(code='owf.session.control.max.concurrent')
        change_max.value = 2
        change_max.save()
        requests_2.login(email='admin@goss.com', password='password')
        requests_3.login(email='admin@goss.com', password='password')
        requests.login(email='admin@goss.com', password='password')
        count_of_user_sessions_after_login = PersonSession.objects.filter(person_id=1).count()
        self.assertEqual(count_of_user_sessions_after_login, int(ApplicationConfiguration.objects.get(
            code='owf.session.control.max.concurrent'
        ).value))
        requests.logout()
