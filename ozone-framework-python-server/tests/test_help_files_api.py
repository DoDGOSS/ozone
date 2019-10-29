import json
from rest_framework.test import APIClient
from django.test import TestCase
from django.urls import reverse

requests = APIClient()


def ordered(obj):
    if isinstance(obj, dict):
        return sorted((k, ordered(v)) for k, v in obj.items())
    if isinstance(obj, list):
        return sorted(ordered(x) for x in obj)
    else:
        return obj


class HelpFilesAPITest(TestCase):
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json']

    url = reverse('help_files')

    assert_data = [{"text": "ReadMe.pdf", "path": "/ReadMe.pdf", "url": "http://127.0.0.1:8000/help_files/ReadMe.pdf",
                    "leaf": True}, {"text": "sample_dir_test", "path": "/sample_dir_test/",
                                    "url": "http://127.0.0.1:8000/help_files/sample_dir_test", "leaf": False,
                                    "children": [{"text": "test.txt", "path": "/test.txt",
                                                  "url": "http://127.0.0.1:8000/help_files/sample_dir_test/test.txt",
                                                  "leaf": True},
                                                 {"text": "ReadMe.pdf", "path": "/ReadMe.pdf",
                                                  "url": "http://127.0.0.1:8000/help_files/sample_dir_test/ReadMe.pdf",
                                                  "leaf": True}]},
                   {"text": "testing_dir", "path": "/testing_dir/",
                    "url": "http://127.0.0.1:8000/help_files/testing_dir", "leaf": False, "children": [
                       {"text": "test.txt", "path": "/test.txt",
                        "url": "http://127.0.0.1:8000/help_files/testing_dir/test.txt", "leaf": True}]}]

    def test_help_files_list_response(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.get(self.url)

        self.assertEqual(ordered(self.assert_data), ordered(request.data))

        requests.logout()

    def test_help_files_api_authentication(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.get(self.url)

        self.assertEqual(request.status_code, 200)

        requests.logout()

        requests.login(email='user@goss.com', password='password')
        request = requests.get(self.url)

        self.assertEqual(request.status_code, 200)

        requests.logout()
