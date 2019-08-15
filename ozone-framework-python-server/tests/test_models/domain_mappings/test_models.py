from django.test import TestCase
from domain_mappings.models import DomainMapping


class DomainMappingTest(TestCase):

    def test_domain_mapping(self):
        instance = DomainMapping(relationship_type="requires")
        self.assertTrue(isinstance(instance, DomainMapping))
        self.assertEqual(instance.relationship_type, instance.relationship_type)
