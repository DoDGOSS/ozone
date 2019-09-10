from django.test import TestCase
from people.models import Person
from domain_mappings.models import RelationshipType, MappingType, DomainMapping
from dashboards.models import Dashboard
from stacks.models import Stack


create_stack_payload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}


class StacksModelTests(TestCase):
    fixtures = ['people_data.json']

    def test_user_can_create_stack(self):
        # Regular user
        user = Person.objects.get(pk=2)
        created_stack_id = Stack.create(user, create_stack_payload).id

        created_stack = Stack.objects.get(pk=created_stack_id)
        self.assertTrue(created_stack.stack_context)

        # check that default group got created and assigned to the stack
        default_stack_group = created_stack.default_group
        self.assertIsNotNone(default_stack_group)
        self.assertEqual(default_stack_group.stack_default, True)
        self.assertEqual(default_stack_group.automatic, False)

        # check that the requesting user got added to the default group
        self.assertIsNotNone(default_stack_group.people.get(pk=user.id))

        # check that the owner of the stack is the user
        self.assertEqual(created_stack.owner.id, user.id)

        # check that a group dashboard got created
        group_dashboard = Dashboard.objects.get(stack=created_stack_id, user=None)
        self.assertIsNotNone(group_dashboard)
        self.assertEqual(group_dashboard.name, created_stack.name)

        # check that a personal dashboard got created
        user_dashboard = Dashboard.objects.get(stack=created_stack_id, user=user.id)
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
