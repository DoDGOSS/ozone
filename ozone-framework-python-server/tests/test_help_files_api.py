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


assert_data_false = [
    {
        "text": "sample_dir_test",
                "leaf": False,
                "path": "sample_dir_test",
                "children": [
                    {
                        "text": "test.txt",
                        "leaf": True,
                        "path": "sample_dir_test/test.txt"
                    },
                    {
                        "text": "ReadMe.pdf",
                        "leaf": True,
                        "path": "sample_dir_test/ReadMe.pdf"
                    },
                    {
                        "text": "testing_dir",
                        "leaf": False,
                        "path": "sample_dir_test/testing_dir",
                        "children": [
                            {
                                "text": "test.txt",
                                "leaf": True,
                                "path": "sample_dir_test/testing_dir/test.txt"
                            }
                        ]
                    }
                ]
    },
    {
        "text": "ReadMe.pdf",
                "leaf": True,
                "path": "ReadMe.pdf"
    }
]

assert_data_true = [
    {
        "text": "sample_dir_test",
        "leaf": False,
        "path": "help_files/sample_dir_test",
        "children": [
                {
                    "text": "test.txt",
                    "leaf": True,
                    "path": "help_files/sample_dir_test/test.txt"
                },
            {
                    "text": "ReadMe.pdf",
                    "leaf": True,
                    "path": "help_files/sample_dir_test/ReadMe.pdf"
                },
            {
                    "text": "testing_dir",
                    "leaf": False,
                    "path": "help_files/sample_dir_test/testing_dir",
                    "children": [
                        {
                            "text": "test.txt",
                            "leaf": True,
                            "path": "help_files/sample_dir_test/testing_dir/test.txt"
                        }
                    ]
                }
        ]
    },
    {
        "text": "ReadMe.pdf",
        "leaf": True,
        "path": "help_files/ReadMe.pdf"
    }
]


class HelpFilesAPITest(TestCase):
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json']

    url = reverse('help_files')

    @override_settings(DEBUG=False)
    def test_help_files_list_response_debug_false(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.get(self.url)

        self.assertEqual(ordered(tree_to_json(settings.HELP_FILES)), ordered(request.data))

        requests.logout()

    @override_settings(DEBUG=True)
    def test_help_files_list_response_debug_true(self):
        requests.login(email='admin@goss.com', password='password')
        request = requests.get(self.url)

        # self.assertEqual(ordered(assert_data_true), ordered(request.data))
        self.assertEqual(ordered(tree_to_json(settings.HELP_FILES)), ordered(request.data))

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
