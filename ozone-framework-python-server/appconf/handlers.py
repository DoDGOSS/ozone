from appconf.models import ApplicationConfiguration
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver
import logging
from django.conf import settings

logger = logging.getLogger('owf.enable.cef.object.access.logging')


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return str(ip)


@receiver(user_logged_in)
def on_login(sender, user, request, **kwargs):
    obj_access_control = ApplicationConfiguration.objects.get(title='Enable CEF Object Access Logging',
                                                              group_name='AUDITING',
                                                              code='owf.enable.cef.object.access.logging').value
    if (obj_access_control == 'true') or (obj_access_control == 'True'):
        if settings.LOGGER_INFORMATION == 'DEBUG':
            logger.debug(f'IP: {get_client_ip(request)} User: {request.user.username} [USER LOGIN]: LOGIN SUCCESS - '
                         f'ACCESS GRANTED USER [{request.user.username}] with EMAIL [{request.user.email}]')
        else:
            logger.info(f'IP: {get_client_ip(request)} User: {request.user.username} [USER LOGIN]: LOGIN SUCCESS - '
                        f'ACCESS GRANTED USER [{request.user.username}] with EMAIL [{request.user.email}] ')
    else:
        pass


# TODO: SESSION EXPIRE TAG
@receiver(user_logged_out)
def on_logout(sender, user, request, **kwargs):
    obj_access_control = ApplicationConfiguration.objects.get(title='Enable CEF Object Access Logging',
                                                              group_name='AUDITING',
                                                              code='owf.enable.cef.object.access.logging').value
    if (obj_access_control == 'true') or (obj_access_control == 'True'):
        if settings.LOGGER_INFORMATION == 'DEBUG':
            try:
                return logger.debug(
                    f'IP: {get_client_ip(request)} '
                    f'SessionID: {request.session.session_key} '
                    f'USER: {request.user.username} '
                    f'[USER LOGOUT] with EMAIL {user.email} with LAST LOGIN DATE [ {user.last_login} ]'
                )
            except SystemError:
                return logger.debug(
                    f'[USER LOGOUT]'
                )
        else:
            return logger.info(
                               f'IP: {get_client_ip(request)} SessionID: {request.session.session_key} '
                               f'USER: {request.user.username} '
                               f'[USER LOGOUT]'
                               )
    else:
        pass


@receiver(user_login_failed)
def on_login_failed(sender, credentials, request, **kwargs):
    obj_access_control = ApplicationConfiguration.objects.get(title='Enable CEF Object Access Logging',
                                                              group_name='AUDITING',
                                                              code='owf.enable.cef.object.access.logging').value
    if (obj_access_control == 'true') or (obj_access_control == 'True'):
        if settings.LOGGER_INFORMATION == 'DEBUG':
            return logger.debug(f' {settings.LOGGER_INFORMATION} IP: {get_client_ip(request)} '
                                f'USER: {credentials["username"]}'
                                f' [USER LOGIN]: ACCESS DENIED with FAILURE MSG: [Login for {credentials["username"]} '
                                f'attempted with authenticated credentials')
        else:
            return logger.info(f' {settings.LOGGER_INFORMATION} IP: {get_client_ip(request)} '
                               f'USER: {credentials["username"]}'
                               f'[USER LOGIN]: ACCESS DENIED with FAILURE MSG: [Login for {credentials["username"]} '
                               f'attempted with authenticated credentials')
    else:
        pass
