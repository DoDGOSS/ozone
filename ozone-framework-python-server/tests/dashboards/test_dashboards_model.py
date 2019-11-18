from django.test import TestCase
from dashboards.models import Dashboard


class DashboardModelTests(TestCase):
    fixtures = [
        'resources/fixtures/default_data.json',
        'tests/dashboards/fixtures/default_test_dashboards.json',
    ]

    def test_restore_dashboard(self):
        default_dashboard = Dashboard.objects.get(pk=100)
        dashboard_to_restore = Dashboard.objects.get(pk=101)
        dashboard_to_restore.restore()
        dashboard_to_restore.refresh_from_db()

        self.assertEqual(default_dashboard.name, dashboard_to_restore.name)
        self.assertEqual(default_dashboard.description, dashboard_to_restore.description)
        self.assertEqual(default_dashboard.icon_image_url, dashboard_to_restore.icon_image_url)
        self.assertEqual(default_dashboard.type, dashboard_to_restore.type)
        self.assertEqual(default_dashboard.locked, dashboard_to_restore.locked)
        self.assertEqual(default_dashboard.marked_for_deletion, dashboard_to_restore.marked_for_deletion)
        self.assertEqual(default_dashboard.layout_config, dashboard_to_restore.layout_config)
