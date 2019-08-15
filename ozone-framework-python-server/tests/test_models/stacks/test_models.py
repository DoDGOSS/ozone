from django.test import TestCase
from stacks.models import Stack


class StackTest(TestCase):

    def test_stack(self):
        instance = Stack(name="test stack")
        self.assertTrue(isinstance(instance, Stack))
        self.assertEqual(instance.__str__(), instance.name)
