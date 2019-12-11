# settings/production.py

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# You must
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/'
STATICFILES_DIRS = []


MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = ('rest_framework.renderers.JSONRenderer',)

# REST CORS CONFIGURATION
# ------------------------------------------------------------------------------
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_REGEX_WHITELIST = [
    r"^http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+$",
]
CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': '/',  # must end with slash
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
        'TIMEOUT': None,
        'IGNORE': [r'.+\.hot-update.js', r'.+\.map']
    }
}
