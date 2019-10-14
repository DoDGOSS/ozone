import time
from django.test import TestCase
from appconf.models import ApplicationConfiguration
from domain_mappings.models import DomainMapping, MappingType, RelationshipType
from intents.models import IntentDataType, Intent
from owf_groups.models import OwfGroup
from people.models import Person, PersonWidgetDefinition
from preferences.models import Preference
from stacks.models import Stack
from widgets.models import WidgetDefIntent, WidgetType, WidgetDefinition
from dashboards.models import Dashboard


class VersionUpdateOnSave(TestCase):
    fixtures = ['people_data.json',
                'stacks_data.json',
                'dashboard_data.json',
                'groups_data.json',
                'pref_data.json',
                'widget_data.json',
                'appconf_data.json']

    def setUp(self):
        ApplicationConfiguration.objects.create(code="fake1234_owf.enable.cef.logging",
                                                value=False,
                                                title="Enable CEF Logging",
                                                description="None",
                                                type="Boolean",
                                                group_name="AUDITING",
                                                sub_group_name="None",
                                                mutable=True,
                                                sub_group_order=1,
                                                help="help",
                                                created_by_id=1,
                                                edited_by_id=1)

        DomainMapping.objects.create(src_id=100, src_type=MappingType.group, relationship_type=RelationshipType.owns,
                                     dest_id=100, dest_type=MappingType.dashboard)

        Intent.objects.create(action='test1')
        IntentDataType.objects.create(data_type='test2')

        OwfGroup.objects.create(
            email='email@email.com',
            name='special_name',
            display_name='special_name'
        )

        Person.objects.create_user(email='email_test@goss.com', username='test_user_version', password='password')
        PersonWidgetDefinition.objects.create(
            person=Person.objects.get(id=1),
            widget_definition=WidgetDefinition.objects.get(id=1),
            display_name='xxx_test_xxx'
        )

        Preference.objects.create(
            value='this_is_a_test',
            path='path',
            user_id=1,
            namespace='name'
        )

        WidgetDefinition.objects.create(
            visible=True,
            image_url_medium='blah',
            image_url_small='blah',
            width=20,
            height=20,
            widget_url='blah',
            widget_guid='testGUID',
            display_name='testGUID',
            universal_name='testGUID',
            descriptor_url='testGUID',
            description='testGUID'
        )
        WidgetDefIntent.objects.create(
            receive=True,
            send=True,
            intent=Intent.objects.get(action='test1'),
            widget_definition=WidgetDefinition.objects.get(id=1)
        )
        WidgetType.objects.create(
            name='xxx_test_xxx',
            display_name='xxx_test_xxx'
        )

        Stack.objects.create(name='testing_version')

    def test_version_update_on_save_appconf_model(self):
        current_time = int(time.time())
        item_change = ApplicationConfiguration.objects.get(code='fake1234_owf.enable.cef.logging')
        item_change.title = 'changed'

        item_change.save()

        check_item = ApplicationConfiguration.objects.get(code='fake1234_owf.enable.cef.logging')

        self.assertEqual(check_item.title, 'changed')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_domain_mapping_model(self):
        current_time = int(time.time())
        item_change = DomainMapping.objects.get(src_id=100, src_type=MappingType.group,
                                                relationship_type=RelationshipType.owns,
                                                dest_id=100, dest_type=MappingType.dashboard)
        item_change.src_id = 101

        item_change.save()

        check_item = DomainMapping.objects.get(src_id=101, src_type=MappingType.group,
                                               relationship_type=RelationshipType.owns,
                                               dest_id=100, dest_type=MappingType.dashboard)

        self.assertEqual(check_item.src_id, 101)
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_intent_model(self):
        current_time = int(time.time())
        item_change = Intent.objects.get(action='test1')
        item_change.action = 'test123'

        item_change.save()

        check_item = Intent.objects.get(action='test123')

        self.assertEqual(check_item.action, 'test123')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_intent_data_type_model(self):
        current_time = int(time.time())
        item_change = IntentDataType.objects.get(data_type='test2')
        item_change.data_type = 'test123'

        item_change.save()

        check_item = IntentDataType.objects.get(data_type='test123')

        self.assertEqual(check_item.data_type, 'test123')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_owf_groups_model(self):
        current_time = int(time.time())
        item_change = OwfGroup.objects.get(name='special_name')
        item_change.email = 'emailer@email.com'

        item_change.save()

        check_item = OwfGroup.objects.get(name='special_name')

        self.assertEqual(check_item.email, 'emailer@email.com')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_person_model(self):
        current_time = int(time.time())
        item_change = Person.objects.get(username='test_user_version')
        item_change.email = 'email_test_2@goss.com'

        item_change.save()

        check_item = Person.objects.get(username='test_user_version')

        self.assertEqual(check_item.email, 'email_test_2@goss.com')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_person_widget_definition_model(self):
        current_time = int(time.time())
        item_change = PersonWidgetDefinition.objects.get(display_name='xxx_test_xxx')
        item_change.display_name = 'xxx'

        item_change.save()

        check_item = PersonWidgetDefinition.objects.get(display_name='xxx')

        self.assertEqual(check_item.display_name, 'xxx')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_preferences_model(self):
        current_time = int(time.time())
        item_change = Preference.objects.get(value='this_is_a_test')
        item_change.path = 'path_change'

        item_change.save()

        check_item = Preference.objects.get(value='this_is_a_test')

        self.assertEqual(check_item.path, 'path_change')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_widget_definition_intent_model(self):
        current_time = int(time.time())
        item_change = WidgetDefIntent.objects.get(receive=True,
                                                  send=True,
                                                  intent=Intent.objects.get(action='test1'),
                                                  widget_definition=WidgetDefinition.objects.get(id=1)
                                                  )
        item_change.send = False

        item_change.save()

        check_item = WidgetDefIntent.objects.get(receive=True,
                                                 send=False,
                                                 intent=Intent.objects.get(action='test1'),
                                                 widget_definition=WidgetDefinition.objects.get(id=1)
                                                 )

        self.assertEqual(check_item.send, False)
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_widget_type_model(self):
        current_time = int(time.time())
        item_change = WidgetType.objects.get(name='xxx_test_xxx', display_name='xxx_test_xxx', )
        item_change.display_name = 'xxx_xxx'

        item_change.save()

        check_item = WidgetType.objects.get(name='xxx_test_xxx', display_name='xxx_xxx')

        self.assertEqual(check_item.display_name, 'xxx_xxx')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_widget_definition_model(self):
        current_time = int(time.time())
        item_change = WidgetDefinition.objects.get(visible=True,
                                                   image_url_medium='blah',
                                                   image_url_small='blah',
                                                   width=20,
                                                   height=20,
                                                   widget_url='blah',
                                                   widget_guid='testGUID',
                                                   display_name='testGUID',
                                                   universal_name='testGUID',
                                                   descriptor_url='testGUID',
                                                   description='testGUID')
        item_change.image_url_medium = 'xxx_xxx.com'

        item_change.save()

        check_item = WidgetDefinition.objects.get(visible=True,
                                                  image_url_medium='xxx_xxx.com',
                                                  image_url_small='blah',
                                                  width=20,
                                                  height=20,
                                                  widget_url='blah',
                                                  widget_guid='testGUID',
                                                  display_name='testGUID',
                                                  universal_name='testGUID',
                                                  descriptor_url='testGUID',
                                                  description='testGUID')

        self.assertEqual(check_item.image_url_medium, 'xxx_xxx.com')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_stack_model(self):
        current_time = int(time.time())
        item_change = Stack.objects.get(name='testing_version')
        item_change.description = 'xxx_xxx'

        item_change.save()

        check_item = Stack.objects.get(name='testing_version')

        self.assertEqual(check_item.description, 'xxx_xxx')
        self.assertGreaterEqual(check_item.version, current_time)

    def test_version_update_on_save_dashboard_model(self):
        current_time = int(time.time())
        item_change = Dashboard.objects.get(id=1)
        item_change.name = 'xxx_xxx'

        item_change.save()

        check_item = Dashboard.objects.get(id=1)

        self.assertEqual(check_item.name, 'xxx_xxx')
        self.assertGreaterEqual(check_item.version, current_time)
