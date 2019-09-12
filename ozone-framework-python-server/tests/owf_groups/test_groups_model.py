from django.test import TestCase
from people.models import Person
from owf_groups.models import OwfGroup, OwfGroupPeople


class GroupModelTests(TestCase):
    fixtures = ['people_data.json', 'groups_data.json']

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
