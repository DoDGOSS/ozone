from django.test import TestCase
from people.models import Person
from domain_mappings.models import RelationshipType, MappingType, DomainMapping
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
        group1.add_user(self.regular_user)
        group2.add_user(self.regular_user)

        # create stack
        self.stack = Stack.create(self.admin_user, create_stack_payload)
        self.stack2 = Stack.create(self.admin_user, create_stack_payload2)

        # create 2 dashboards under the stack and their domain mappings
        # TODO: refactor to use a function to create and add a dashboard to a stack, when function becomes available
        self.group1_dash1 = Dashboard.objects.create(name="group1_dash1", stack=self.stack)
        self.usergroup1_dash1 = Dashboard.objects.create(
            name="usergroup1_dash1", user=self.regular_user, stack=self.stack
        )
        self.group1_dash1_domain_mapping = DomainMapping.create_group_dashboard_mapping(group1, self.group1_dash1)
        self.usergroup1_dash1_domain_mapping = DomainMapping.create_user_dashboard_mapping(
            self.usergroup1_dash1,
            self.group1_dash1
        )

        self.group1_dash2 = Dashboard.objects.create(name="group1_dash2", stack=self.stack)
        self.usergroup1_dash2 = Dashboard.objects.create(
            name="usergroup1_dash2", user=self.regular_user, stack=self.stack
        )
        self.group1_dash2_domain_mapping = DomainMapping.create_group_dashboard_mapping(group1, self.group1_dash2)
        self.usergroup1_dash2_domain_mapping = DomainMapping.create_user_dashboard_mapping(
            self.usergroup1_dash2,
            self.group1_dash2
        )

        self.group2_dash1 = Dashboard.objects.create(name="group2_dash1", stack=self.stack2)
        self.usergroup2_dash1 = Dashboard.objects.create(
            name="usergroup2_dash1", user=self.regular_user, stack=self.stack2
        )
        self.group2_dash1_domain_mapping = DomainMapping.create_group_dashboard_mapping(group2, self.group2_dash1)
        self.usergroup2_dash1_domain_mapping = DomainMapping.create_user_dashboard_mapping(
            self.usergroup2_dash1,
            self.group2_dash1
        )

        # add group to stack - StackGroup
        StackGroups.objects.create(group=group1, stack=self.stack)
        StackGroups.objects.create(group=group2, stack=self.stack2)

    def test_purge_user_dashboards_for_group_deletes_user_dashboards_for_specified_group(self):
        group = OwfGroup.objects.filter(name="group1").first()
        Dashboard.purge_user_dashboards_for_group(self.regular_user, group)

        # check that both group dashboard and mappings didn't get deleted
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group1_dash1.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group1_dash1_domain_mapping.id).first())
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group1_dash2.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group1_dash2_domain_mapping.id).first())
        # check that user dashboard and mappings got deleted for both dashboards
        self.assertIsNone(Dashboard.objects.filter(pk=self.usergroup1_dash1.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.usergroup1_dash1_domain_mapping.id).first().refresh_from_db()
        )
        self.assertIsNone(Dashboard.objects.filter(pk=self.usergroup1_dash2.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.usergroup1_dash2_domain_mapping.id).first().refresh_from_db()
        )

        # check that none of the other dashboards and mappings were affected
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group2_dash1.id).first())
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.usergroup2_dash1.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group2_dash1_domain_mapping.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.usergroup2_dash1_domain_mapping.id).first())

    def test_purge_all_user_dashboards_deletes_all_user_dashboards(self):
        Dashboard.purge_all_user_dashboards(self.regular_user)
        # check that group dashboard and mappings didn't get deleted
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group1_dash1.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group1_dash1_domain_mapping.id).first())
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group1_dash2.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group1_dash2_domain_mapping.id).first())
        self.assertIsNotNone(Dashboard.objects.filter(pk=self.group2_dash1.id).first())
        self.assertIsNotNone(DomainMapping.objects.filter(pk=self.group2_dash1_domain_mapping.id).first())
        # check that user dashboard and mappings got deleted
        self.assertIsNone(Dashboard.objects.filter(pk=self.usergroup1_dash1.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.usergroup1_dash1_domain_mapping.id).first().refresh_from_db()
        )
        self.assertIsNone(Dashboard.objects.filter(pk=self.usergroup1_dash2.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.usergroup1_dash2_domain_mapping.id).first().refresh_from_db()
        )
        self.assertIsNone(Dashboard.objects.filter(pk=self.usergroup2_dash1.id).first())
        self.assertIsNone(
            DomainMapping.objects.filter(pk=self.usergroup2_dash1_domain_mapping.id).first().refresh_from_db()
        )

    def test_add_new_dashboard_to_stack(self):
        create_dashboard_params = {
            'name': 'test dash 2',
            'description': 'test description',
            'locked': True,
            'type': '',
            'layout_config': ''
        }
        stack = Stack.objects.get(pk=self.stack2.id)
        stack.add_dashboard(self.regular_user, create_dashboard_params)

        group_dashboard = Dashboard.objects.get(stack=stack, name=create_dashboard_params['name'], user=None)
        self.assertIsNotNone(group_dashboard)

        group_dashboard_domain_mapping = DomainMapping.objects.get(
            src_id=stack.default_group.id,
            src_type=MappingType.group,
            relationship_type=RelationshipType.owns,
            dest_id=group_dashboard.id,
            dest_type=MappingType.dashboard
        )
        self.assertIsNotNone(group_dashboard_domain_mapping)

        user_dashboard = Dashboard.objects.get(
            stack=stack, name=create_dashboard_params['name'], user=self.regular_user
        )
        self.assertIsNotNone(user_dashboard)

        userDashboardDomainMapping = DomainMapping.objects.get(
            src_id=user_dashboard.id,
            src_type=MappingType.dashboard,
            relationship_type=RelationshipType.cloneOf,
            dest_id=group_dashboard.id,
            dest_type=MappingType.dashboard
        )
        self.assertIsNotNone(userDashboardDomainMapping)
