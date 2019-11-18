from django.apps import AppConfig


class AppconfConfig(AppConfig):
    name = 'appconf'

    def ready(self):
        import appconf.handlers
