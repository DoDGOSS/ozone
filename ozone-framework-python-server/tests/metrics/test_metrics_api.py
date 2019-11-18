import json
import httpretty
from django.urls import reverse
from django.conf import settings
from rest_framework.test import APIClient
from django.test import TestCase, override_settings
from people.models import Person

requests = APIClient()


class MetricsApiTests(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    def tearDown(self):
        requests.logout()

    @httpretty.activate
    @override_settings(ENABLE_METRICS=True)
    def test_metrics_enabled(self):
        metrics_data = {
            'metricTime': '',
            'userName': '',
            'userId': '',
            'site': '',
            'userAgent': '',
            'component': '',
            'componentId': '',
            'instanceId': '',
            'metricTypeId': '',
            'widgetData': ''
        }

        httpretty.register_uri(
            httpretty.POST,
            settings.METRICS_SERVER_URL,
            body=json.dumps(metrics_data)
        )

        requests.login(email='user@goss.com', password='password')
        url = reverse('metrics-list')
        response = requests.post(url)

        self.assertEqual(response.status_code, 201)

    def test_metrics_disabled(self):
        requests.login(email='user@goss.com', password='password')
        url = reverse('metrics-list')
        response = requests.post(url)

        self.assertEqual(response.status_code, 405)
