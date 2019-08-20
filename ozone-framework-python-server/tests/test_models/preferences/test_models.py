from django.test import TestCase
from preferences.models import Preference


class PreferenceTest(TestCase):

    def test_preference(self):
        instance = Preference(namespace="test-preference")
        self.assertTrue(isinstance(instance, Preference))
        self.assertEqual(instance.namespace, instance.namespace)
