import django
from importlib import import_module
from django.conf import settings
from django.contrib.auth import authenticate, backends, get_user_model, login
from django.core.exceptions import ImproperlyConfigured
from django.http import HttpResponseRedirect
from django.shortcuts import resolve_url
from django.utils.deprecation import MiddlewareMixin

User = get_user_model()


class SSLClientAuthBackend(backends.ModelBackend):
    def authenticate(self, request=None):
        _module_name, _function_name = settings.EXTRACT_USERDATA_FN.rsplit('.', 1)
        _module = import_module(_module_name)
        EXTRACT_USERDATA_FN = getattr(_module, _function_name)

        if not request.is_secure():
            return None
        authentication_status = request.META.get(settings.USER_AUTH_STATUS_HEADER, None)
        if (authentication_status != "SUCCESS" or settings.USER_DN_SSL_HEADER not in request.META):
            # HTTP_X_SSL_AUTHENTICATED marked failed or configured SSL USER DN header missing
            return None

        dn = request.META.get(settings.USER_DN_SSL_HEADER)
        user_data = EXTRACT_USERDATA_FN(dn)

        try:
            user = User.objects.get(username=user_data['username'])
        except User.DoesNotExist:
            if settings.AUTOCREATE_VALID_SSL_USERS:
                user = User(**user_data)
                user.save()
            else:
                return None
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


class SSLClientAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not hasattr(request, 'user'):
            raise ImproperlyConfigured()
        if request.user.is_authenticated:
            return
        user = authenticate(request=request)
        if user is None or not user.is_authenticated:
            return
        login(request, user)
