import json
from django.test import TransactionTestCase
from people.models import Person, PersonWidgetDefinition
from domain_mappings.models import RelationshipType, MappingType, DomainMapping
from dashboards.models import Dashboard
from stacks.models import Stack, StackGroups
from owf_groups.models import OwfGroup
from widgets.models import WidgetDefinition


create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}

dashboard1_payload = {
    'name': 'test dash 1',
    'description': 'description for test dash 1',
    'type': '',
    'locked': '',
    'layout_config': '{\"backgroundWidgets\":[],\"panels\":[],\"tree\":null}'
}

dashboard2_payload = {
    'name': 'test dash 2',
    'description': 'description for test dash 2',
    'type': '',
    'locked': '',
    'layout_config': '{\"backgroundWidgets\":[],\"panels\":[],\"tree\":null}'
}


class StacksModelTests(TransactionTestCase):
    fixtures = ['tests/people/fixtures/people_data.json',
                'tests/widgets/fixtures/widget_data.json',
                'tests/owf_groups/fixtures/groups_data.json']

    def setUp(self):
        self.admin_user = Person.objects.get(pk=1)
        self.regular_user = Person.objects.get(pk=2)

        self.stack = Stack.create(self.regular_user, create_stack_payload)
        self.group = OwfGroup.objects.create(name="Test Group For Stack Tests")
        self.group.add_user(self.admin_user)
        self.group.add_user(self.regular_user)

        # set all users in test group requires_sync to false
        self.group.people.all().update(requires_sync=False)

    def test_user_can_create_stack(self):
        created_stack_id = Stack.create(self.regular_user, create_stack_payload).id

        created_stack = Stack.objects.get(pk=created_stack_id)
        self.assertTrue(created_stack.stack_context)

        # check that default group got created and assigned to the stack
        default_stack_group = created_stack.default_group
        self.assertIsNotNone(default_stack_group)
        self.assertEqual(default_stack_group.stack_default, True)
        self.assertEqual(default_stack_group.automatic, False)

        # check that the requesting user got added to the default group
        self.assertIsNotNone(default_stack_group.people.get(pk=self.regular_user.id))

        # check that the owner of the stack is the user
        self.assertEqual(created_stack.owner.id, self.regular_user.id)

        # check that a group dashboard got created
        group_dashboard = Dashboard.objects.get(stack=created_stack_id, user=None)
        self.assertIsNotNone(group_dashboard)
        self.assertEqual(group_dashboard.name, created_stack.name)

        # check that a personal dashboard got created
        user_dashboard = Dashboard.objects.get(stack=created_stack_id, user=self.regular_user)
        self.assertIsNotNone(user_dashboard)
        self.assertEqual(user_dashboard.name, group_dashboard.name)

        # check that the default group owns dashboard domain mapping get created
        group_dashboard_domain_mapping = DomainMapping.objects.get(
            src_id=default_stack_group.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_id=group_dashboard.id,
            dest_type=MappingType.dashboard
        )
        self.assertIsNotNone(group_dashboard_domain_mapping)

        # check that the personal dash is a cloneOf group dash domain mapping get created
        user_dashboard_domain_mapping = DomainMapping.objects.get(
            src_id=user_dashboard.id,
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_id=group_dashboard.id,
            dest_type=MappingType.dashboard
        )
        self.assertIsNotNone(user_dashboard_domain_mapping)

    def test_add_group_to_stack(self):
        instance = self.stack.add_group(self.group)

        self.assertTrue(isinstance(instance, StackGroups))
        self.assertEqual(instance.stack, self.stack)
        self.assertEqual(instance.group, self.group)

        # Assure all users in group requires_sync is set to True
        self.assertTrue(all(self.group.people.values_list('requires_sync', flat=True)), True)
        for user in self.group.people.all():
            self.assertTrue(user.requires_sync)

    def test_share_stack(self):
        # data setup
        widget1 = WidgetDefinition.objects.create(
            visible=True,
            image_url_medium='image_url_medium',
            image_url_small='image_url_small',
            singleton=False,
            width=100,
            height=100,
            widget_url='widget url',
            display_name='test widget 1'
        )
        widget2 = WidgetDefinition.objects.create(
            visible=True,
            image_url_medium='image_url_medium',
            image_url_small='image_url_small',
            singleton=False,
            width=100,
            height=100,
            widget_url='widget url',
            display_name='test widget 2'
        )
        widget3 = WidgetDefinition.objects.create(
            visible=True,
            image_url_medium='image_url_medium',
            image_url_small='image_url_small',
            singleton=False,
            width=100,
            height=100,
            widget_url='widget url',
            display_name='test widget 3'
        )
        user_widget1 = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=widget1
        )
        user_widget2 = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=widget2
        )
        user_widget3 = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=widget3
        )

        group_dash1, user_dash1 = self.stack.add_dashboard(self.regular_user, dashboard1_payload)
        group_dash2, user_dash2 = self.stack.add_dashboard(self.regular_user, dashboard2_payload)
        layout_config = {
            "tree": {
                "direction": "row",
                "first": "02d98075-2fd8-42f0-8e35-f24cd88d8856",
                "second": "b84f9fb1-e825-40b8-92bb-61937f9cd98f"
            },
            "panels": [{
                "id": "02d98075-2fd8-42f0-8e35-f24cd88d8856",
                "title": "Test Fit Panel",
                "type": "fit",
                "widgets": [{
                    "id": "ce14a7e5-e815-4759-b5a8-46f345edffc6",
                    "userWidgetId": user_widget1.id
                }]
            }, {
                "id": "b84f9fb1-e825-40b8-92bb-61937f9cd98f",
                "title": "Test Accordion Panel",
                "type": "accordion",
                "widgets": [{
                    "id": "e71ec8c6-f9e4-4258-a8cf-b348d7e91296",
                    "userWidgetId": user_widget2.id
                }, {
                    "id": "d74106d3-8eb3-41e1-8e2a-8785be3a49fd",
                    "userWidgetId": user_widget3.id
                }],
                "collapsed": []
            }],
            "backgroundWidgets": []
        }
        user_dash1.locked = True
        user_dash1.layout_config = json.dumps(layout_config)
        user_dash1.save()

        user_dash2.marked_for_deletion = True
        user_dash2.save()

        # method under test
        self.stack.share()

        # check that dashboards got deleted if they were marked for deletion
        group_dash2_mappings = DomainMapping.objects.filter(
            dest_type=MappingType.dashboard,
            dest_id=group_dash2.id
        )
        self.assertFalse(group_dash2_mappings.exists())
        self.assertFalse(Dashboard.objects.filter(pk=user_dash2.id).exists())

        # check that the group dashboard got updated with the owner's dashboard
        group_dashboard = Dashboard.objects.get(pk=group_dash1.id)
        user_dashboard = Dashboard.objects.get(pk=user_dash1.id)
        self.assertEqual(group_dashboard.name, user_dashboard.name)
        self.assertEqual(group_dashboard.description, user_dashboard.description)
        self.assertEqual(group_dashboard.type, user_dashboard.type)
        self.assertEqual(group_dashboard.locked, user_dashboard.locked)
        self.assertEqual(group_dashboard.layout_config, user_dashboard.layout_config)

        # check that new widgets from the dashboard got added to the stack
        widgets_to_stack_mapping = DomainMapping.objects.filter(
            src_id=self.stack.default_group.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_type=MappingType.widget
        )
        self.assertEqual(widgets_to_stack_mapping.count(), 3)
