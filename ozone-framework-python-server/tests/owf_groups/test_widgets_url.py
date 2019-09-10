from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()

payload = {
    "version": 1,
    "visible": True,
    "image_url_medium": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "image_url_small": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "singleton": False,
    "width": 200,
    "widget_version": "1",
    "height": 200,
    "widget_url": "https://emoji.slack-edge.com/T045BEDPN/fistbump/7592b191dc43cce2.gif",
    "widget_guid": "25c85af7-6a2d-45c4-bbd5-5a58abd9e5e3TEST",
    "display_name": "Test Widget 2",
    "background": False,
    "universal_name": "test_widget2",
    "descriptor_url": "Description for url",
    "description": "Description",
    "mobile_ready": False
}


class TestingWidgets(TestCase):
    fixtures = ['people_data.json', 'widget_data.json']

    def test_access_groups(self):
        requests.login(email='admin@goss.com', password='password')
        url = reverse('widgets-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 200)
        requests.logout()
        requests.login(email='user@goss.com', password='password')
        url = reverse('widgets-list')
        data = requests.get(url)
        self.assertEqual(data.status_code, 403)
        requests.logout()

    def test_widgets_url(self):
        # Add / Post new group || 2
        requests.login(email='admin@goss.com', password='password')
        url_list = reverse('widgets-list')
        response_post = requests.post(url_list, payload)
        self.assertEqual(response_post.status_code, 201)
        # Get all of the groups & check update
        response = requests.get(url_list)
        self.assertEqual(response.data['count'], 2)
        # Get detail of new post
        url_detail = reverse('widgets-detail', args='2')
        response_detail = requests.get(url_detail)
        self.assertEqual(response_detail.data['id'], 2)
        # edit the new post || 2
        post_update_data = response_detail.data
        post_update_data['display_name'] = 'Test Widget 2 update'
        response_update = requests.put(url_detail, data=post_update_data)
        self.assertEqual(response_update.status_code, 200)
        response_detail_2 = requests.get(url_detail)
        self.assertEqual(response_detail_2.data['id'], 2)
        self.assertEqual(response_detail_2.data['display_name'], 'Test Widget 2 update')
        # delete the new post || 2
        del_data = requests.delete(url_detail)
        self.assertEqual(del_data.status_code, 204)
        response_2 = requests.get(url_list)
        self.assertEqual(response_2.data['count'], 1)
        requests.logout()
