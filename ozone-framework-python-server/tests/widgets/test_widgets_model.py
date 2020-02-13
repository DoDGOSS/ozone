import uuid
from django.test import TestCase

from domain_mappings.models import DomainMapping, MappingType, RelationshipType
from people.models import Person, PersonWidgetDefinition
from widgets.models import WidgetDefinition, WidgetDefIntent, WidgetDefIntentDataTypes
from intents.models import IntentDataTypes

payload = {
    "version": 1,
    "visible": True,
    "image_url_medium": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "image_url_small": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "singleton": False,
    "width": 200,
    "widget_version": "1",
    "height": 200,
    "widget_url": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "widget_guid": uuid.uuid4,
    "display_name": "Test Widget",
    "background": False,
    "universal_name": "test_widget_x",
    "descriptor_url": "Description for a url",
    "description": "Description...",
    "mobile_ready": False,
    "intents": {
        "send": [
            {
                "action": "act",
                "data_types": [
                    "type-1",
                    "type-2"
                ]
            },
            {
                "action": "another",
                "data_types": [
                    "another_type"
                ]
            }
        ],
        "receive": [
            {
                "action": "act",
                "data_types": [
                    "type-1",
                    "type-2"
                ]
            },
            {
                "action": "another",
                "data_types": [
                    "another_type"
                ]
            }
        ]
    }
}


class WidgetModelTests(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    def test_create(self):
        # create - new item does not exists yet.
        instance = WidgetDefinition.objects.create(**payload)
        intent_send = WidgetDefIntent.objects.filter(widget_definition=instance, send=True)
        intent_receive = WidgetDefIntent.objects.filter(widget_definition=instance, receive=True)

        self.assertTrue(isinstance(instance, WidgetDefinition))

        self.assertEqual(intent_send.count(), 2)
        self.assertEqual(intent_receive.count(), 2)
        self.assertEqual(IntentDataTypes.objects.count(), 4)
        self.assertEqual(WidgetDefIntent.objects.count(), 6)
        self.assertEqual(WidgetDefIntentDataTypes.objects.count(), 8)

        self.assertIn('act', intent_send.values_list('intent__action', flat=True))
        self.assertIn('act', intent_receive.values_list('intent__action', flat=True))

        self.assertIn('type-1', intent_send.filter(intent__action='act').values_list(
            'widgetdefintentdatatypes__intent_data_type__data_type', flat=True))

        self.assertIn('type-2', intent_send.filter(intent__action='act').values_list(
            'widgetdefintentdatatypes__intent_data_type__data_type', flat=True))

        self.assertNotIn('another_type', intent_send.filter(intent__action='act').values_list(
            'widgetdefintentdatatypes__intent_data_type__data_type', flat=True))

        self.assertNotIn('type-1', intent_receive.filter(intent__action='another').values_list(
            'widgetdefintentdatatypes__intent_data_type__data_type', flat=True))

    def test_delete_widget(self):
        widget = WidgetDefinition.objects.get(pk=6)
        widget.delete()

        self.assertFalse(DomainMapping.objects.filter(dest_type=MappingType.widget, dest_id=widget.id).exists())

        self.assertTrue(Person.objects.filter(pk=1, requires_sync=True).exists())
        self.assertTrue(Person.objects.filter(pk=2, requires_sync=True).exists())
