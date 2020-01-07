from django.test.utils import override_settings
from rest_framework.test import APIClient
from django.test import TestCase
from django.urls import reverse
from django.conf import settings
from config.helpers.tree import tree_to_json


requests = APIClient()


def ordered(obj):
    if isinstance(obj, dict):
        return sorted((k, ordered(v)) for k, v in obj.items())
    if isinstance(obj, list):
        return sorted(ordered(x) for x in obj)
    else:
        return obj


class HelpFilesAPITest(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    @override_settings(DEBUG=False)
    def test_help_files_list_response_debug_false(self):
        url = reverse('help_files')
        requests.login(email='admin@goss.com', password='password')
        request = requests.get(url)

        self.assertEqual(ordered(tree_to_json(settings.HELP_FILES)), ordered(request.data))

        requests.logout()

    @override_settings(DEBUG=True)
    def test_help_files_list_response_debug_true(self):
        url = reverse('help_files')
        requests.login(email='admin@goss.com', password='password')
        request = requests.get(url)

        self.assertEqual(ordered(tree_to_json(settings.HELP_FILES)), ordered(request.data))

        requests.logout()

    def test_help_files_api_authentication(self):
        url = reverse('help_files')
        requests.login(email='admin@goss.com', password='password')
        request = requests.get(url)

        self.assertEqual(request.status_code, 200)

        requests.logout()

        requests.login(email='user@goss.com', password='password')
        request = requests.get(url)

        self.assertEqual(request.status_code, 200)

        requests.logout()
