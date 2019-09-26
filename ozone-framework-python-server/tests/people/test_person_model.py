from django.test import TestCase
from people.models import Person, PersonWidgetDefinition
from domain_mappings.models import DomainMapping
from dashboards.models import Dashboard
from stacks.models import Stack, StackGroups
from owf_groups.models import OwfGroup
from widgets.models import WidgetDefinition

create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}

create_stack_payload2 = {
    'name': 'test stack 2',
    'description': 'test description 2'
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

        # create group
        group1 = OwfGroup.objects.create(name="group1")
        group2 = OwfGroup.objects.create(name="group2")

        # add user to group - GroupPeople
        group1.people.add(self.regular_user)
        group2.people.add(self.regular_user)

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
        self.group1_dash1_domain_mapping = DomainMapping.create_group_dashboard_mapping(group1, self.group1_dash1)
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
        self.group1_dash2_domain_mapping = DomainMapping.create_group_dashboard_mapping(group1, self.group1_dash2)
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
        self.group2_dash1_domain_mapping = DomainMapping.create_group_dashboard_mapping(group2, self.group2_dash1)
        self.user_dash1_for_group2_domain_mapping = DomainMapping.create_user_dashboard_mapping(
            self.user_dash1_for_group2,
            self.group2_dash1
        )

        # add group to stack - StackGroup
        StackGroups.objects.create(group=group1, stack=stack)
        StackGroups.objects.create(group=group2, stack=stack2)

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
