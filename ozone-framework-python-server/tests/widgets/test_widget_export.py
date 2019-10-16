from django.test import TestCase
from intents.models import Intent, IntentDataType, IntentDataTypes
from widgets.models import WidgetDefinition, WidgetDefIntent, WidgetType, WidgetDefinitionWidgetTypes
from widgets.views import WidgetViewSet


class TestingWidgetExport(TestCase):
    fixtures = ['widget_data.json']

    # Descriptor export function with widget types
    def test_generate_descriptor_dict_widget_types(self):
        widget_type = WidgetType.objects.create(name='test_widget_type')
        WidgetDefinitionWidgetTypes.objects.create(
            widget_type=widget_type,
            widget_definition=WidgetDefinition.objects.get(id=1)
        )
        widget = WidgetDefinition.objects.get(id=1)

        export = WidgetViewSet._generate_descriptor_dict(None, widget)

        self.assertEquals(export.get('widgetTypes'), ['test_widget_type'])

    # Descriptor export function with no intents
    def test_generate_descriptor_dict_no_intents(self):
        widget = WidgetDefinition.objects.get(id=1)

        export = WidgetViewSet._generate_descriptor_dict(None, widget)

        self.assertFalse('intents' in export.keys())

    # Descriptor export function with "send" intent
    def test_generate_descriptor_dict_intents_send(self):
        intent = Intent.objects.create(action='send1')
        intent_data_type = IntentDataType.objects.create(data_type='test')
        WidgetDefIntent.objects.create(
            receive=False,
            send=True,
            intent=Intent.objects.get(action='send1'),
            widget_definition=WidgetDefinition.objects.get(id=1)
        )
        IntentDataTypes.objects.create(
            intent_data_type=intent_data_type,
            intent=intent
        )
        widget = WidgetDefinition.objects.get(id=1)

        export = WidgetViewSet._generate_descriptor_dict(None, widget)

        self.assertTrue('intents' in export.keys())

        self.assertTrue('send' in export.get('intents').keys())
        self.assertEquals(len(export.get('intents').get('send')), 1)

        self.assertEquals(export.get('intents').get('send')[0].get('action'), 'send1')
        self.assertEquals(export.get('intents').get('send')[0].get('dataTypes'), ['test'])

        self.assertFalse('receive' in export.get('intents').keys())

    # Descriptor export function with "receive" intent
    def test_generate_descriptor_dict_intents_receive(self):
        intent = Intent.objects.create(action='receive1')
        intent_data_type = IntentDataType.objects.create(data_type='test')
        WidgetDefIntent.objects.create(
            receive=True,
            send=False,
            intent=Intent.objects.get(action='receive1'),
            widget_definition=WidgetDefinition.objects.get(id=1)
        )
        IntentDataTypes.objects.create(
            intent_data_type=intent_data_type,
            intent=intent
        )
        widget = WidgetDefinition.objects.get(id=1)

        export = WidgetViewSet._generate_descriptor_dict(None, widget)

        self.assertTrue('intents' in export.keys())

        self.assertTrue('receive' in export.get('intents').keys())
        self.assertEquals(len(export.get('intents').get('receive')), 1)

        self.assertEquals(export.get('intents').get('receive')[0].get('action'), 'receive1')
        self.assertEquals(export.get('intents').get('receive')[0].get('dataTypes'), ['test'])

        self.assertFalse('send' in export.get('intents').keys())

    # Descriptor export function with "receive" and "send" intents
    def test_generate_descriptor_dict_intents_both(self):
        intent = Intent.objects.create(action='intent')
        intent_data_type = IntentDataType.objects.create(data_type='test')
        WidgetDefIntent.objects.create(
            receive=True,
            send=True,
            intent=Intent.objects.get(action='intent'),
            widget_definition=WidgetDefinition.objects.get(id=1)
        )
        IntentDataTypes.objects.create(
            intent_data_type=intent_data_type,
            intent=intent
        )
        widget = WidgetDefinition.objects.get(id=1)

        export = WidgetViewSet._generate_descriptor_dict(None, widget)

        self.assertTrue('intents' in export.keys())

        self.assertTrue('receive' in export.get('intents').keys())
        self.assertEquals(len(export.get('intents').get('receive')), 1)

        self.assertEquals(export.get('intents').get('receive')[0].get('action'), 'intent')
        self.assertEquals(export.get('intents').get('receive')[0].get('dataTypes'), ['test'])

        self.assertTrue('send' in export.get('intents').keys())
        self.assertEquals(len(export.get('intents').get('send')), 1)

        self.assertEquals(export.get('intents').get('send')[0].get('action'), 'intent')
        self.assertEquals(export.get('intents').get('send')[0].get('dataTypes'), ['test'])
