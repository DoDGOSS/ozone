from django.test import TestCase
from intents.models import Intent, IntentDataType


class IntentTest(TestCase):

    def test_intent(self):
        instance = Intent(action="create")
        self.assertTrue(isinstance(instance, Intent))
        self.assertEqual(instance.__str__(), instance.action)


class IntentDataTypeTest(TestCase):

    def test_intent_data_type(self):
        instance = IntentDataType(data_type="png")
        self.assertTrue(isinstance(instance, IntentDataType))
        self.assertEqual(instance.__str__(), instance.data_type)
