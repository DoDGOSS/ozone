from django.test import TestCase
from owf_groups.models import OwfGroup


class OWFGroupTest(TestCase):

    def test_owf_group(self):
        instance = OwfGroup(name="test group")
        self.assertTrue(isinstance(instance, OwfGroup))
        self.assertEqual(instance.__str__(), instance.name)
