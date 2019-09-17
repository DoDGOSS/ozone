from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from domain_mappings.models import DomainMapping, RelationshipType, MappingType

requests = APIClient()

add_widget_to_group_payload = {
    "group_id": 1,
    "widget_id": 1,
}


class GroupWidgetApiTests(TestCase):
    fixtures = ['people_data.json', 'groups_data.json', 'domain_mapping_data.json', 'widget_data.json']

    def test_get_group_widgets(self):
        group_id = 2
        requests.login(email='admin@goss.com', password='password')
        url = f'/api/v2/group-widgets/?group_id={group_id}'
        response = requests.get(url)

        domain_data = DomainMapping.objects.filter(
            relationship_type=RelationshipType.owns,
            src_type=MappingType.group, src_id=group_id,
            dest_type=MappingType.widget
        )
        count_widgets = response.data['widgets']

        self.assertEqual(domain_data.count(), len(count_widgets))
        requests.logout()

    def test_add_widget_to_group(self):
        requests.login(email='admin@goss.com', password='password')

        url = reverse('group_widgets')
        response = requests.post(url, add_widget_to_group_payload)

        self.assertEqual(response.status_code, 201)
        requests.logout()

    def test_remove_widget_from_group(self):
        requests.login(email='admin@goss.com', password='password')

        url = reverse('group_widgets')
        response = requests.delete(url, add_widget_to_group_payload)

        self.assertEqual(response.status_code, 204)
        requests.logout()
