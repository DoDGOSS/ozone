from django.test import TestCase
from people.models import Person, PersonWidgetDefinition
from domain_mappings.models import DomainMapping, MappingType, RelationshipType
from dashboards.models import Dashboard
from stacks.models import Stack, StackGroups
from owf_groups.models import OwfGroup, GroupStatus
from widgets.models import WidgetDefinition

create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}

create_stack_payload2 = {
    'name': 'test stack 2',
    'description': 'test description 2'
}

create_stack_payload3 = {
    'name': 'test stack 3',
    'description': 'test description 3'
}

create_stack_payload4 = {
    'name': 'test stack 4',
    'description': 'test description 4'
}

create_stack_payload5 = {
    'name': 'test stack 5',
    'description': 'test description 5'
}

payload = {
    "person": Person(pk=2),
    "widget_definition": WidgetDefinition(pk=1),
}


class PersonModelTests(TestCase):
    fixtures = ['people_data.json', 'widget_data.json', 'people_widget_data.json']

    def setUp(self):
        # create user - done by fixture for now
        self.admin_user = Person.objects.get(pk=1)
        self.regular_user = Person.objects.get(pk=2)

        # # create group
        self.group1 = OwfGroup.objects.create(name="group1")
        self.group2 = OwfGroup.objects.create(name="group2")
        self.group3 = OwfGroup.objects.create(name="inactive group", status=GroupStatus.inactive)

        # add user to group - GroupPeople
        self.group1.people.add(self.regular_user)
        self.group2.people.add(self.regular_user)

        # create stack
        stack = Stack.create(self.admin_user, create_stack_payload)
        stack2 = Stack.create(self.admin_user, create_stack_payload2)

        # create 2 dashboards under the stack and their domain mappings
        # TODO: refactor to use a function to create and add a dashboard to a stack, when available
        self.group1_dash1 = Dashboard.objects.create(name="group1_dash1", stack=stack)
        self.user_dash1_for_group1 = Dashboard.objects.create(
            name="user_dash1_for_group1",
            user=self.regular_user,
            stack=stack
        )
        self.group1_dash1_domain_mapping = DomainMapping.create_group_dashboard_mapping(self.group1, self.group1_dash1)
        self.user_dash1_for_group_domain_mapping = DomainMapping.create_user_dashboard_mapping(
            self.user_dash1_for_group1,
            self.group1_dash1
        )

        self.group1_dash2 = Dashboard.objects.create(name="group1_dash2", stack=stack)
        self.user_dash2_for_group1 = Dashboard.objects.create(
            name="user_dash2_for_group1",
            user=self.regular_user,
            stack=stack
        )
        self.group1_dash2_domain_mapping = DomainMapping.create_group_dashboard_mapping(self.group1, self.group1_dash2)
        self.user_dash2_for_group1_domain_mapping = DomainMapping.create_user_dashboard_mapping(
            self.user_dash2_for_group1,
            self.group1_dash2
        )

        self.group2_dash1 = Dashboard.objects.create(name="group2_dash1", stack=stack2)
        self.user_dash1_for_group2 = Dashboard.objects.create(
            name="user_dash1_for_group2",
            user=self.regular_user,
            stack=stack2
        )
        self.group2_dash1_domain_mapping = DomainMapping.create_group_dashboard_mapping(self.group2, self.group2_dash1)
        self.user_dash1_for_group2_domain_mapping = DomainMapping.create_user_dashboard_mapping(
            self.user_dash1_for_group2,
            self.group2_dash1
        )

        # add group to stack - StackGroup
        StackGroups.objects.create(group=self.group1, stack=stack)
        StackGroups.objects.create(group=self.group2, stack=stack2)

        # widgets
        self.widget1 = WidgetDefinition.objects.create(
            visible=True,
            display_name="widget1",
            image_url_medium="image url medium",
            image_url_small="image url small",
            width=50,
            height=50,
            widget_url="widget url",
            description="widget assigned to user through group, but now removed from group",
            universal_name="widget1.universal.name"
        )

        self.widget2 = WidgetDefinition.objects.create(
            visible=True,
            display_name="widget2",
            image_url_medium="image url medium",
            image_url_small="image url small",
            width=50,
            height=50,
            widget_url="widget url",
            description="this will be a new widget for the user through the group",
            universal_name="widget2.universal.name"
        )

        self.widget3 = WidgetDefinition.objects.create(
            visible=True,
            display_name="widget3",
            image_url_medium="image url medium",
            image_url_small="image url small",
            width=50,
            height=50,
            widget_url="widget url",
            description="this widget will get removed from user, but still have an association through the group",
            universal_name="widget3.universal.name"
        )
        self.widget4 = WidgetDefinition.objects.create(
            visible=True,
            display_name="widget4",
            image_url_medium="image url medium",
            image_url_small="image url small",
            width=50,
            height=50,
            widget_url="widget url",
            description="widget user had direct access to, but now also has one through the group",
            universal_name="widget4.universal.name"
        )

    def test_purge_dashboards_for_group(self):
        group = OwfGroup.objects.filter(name="group1").first()
        self.regular_user.purge_dashboards_for_group(group)

        # check that both group dashboard and mappings didn't get deleted
        self.assertTrue(Dashboard.objects.filter(pk=self.group1_dash1.id).exists())
        self.assertTrue(DomainMapping.objects.filter(pk=self.group1_dash1_domain_mapping.id).exists())
        self.assertTrue(Dashboard.objects.filter(pk=self.group1_dash2.id).exists())
        self.assertTrue(DomainMapping.objects.filter(pk=self.group1_dash2_domain_mapping.id).exists())
        # check that user dashboard and mappings got deleted for both dashboards
        self.assertFalse(Dashboard.objects.filter(pk=self.user_dash1_for_group1.id).exists())
        self.assertFalse(
            DomainMapping.objects.filter(pk=self.user_dash1_for_group_domain_mapping.id).exists()
        )
        self.assertFalse(Dashboard.objects.filter(pk=self.user_dash2_for_group1.id).exists())
        self.assertFalse(
            DomainMapping.objects.filter(pk=self.user_dash2_for_group1_domain_mapping.id).exists()
        )

        # check that none of the other dashboards and mappings were affected
        self.assertTrue(Dashboard.objects.filter(pk=self.group2_dash1.id).exists())
        self.assertTrue(Dashboard.objects.filter(pk=self.user_dash1_for_group2.id).exists())
        self.assertTrue(DomainMapping.objects.filter(pk=self.group2_dash1_domain_mapping.id).exists())
        self.assertTrue(DomainMapping.objects.filter(pk=self.user_dash1_for_group2_domain_mapping.id).exists())

    def test_purge_all_user_dashboards_deletes_all_user_dashboards(self):
        self.regular_user.purge_all_dashboards()

        # check that group dashboard and mappings didn't get deleted
        self.assertTrue(Dashboard.objects.filter(pk=self.group1_dash1.id).exists())
        self.assertTrue(DomainMapping.objects.filter(pk=self.group1_dash1_domain_mapping.id).exists())
        self.assertTrue(Dashboard.objects.filter(pk=self.group1_dash2.id).exists())
        self.assertTrue(DomainMapping.objects.filter(pk=self.group1_dash2_domain_mapping.id).exists())
        self.assertTrue(Dashboard.objects.filter(pk=self.group2_dash1.id).exists())
        self.assertTrue(DomainMapping.objects.filter(pk=self.group2_dash1_domain_mapping.id).exists())
        # check that user dashboard and mappings got deleted
        self.assertFalse(Dashboard.objects.filter(pk=self.user_dash1_for_group1.id).exists())
        self.assertFalse(
            DomainMapping.objects.filter(pk=self.user_dash1_for_group_domain_mapping.id).exists()
        )
        self.assertFalse(Dashboard.objects.filter(pk=self.user_dash2_for_group1.id).exists())
        self.assertFalse(
            DomainMapping.objects.filter(pk=self.user_dash2_for_group1_domain_mapping.id).exists()
        )
        self.assertFalse(Dashboard.objects.filter(pk=self.user_dash1_for_group2.id).exists())
        self.assertFalse(
            DomainMapping.objects.filter(pk=self.user_dash1_for_group2_domain_mapping.id).exists()
        )

    def test_get_stacks_for_user(self):
        stacks = Person.get_directly_assigned_stacks(self.admin_user).count()
        self.assertGreaterEqual(stacks, 2)

    def test_user_sync_widgets(self):
        pwd1 = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=self.widget1,
            user_widget=False,
            group_widget=True
        )
        pwd4 = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=self.widget4,
            user_widget=True
        )

        self.group1.add_widget(self.widget3)
        self.group2.add_widget(self.widget2)
        self.group2.add_widget(self.widget4)

        self.regular_user.sync_widgets()

        self.assertFalse(PersonWidgetDefinition.objects.filter(pk=pwd1.id).exists())
        self.assertTrue(
            PersonWidgetDefinition.objects.filter(
                person=self.regular_user,
                widget_definition=self.widget2,
                user_widget=False,
                group_widget=True
            ).exists()
        )
        self.assertTrue(
            PersonWidgetDefinition.objects.filter(
                person=self.regular_user,
                widget_definition=self.widget3,
                user_widget=False,
                group_widget=True
            ).exists()
        )
        self.assertTrue(
            PersonWidgetDefinition.objects.filter(
                person=self.regular_user,
                widget_definition=self.widget4,
                user_widget=True,
                group_widget=True
            ).exists()
        )

    def test_user_sync_dashboards(self):
        admin_user = Person.objects.get(pk=1)

        # Add admin user to two groups it is not in
        self.group1.add_user(admin_user)
        self.group2.add_user(admin_user)

        # Assign user to stacks via group
        stack1 = Stack.create(self.regular_user, create_stack_payload3)
        stack2 = Stack.create(self.regular_user, create_stack_payload4)
        StackGroups.objects.create(group=self.group1, stack=stack1)
        StackGroups.objects.create(group=self.group1, stack=stack2)

        # Assign user directly to a stack
        stack3 = Stack.create(self.regular_user, create_stack_payload5)
        stack3.default_group.add_user(admin_user)

        user_dashboards = Dashboard.objects.filter(user=admin_user)

        # Two initial dashboard mappings
        user_cloned_dashboards = DomainMapping.objects.filter(
            src_id__in=user_dashboards,
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_type=MappingType.dashboard
         )

        self.assertEqual(user_cloned_dashboards.count(), 2)

        admin_user.refresh_from_db()
        admin_user.sync_dashboards()

        # Confirm 3 new dashboards were cloned
        cloned_dashboard_3 = Dashboard.objects.get(name="test stack 3", user=admin_user)
        cloned_dashboard_4 = Dashboard.objects.get(name="test stack 4", user=admin_user)
        cloned_dashboard_5 = Dashboard.objects.get(name="test stack 5", user=admin_user)

        self.assertTrue(cloned_dashboard_3)
        self.assertTrue(cloned_dashboard_4)
        self.assertTrue(cloned_dashboard_5)

        user_dashboards = Dashboard.objects.filter(user=admin_user)

        # Three dashboard mappings added
        user_cloned_dashboards = DomainMapping.objects.filter(
                src_id__in=user_dashboards,
                src_type=MappingType.dashboard,
                relationship_type=RelationshipType.cloneOf,
                dest_type=MappingType.dashboard
            )

        self.assertEqual(user_cloned_dashboards.count(), 5)

        self.assertTrue(
            DomainMapping.objects.filter(
                src_id=cloned_dashboard_3.id,
                src_type=MappingType.dashboard,
                relationship_type=RelationshipType.cloneOf,
                dest_type=MappingType.dashboard
            ).exists()
        )

        self.assertTrue(
            DomainMapping.objects.filter(
                src_id=cloned_dashboard_4.id,
                src_type=MappingType.dashboard,
                relationship_type=RelationshipType.cloneOf,
                dest_type=MappingType.dashboard
            ).exists()
        )

        self.assertTrue(
            DomainMapping.objects.filter(
                src_id=cloned_dashboard_5.id,
                src_type=MappingType.dashboard,
                relationship_type=RelationshipType.cloneOf,
                dest_type=MappingType.dashboard
            ).exists()
        )

    def test_get_active_widgets_for_user(self):
        user_widget = PersonWidgetDefinition.objects.create(
            person=self.regular_user,
            widget_definition=self.widget1,
            user_widget=True,
            group_widget=False
        )

        # active group
        self.group1.add_widget(self.widget2)

        # inactive group
        self.group3.add_user(self.regular_user)
        self.group3.add_widget(self.widget3)

        self.regular_user.sync_widgets()
        active_widgets = self.regular_user.get_active_widgets()

        self.assertTrue(
            PersonWidgetDefinition.objects.filter(
                person=self.regular_user,
                widget_definition=self.widget1,
                user_widget=True,
                group_widget=False
            ).exists()
        )

        self.assertTrue(
            PersonWidgetDefinition.objects.filter(
                person=self.regular_user,
                widget_definition=self.widget2,
                user_widget=False,
                group_widget=True
            ).exists()
        )

        # Confirm PWD was created for inactive group
        self.assertTrue(
            PersonWidgetDefinition.objects.filter(
                person=self.regular_user,
                widget_definition=self.widget3,
                user_widget=False,
                group_widget=True
            ).exists()
        )

        self.assertTrue(active_widgets.filter(id=self.widget1.id).exists())
        self.assertTrue(active_widgets.filter(id=self.widget2.id).exists())
        # inactive group widget should not be returned
        self.assertFalse(active_widgets.filter(id=self.widget3.id).exists())


