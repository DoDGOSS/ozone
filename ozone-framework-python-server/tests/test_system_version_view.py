from rest_framework.test import APIClient
from django.test import TestCase
from django.conf import settings


requests = APIClient()


class SimpleSystemVersionTest(TestCase):
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json']

    def test_authentication(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.get('/system-version')
        self.assertEqual(request.status_code, 200)
        requests.logout()
        requests.login(email='user@goss.com', password='password')
        request = requests.get('/system-version')
        self.assertEqual(request.status_code, 200)
        requests.logout()
        request = requests.get('/system-version')
        self.assertEqual(request.status_code, 401)

    def test_get_system_version(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.get('/system-version')
        self.assertEqual(request.data, {'version': settings.SYSTEM_VERSION})
        requests.logout()

    def test_post_system_version(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.post('/system-version')
        self.assertEqual(request.status_code, 405)
        requests.logout()

    def test_put_system_version(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.put('/system-version')
        self.assertEqual(request.status_code, 405)
        requests.logout()

    def test_patch_system_version(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.patch('/system-version')
        self.assertEqual(request.status_code, 405)
        requests.logout()

    def test_delete_system_version(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.delete('/system-version')
        self.assertEqual(request.status_code, 405)
        requests.logout()
