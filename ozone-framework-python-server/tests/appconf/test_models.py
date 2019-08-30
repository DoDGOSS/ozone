from django.test import TestCase
from appconf.models import ApplicationConfiguration


class AppConfTest(TestCase):

    def test_dashboard(self):
        instance = ApplicationConfiguration(version=1,
                                            created_date="2019-08-29",
                                            edited_date="2019-08-29",
                                            code="owf.enable.cef.logging",
                                            value=False,
                                            title="Enable CEF Logging",
                                            description=None,
                                            group_name="AUDITING",
                                            sub_group_name=None,
                                            mutable=False,
                                            sub_group_order=1,
                                            help="help 2",
                                            created_by=None,
                                            edited_by=None
                                            )
        self.assertTrue(isinstance(instance, ApplicationConfiguration))
        self.assertEqual(instance.__str__(), instance.title)
