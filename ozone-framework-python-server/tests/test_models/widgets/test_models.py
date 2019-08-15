from django.test import TestCase
from widgets.models import WidgetDefinition


class WidgetDefinitionTest(TestCase):

    def test_widget_definition(self):
        instance = WidgetDefinition(display_name="test widget")
        self.assertTrue(isinstance(instance, WidgetDefinition))
        self.assertEqual(instance.__str__(), instance.display_name)
        self.assertIsNotNone(instance.widget_guid)
