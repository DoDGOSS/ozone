from django.test import TestCase, TransactionTestCase
from dashboards.models import Dashboard
from domain_mappings.models import DomainMapping, MappingType, RelationshipType
from owf_groups.models import OwfGroup, OwfGroupPeople
from people.models import Person, PersonWidgetDefinition
from stacks.models import Stack, StackGroups
from widgets.models import WidgetDefinition

create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}


class GroupsModelTests(TransactionTestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    def setUp(self):
        self.admin_user = Person.objects.get(pk=1)
        self.regular_user = Person.objects.get(pk=2)

        # create group
        self.group1 = OwfGroup.objects.create(name="group1")
        self.group1.people.add(self.regular_user)

        stack = Stack.create(self.admin_user, create_stack_payload)
        # add group to stack - StackGroup
        StackGroups.objects.create(group=self.group1, stack=stack)

        # TODO: refactor to use a function to create and add a dashboard to a stack, when available
        self.group1_dash1 = Dashboard.objects.create(name="group1_dash1", stack=stack)
        self.user_dash1_for_group1 = Dashboard.objects.create(
            name="user_dash1_for_group1", user=self.regular_user, stack=stack
        )
        self.group1_dash1_domain_mapping = DomainMapping.create_group_dashboard_mapping(self.group1, self.group1_dash1)
        self.user_dash1_for_group_domain_mapping = DomainMapping.create_user_dashboard_mapping(
            self.user_dash1_for_group1,
            self.group1_dash1
        )

        # add widgets
        # create widget
        group_only_widget = WidgetDefinition.objects.create(
            display_name="group only widget",
            visible=True,
            image_url_medium="",
            image_url_small="",
            singleton=False,
            width=100,
            widget_version="0",
            height=100,
            widget_url="",
            mobile_ready=False
        )
        group_and_user_widget = WidgetDefinition.objects.create(
            display_name="group and user widget",
            visible=True,
            image_url_medium="",
            image_url_small="",
            singleton=False,
            width=100,
            widget_version="0",
            height=100,
            widget_url="",
            mobile_ready=False
        )
        user_only_widget = WidgetDefinition.objects.create(
            display_name="user only widget",
            visible=True,
            image_url_medium="",
            image_url_small="",
            singleton=False,
            width=100,
            widget_version="0",
            height=100,
            widget_url="",
            mobile_ready=False
        )
        # create user-widget relationship
        self.user_widget_assignment_through_group = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=group_only_widget,
            group_widget=True,
            user_widget=False,
            visible=True
        )
        self.user_widget_assignment_direct = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=user_only_widget,
            group_widget=False,
            user_widget=True,
            visible=True
        )
        self.user_widget_assignment_through_group_and_direct = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=group_and_user_widget,
            group_widget=True,
            user_widget=True,
            visible=True
        )
        # create group owns widget mappings
        self.group_only_widget_mapping = DomainMapping.objects.create(
            src_id=self.group1.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_id=group_only_widget.id,
            dest_type=MappingType.widget
        )
        self.group_and_user_widget_mapping = DomainMapping.objects.create(
            src_id=self.group1.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_id=group_and_user_widget.id,
            dest_type=MappingType.widget
        )

    def test_add_user_to_group(self):
        group = OwfGroup.objects.get(id=2)
        user = Person.objects.get(id=2)

        instance = group.add_user(user)

        self.assertTrue(isinstance(instance, OwfGroupPeople))
        self.assertEqual(instance.group, group)
        self.assertEqual(instance.person, user)

        # Assure user requires_sync is set to True
        user = Person.objects.get(pk=2)
        self.assertTrue(user.requires_sync)

    def test_remove_user_from_group(self):
        group = OwfGroup.objects.get(pk=self.group1.id)
        group.remove_user(self.regular_user)

        self.assertFalse(OwfGroupPeople.objects.filter(group=group, person=self.regular_user).exists())
        # check that dashboards assigned through group are cleaned up
        self.assertFalse(Dashboard.objects.filter(pk=self.user_dash1_for_group1.id).exists())
        self.assertFalse(DomainMapping.objects.filter(pk=self.user_dash1_for_group_domain_mapping.id).exists())

        # check that widgets assigned through group are cleaned up
        self.assertFalse(PersonWidgetDefinition.objects.filter(
            pk=self.user_widget_assignment_through_group.id).exists()
        )
        self.assertTrue(PersonWidgetDefinition.objects.filter(pk=self.user_widget_assignment_direct.id).exists())
        self.assertTrue(PersonWidgetDefinition.objects.filter(
            pk=self.user_widget_assignment_through_group_and_direct.id,
            user_widget=True,
            group_widget=False).exists()
        )
        self.assertTrue(PersonWidgetDefinition.objects.filter(pk=self.user_widget_assignment_direct.id).exists())

    def test_delete_group(self):
        group = OwfGroup.objects.get(pk=self.group1.id)
        group.delete()

        # check that group-user relationships are deleted
        self.assertFalse(OwfGroupPeople.objects.filter(group=self.group1).exists())
        self.assertFalse(StackGroups.objects.filter(group=self.group1).exists())

        # check that the user's group related widgets, dashboards, and domain mappings are deleted
        self.assertFalse(Dashboard.objects.filter(pk=self.user_dash1_for_group1.id).exists())
        self.assertFalse(DomainMapping.objects.filter(pk=self.user_dash1_for_group_domain_mapping.id).exists())
        self.assertFalse(PersonWidgetDefinition.objects.filter(
            pk=self.user_widget_assignment_through_group.id).exists()
        )
        self.assertTrue(PersonWidgetDefinition.objects.filter(pk=self.user_widget_assignment_direct.id).exists())
        self.assertTrue(PersonWidgetDefinition.objects.filter(
            pk=self.user_widget_assignment_through_group_and_direct.id,
            user_widget=True,
            group_widget=False).exists()
        )
        # check that group mappings and dashboards are deleted
        self.assertFalse(Dashboard.objects.filter(pk=self.group1_dash1.id).exists())
        self.assertFalse(DomainMapping.objects.filter(pk=self.group1_dash1_domain_mapping.id).exists())

        self.assertTrue(Person.objects.filter(pk=self.regular_user.id, requires_sync=True).exists())


class GroupWidgetModelTests(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

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

        group = OwfGroup.objects.get(id=2)
        widget = WidgetDefinition.objects.get(id=1)

        deleted, _ = group.remove_widget(widget=widget)

        # Assure requires_sync is True for users in that group based on their roles.
        self.assertTrue(all(group.people.values_list('requires_sync', flat=True)), True)
        self.assertRaises(DomainMapping.DoesNotExist, DomainMapping.objects.get, pk=deleted)
