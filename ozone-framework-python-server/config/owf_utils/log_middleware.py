from django.utils.deprecation import MiddlewareMixin
import logging
from django.conf import settings
from appconf.models import ApplicationConfiguration
from django.urls import resolve

stdoutLogger = logging.getLogger('owf.enable.cef.logging')


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return str(ip)


def check_key(dictionary, key):
    copy_dict = dictionary.copy()
    if key in copy_dict.keys():
        copy_dict.pop(key)
        return copy_dict
    else:
        return copy_dict


class LogMiddleware(MiddlewareMixin):

    def process_request(self, request):
        pass

    def process_view(self, request, callback, callback_args, callback_kwargs):
        pass

    def process_response(self, request, response):
        cef_control = ApplicationConfiguration.objects.get(title='Enable CEF Logging', group_name='AUDITING',
                                                           code='owf.enable.cef.logging').value
        if (cef_control.startswith('t')) or (cef_control.startswith('T')):
            sec_level = ApplicationConfiguration.objects.get(title='Security Level',
                                                             code='owf.security.level').value
            log_message = f'suid={request.user.username} requestMethod=USER_INITIATED|{request.method} ' \
                          f'outcome={response.status_code} data={check_key(request.POST, "password")} ' \
                          f'urlName={resolve(request.path_info).url_name} ' \
                          f'requestType={request}'
            if sec_level.startswith('D') or sec_level.startswith('d'):
                stdoutLogger.debug(log_message)
            elif sec_level.startswith('I') or sec_level.startswith('i'):
                stdoutLogger.info(log_message)
            return response
        else:
            return response
