from django.test import TestCase
from people.models import Person

payload = {
    "username": "test-user"
}


class PersonTest(TestCase):

    def test_person(self):
        instance = Person(**payload)
        self.assertTrue(isinstance(instance, Person))
        self.assertEqual(instance.username, payload['username'])
