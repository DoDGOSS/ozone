from django.test import TestCase
from owf_groups.models import OwfGroup
from widgets.models import WidgetDefinition
from domain_mappings.models import DomainMapping, RelationshipType


class GroupWidgetModelTests(TestCase):
    fixtures = ['people_data.json', 'groups_data.json', 'widget_data.json']

    def test_add_widget_to_group(self):
        group = OwfGroup.objects.get(id=1)
        widget = WidgetDefinition.objects.get(id=1)

        instance, created = group.add_widget(widget=widget)

        self.assertEqual(created, True)
        self.assertIsInstance(instance, DomainMapping)
        self.assertEqual(instance.src_id, group.id)
        self.assertEqual(instance.dest_id, widget.id)
        self.assertEqual(instance.relationship_type, RelationshipType.owns)

        # Assure requires_sync is True for users in that group based on their roles.
        self.assertTrue(all(group.people.values_list('requires_sync', flat=True)), True)

    def test_remove_widget_from_group(self):
        # add a widget to a group first.
        self.test_add_widget_to_group()

        group = OwfGroup.objects.get(id=1)
        widget = WidgetDefinition.objects.get(id=1)

        deleted, _ = group.remove_widget(widget=widget)

        # Assure requires_sync is True for users in that group based on their roles.
        self.assertTrue(all(group.people.values_list('requires_sync', flat=True)), True)
        self.assertRaises(DomainMapping.DoesNotExist, DomainMapping.objects.get, pk=deleted)
