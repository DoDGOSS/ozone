from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

requests = APIClient()


class TestingApplicationConfigAPI(TestCase):
    fixtures = [
        'tests/people/fixtures/people_data.json',
        'tests/widgets/fixtures/widget_data.json',
        'tests/appconf/fixtures/appconf_data.json',
    ]

    def test_requests_post_params_from_camelCase_to_snake_case(self):
        requests.login(email='admin@goss.com', password='password')

        url = reverse('stacks-list')
        payload = {
            "name": "Testing 123",
            "description": "A nice description",
            "imageUrl": "imageUrl",
            "descriptorUrl": "descriptorUrl",
        }
        headers = {'Content-type': 'application/json', 'Accept': 'application/json'}
        response = requests.post(url, data=payload, headers=headers)

        json_data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn('imageUrl', json_data)
        self.assertIn('descriptorUrl', json_data)
        self.assertNotIn('image_url', json_data)
        self.assertNotIn('descriptor_url', json_data)
        self.assertEqual(json_data['imageUrl'], 'imageUrl')
        self.assertEqual(json_data['descriptorUrl'], 'descriptorUrl')

        requests.logout()
