"""

PLEASE README!!!!

This is a template for testing files.  Please follow the logical flow and adjust where needed when
developing your endpoints.

- Important to name the tests functions and methods starting with 'test' and the files start with 'test'.

- These tests should only be testing the endpoints that you are developing and not the framework itself.

- Things to test are things like:

    * Status codes.
    * Data correctness.
    * Action correctness (If you delete a item, make sure it deletes the item)
    * Ensure that your code does not duplicate any data that its not supposed to be duplicating.
    * Complex serialization if statements.
    * Authorization & Permissions.

These tests should only hold 1 - 2 classes
and should be short in code length about 100 - 150 lines excluding the imports.
"""
# Import the resting API client for requests.
from rest_framework.test import APIClient
# Import the Django test case that will allow for django to find the test
from django.test import TestCase

# Use a global function to start the api client
requests = APIClient()


class TemplateForTesting(TestCase):  # Change the class name to a name depicting the specific tests that you are making.
    fixtures = []  # Insert the test data here only by name Django will do the rest. Example (data.json)

    # Starts with test
    def test_method_one(self):  # Give me a meaningful name!
        # login to the auth system for the admin user
        requests.login(email='admin@goss.com', password='password')
        # log out of the system for the admin user
        self.assertEqual(1, 1)
        # Assertion of equality for each user.
        # log out of the system for the admin user
        requests.logout()
        # login to the auth system for the regular user
        requests.login(email='regular-user@goss.com', password='password')
        self.assertEqual(1, 1)
        # Assertion of equality for each user.
        # log out of the system for the regular user
        requests.logout()
