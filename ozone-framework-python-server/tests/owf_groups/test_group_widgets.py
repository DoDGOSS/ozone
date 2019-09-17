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

    group_id = 2

    def test_get_group_widgets(self):
        requests.login(email='admin@goss.com', password='password')
        url = f'/api/v2/group-widgets/?group_id={self.group_id}'
        get_group_widgets = requests.get(url)
        domain_data = DomainMapping.objects.filter(
            relationship_type=RelationshipType.owns,
            src_type=MappingType.group, src_id=self.group_id,
            dest_type=MappingType.widget
        )
        count_widgets = get_group_widgets.data['widgets']
        self.assertEqual(domain_data.count(), len(count_widgets))
        requests.logout()
