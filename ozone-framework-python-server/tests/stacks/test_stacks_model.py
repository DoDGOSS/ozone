from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from people.models import Person
from owf_groups.models import OwfGroup
from domain_mappings.models import RelationshipType, DomainMapping
from dashboards.models import Dashboard
from stacks.models import Stack

requests = APIClient()

createStackPayload = {
    'name': 'test stack 1',
    'description': 'test description 1'
}

class StacksModelTests(TestCase):
    fixtures = ['people_data.json']

    def test_user_can_create_stack(self):       
        user = Person.objects.get(pk = 1) # coming from the fixture that creates default users
        createdStackId = Stack.create(user, createStackPayload).id
        
        createdStack = Stack.objects.get(pk = createdStackId)
        
        # check that default group got created and assigned to the stack
        defaultStackGroup = createdStack.default_group
        self.assertIsNotNone(defaultStackGroup)
        self.assertEqual(defaultStackGroup.stack_default, True)
        self.assertEqual(defaultStackGroup.automatic, False)

        # check that the requesting user got added to the default group
        self.assertIsNotNone(defaultStackGroup.people.get(pk = user.id))

        # check that the owner of the stack is the user
        self.assertEqual(createdStack.owner.id, user.id)

        # check that a group dashboard got created
        groupDashboard = Dashboard.objects.get(stack = createdStackId, user = None)
        self.assertIsNotNone(groupDashboard)
        self.assertEqual(groupDashboard.name, createdStack.name)

        # check that a personal dashboard got created
        personalDashboard = Dashboard.objects.get(stack = createdStackId, user = user.id)
        self.assertIsNotNone(personalDashboard)
        self.assertEqual(personalDashboard.name, groupDashboard.name)

        # check that the default group owns dashboard domain mapping get created
        groupDashDomainMapping = DomainMapping.objects.get(
            src_id = defaultStackGroup.id,
            src_type = type(defaultStackGroup).__name__,
            relationship_type = RelationshipType.owns.name,
            dest_id = groupDashboard.id,
            dest_type = type(groupDashboard).__name__
        )
        self.assertIsNotNone(groupDashDomainMapping)

        # check that the personal dash is a cloneOf group dash domain mapping get created
        personalDashDomainMapping = DomainMapping.objects.get(
            src_id = personalDashboard.id, 
            src_type = type(personalDashboard).__name__,
            relationship_type = RelationshipType.cloneOf.name,
            dest_id = groupDashboard.id,
            dest_type = type(groupDashboard).__name__
        )
        self.assertIsNotNone(personalDashDomainMapping)