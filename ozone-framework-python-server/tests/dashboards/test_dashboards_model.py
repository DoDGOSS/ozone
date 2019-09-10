from django.test import TestCase
from people.models import Person
from domain_mappings.models import DomainMapping
from dashboards.models import Dashboard
from stacks.models import Stack, StackGroups
from owf_groups.models import OwfGroup

create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}

create_stack_payload2 = {
    'name': 'test stack 2',
    'description': 'test description 2'
}


class DashboardsModelTests(TestCase):
    fixtures = ['people_data.json']

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
        self.group1Dash1 = Dashboard.objects.create(name="group1dash1", stack=stack)
        self.userGroup1Dash1 = Dashboard.objects.create(name="usergroup1dash1", user=self.regular_user, stack=stack)
        self.group1Dash1DomainMapping = DomainMapping.create_group_dashboard_mapping(group1, self.group1Dash1)
        self.userGroup1Dash1DomainMapping = DomainMapping.create_user_dashboard_mapping(
            self.userGroup1Dash1,
            self.group1Dash1
        )

        self.group1Dash2 = Dashboard.objects.create(name="group1dash2", stack=stack)
        self.userGroup1Dash2 = Dashboard.objects.create(name="usergroup1dash2", user=self.regular_user, stack=stack)
        self.group1Dash2DomainMapping = DomainMapping.create_group_dashboard_mapping(group1, self.group1Dash2)
        self.userGroup1Dash2DomainMapping = DomainMapping.create_user_dashboard_mapping(
            self.userGroup1Dash2,
            self.group1Dash2
        )

        self.group2Dash1 = Dashboard.objects.create(name="group2dash1", stack=stack2)
        self.userGroup2Dash1 = Dashboard.objects.create(name="usergroup2dash1", user=self.regular_user, stack=stack2)
        self.group2Dash1DomainMapping = DomainMapping.create_group_dashboard_mapping(group2, self.group2Dash1)
        self.userGroup2Dash1DomainMapping = DomainMapping.create_user_dashboard_mapping(
            self.userGroup2Dash1,
            self.group2Dash1
        )

        # add group to stack - StackGroup
        StackGroups.objects.create(group=group1, stack=stack)
        StackGroups.objects.create(group=group2, stack=stack2)

    def test_purge_user_dashboards_for_group_deletes_user_dashboards_for_specified_group(self):
        group = OwfGroup.objects.filter(name="group1").first()
        Dashboard.purge_user_dashboards_for_group(self.regular_user, group)

        # check that both group dashboard and mappings didn't get deleted
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group1Dash1.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group1Dash1DomainMapping.id).first())
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group1Dash2.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group1Dash2DomainMapping.id).first())
        # check that user dashboard and mappings got deleted for both dashboards
        self.assertIsNone(Dashboard.objects.filter(pk=self.userGroup1Dash1.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.userGroup1Dash1DomainMapping.id).first().refresh_from_db()
        )
        self.assertIsNone(Dashboard.objects.filter(pk=self.userGroup1Dash2.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.userGroup1Dash2DomainMapping.id).first().refresh_from_db()
        )

        # check that none of the other dashboards and mappings were affected
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group2Dash1.id).first())
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.userGroup2Dash1.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group2Dash1DomainMapping.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.userGroup2Dash1DomainMapping.id).first())

    def test_purge_all_user_dashboards_deletes_all_user_dashboards(self):
        Dashboard.purge_all_user_dashboards(self.regular_user)
        # check that group dashboard and mappings didn't get deleted
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group1Dash1.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group1Dash1DomainMapping.id).first())
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group1Dash2.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group1Dash2DomainMapping.id).first())
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group2Dash1.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group2Dash1DomainMapping.id).first())
        # check that user dashboard and mappings got deleted
        self.assertIsNone(Dashboard.objects.filter(pk=self.userGroup1Dash1.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.userGroup1Dash1DomainMapping.id).first().refresh_from_db()
        )
        self.assertIsNone(Dashboard.objects.filter(pk=self.userGroup1Dash2.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.userGroup1Dash2DomainMapping.id).first().refresh_from_db()
        )
        self.assertIsNone(Dashboard.objects.filter(pk=self.userGroup2Dash1.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.userGroup2Dash1DomainMapping.id).first().refresh_from_db()
        )
