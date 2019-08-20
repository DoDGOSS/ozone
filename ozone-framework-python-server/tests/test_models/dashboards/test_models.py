from django.test import TestCase
from dashboards.models import Dashboard


class DashboardTest(TestCase):

    def test_dashboard(self):
        instance = Dashboard(name="test dashboard")
        self.assertTrue(isinstance(instance, Dashboard))
        self.assertEqual(instance.__str__(), instance.name)
