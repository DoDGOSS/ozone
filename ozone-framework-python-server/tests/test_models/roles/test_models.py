from django.test import TestCase
from roles.models import Role


class RoleTest(TestCase):

    def test_role(self):
        instance = Role(authority="ROLE_ADMIN")
        self.assertTrue(isinstance(instance, Role))
        self.assertEqual(instance.authority, instance.authority)
