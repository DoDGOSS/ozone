from django.test import TestCase
from people.models import Person, PersonWidgetDefinition
from widgets.models import WidgetDefinition

payload = {
    "person": Person(pk=2),
    "widget_definition": WidgetDefinition(pk=1),
}


class PersonTest(TestCase):
    fixtures = ['people_data.json', 'widget_data.json', 'people_widget_data.json']

    def test_create(self):
        # create - new item does not exists yet.
        instance = PersonWidgetDefinition.objects.create(**payload)

        self.assertTrue(isinstance(instance, PersonWidgetDefinition))
        self.assertEqual(instance.user_widget, False)

        # create again - this item exists already
        # which should just update user_widget true
        instance = PersonWidgetDefinition.objects.create(**payload)

        self.assertTrue(isinstance(instance, PersonWidgetDefinition))
        self.assertEqual(instance.user_widget, True)

    def test_delete_detail_should_not_hard_delete_admin(self):
        # create - this item exists already
        payload_existing = {**payload, "person": Person(pk=1)}
        instance = PersonWidgetDefinition.objects.create(**payload_existing)

        instance.delete()

        self.assertTrue(isinstance(instance, PersonWidgetDefinition))
        self.assertEqual(instance.group_widget, True)
        self.assertEqual(instance.user_widget, False)

    def test_delete_detail_should_hard_delete_admin(self):
        payload_existing = {**payload, "person": Person(pk=1)}
        instance = PersonWidgetDefinition.objects.get(**payload_existing)
        instance.group_widget = False
        instance.save()

        _sum, _ = instance.delete()

        self.assertEqual(_sum, 1)
        with self.assertRaises(PersonWidgetDefinition.DoesNotExist):
            PersonWidgetDefinition.objects.get(**payload_existing)
