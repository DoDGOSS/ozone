from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from domain_mappings.models import DomainMapping, RelationshipType, MappingType

requests = APIClient()


class TestingGroupsWidgets(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]
    widget_id = 1

    def test_get_group_widgets(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('admin_groups-widgets')
        filter_url = f'{url}?widget_id={self.widget_id}'

        get_group_widgets = requests.get(filter_url)
        domain_data = DomainMapping.objects.filter(
                    relationship_type=RelationshipType.owns,
                    src_type=MappingType.group,
                    dest_type=MappingType.widget,
                    dest_id=self.widget_id
                )
        count_groups = get_group_widgets.data['groups']

        self.assertEqual(domain_data.count(), len(count_groups))

        requests.logout()
