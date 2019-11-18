from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from widgets.models import WidgetType

requests = APIClient()

payload = {
     # Not used yet
}


class TestingWidgetType(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    url_list = reverse('widget-types-list')

    def test_access_widget_type_url(self):
        requests.login(email='admin@goss.com', password='password')
        data = requests.get(self.url_list)
        self.assertEqual(data.status_code, 200)
        requests.logout()
        requests.login(email='user@goss.com', password='password')
        data = requests.get(self.url_list)
        self.assertEqual(data.status_code, 403)
        requests.logout()

    def test_operation_widget_list(self):
        # Request list Widget Type and DB continuity.
        db_count = WidgetType.objects.count()
        requests.login(email='admin@goss.com', password='password')
        all_request_count = requests.get(self.url_list)
        request_count = all_request_count.data['count']
        self.assertEqual(db_count, request_count)

        # request details widget type request and DB details widget type continuity
        db_details = WidgetType.objects.get(id=2)
        url_details = reverse('widget-types-detail', args='2')
        widget_type_obj = requests.get(url_details)
        self.assertEqual(db_details.display_name, widget_type_obj.data['display_name'])
        self.assertEqual(db_details.name, widget_type_obj.data['name'])
        self.assertEqual(db_details.id, widget_type_obj.data['id'])
