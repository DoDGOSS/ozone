# settings/production.py

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

STATIC_URL = '/'


ROOT_DIR = os.path.dirname(os.path.dirname(BASE_DIR))
CLIENT_DIR = os.path.join(ROOT_DIR, 'ozone-framework-client', 'packages', 'application', 'build')

STATICFILES_DIRS = [CLIENT_DIR, HELP_FILES]

MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = ('rest_framework.renderers.JSONRenderer',)

DATABASES = {
    'default': {
        'ENGINE': os.getenv('OWF_DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.getenv('OWF_DB_NAME', 'postgres'),
        'USER': os.getenv('OWF_DB_USER', 'postgres'),
        'PASSWORD': os.getenv('OWF_DB_PASSWORD', 'postgres'),
        'HOST': os.getenv('OWF_DB_HOST', 'localhost'),
        'PORT': os.getenv('OWF_DB_PORT', '5432'),
        # Wraps each web request in a transaction. So if anything fails, it will rollback automatically.
        'ATOMIC_REQUESTS': True,
    }
}

TEMPLATES[0]['DIRS'] = [os.path.join(BASE_DIR, 'templates'), 'templates', STATIC_ROOT]