class PersonWidgetDefinitionModelTests(TestCase):
    fixtures = ['people_data.json', 'widget_data.json', 'people_widget_data.json']

    def test_create_person_widget_definition(self):
        # create - new item does not exists yet.
        instance = PersonWidgetDefinition.objects.create(**payload)

        self.assertTrue(isinstance(instance, PersonWidgetDefinition))
        self.assertEqual(instance.user_widget, True)

        # create again - this item exists already
        instance2 = PersonWidgetDefinition.objects.create(**payload)

        self.assertTrue(isinstance(instance2, PersonWidgetDefinition))
        self.assertEqual(instance.id, instance2.id)

    def test_delete_should_not_hard_delete(self):
        # create - this item exists already
        payload_existing = {**payload, "person": Person(pk=1)}
        instance = PersonWidgetDefinition.objects.create(**payload_existing)

        instance.delete()

        self.assertTrue(isinstance(instance, PersonWidgetDefinition))
        self.assertEqual(instance.group_widget, True)
        self.assertEqual(instance.user_widget, False)

    def test_delete_should_hard_delete(self):
        payload_existing = {**payload, "person": Person(pk=1)}
        instance = PersonWidgetDefinition.objects.get(**payload_existing)
        instance.group_widget = False
        instance.save()

        _sum, _ = instance.delete()

        self.assertEqual(_sum, 1)
        with self.assertRaises(PersonWidgetDefinition.DoesNotExist):
            PersonWidgetDefinition.objects.get(**payload_existing)
