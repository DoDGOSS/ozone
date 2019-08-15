from django.test import TestCase
from people.models import Person


class PersonTest(TestCase):

    def test_person(self):
        instance = Person(username="test-user")
        self.assertTrue(isinstance(instance, Person))
        self.assertEqual(instance.username, instance.username)
