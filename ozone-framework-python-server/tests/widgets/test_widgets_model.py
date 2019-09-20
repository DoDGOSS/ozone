import uuid
from django.test import TestCase

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
    "widget_guid": uuid.uuid4,
    "display_name": "Test Widget",
    "background": False,
    "universal_name": "test_widget_x",
    "descriptor_url": "Description for a url",
    "description": "Description...",
    "mobile_ready": False,
}


class WidgetModelTests(TestCase):
    pass
