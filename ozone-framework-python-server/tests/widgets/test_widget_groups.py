from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from widgets.models import WidgetDefinition
from owf_groups.models import OwfGroup
from domain_mappings.models import DomainMapping, RelationshipType, MappingType

requests = APIClient()

payload = {
     # Not used yet
}


class TestingGroupsWidgets(TestCase):
    fixtures = ['people_data.json', 'groups_data.json', 'domain_mapping_data.json', 'widget_data.json']

    widget_id = 1

    def test_get_group_widgets(self):
        requests.login(email='admin@goss.com', password='password')
        url = f'/api/v2/group-widgets/?widget_id={self.widget_id}'
        get_group_widgets = requests.get(url)
        domain_data = DomainMapping.objects.filter(
                    relationship_type=RelationshipType.owns,
                    src_type=MappingType.group,
                    dest_type=MappingType.widget,
                    dest_id=self.widget_id
                )
        count_groups = get_group_widgets.data['groups']
        self.assertEqual(domain_data.count(), len(count_groups))
        requests.logout()
