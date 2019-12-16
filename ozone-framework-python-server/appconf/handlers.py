from appconf.models import ApplicationConfiguration
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver
import logging
from django.conf import settings
from config.owf_utils.log_middleware import session_expired

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
    if (obj_access_control.startswith('t')) or (obj_access_control.startswith('T')):
        sec_level = ApplicationConfiguration.objects.get(title='Security Level',
                                                         code='owf.security.level').value
        if sec_level.startswith('D') or sec_level.startswith('d'):
            logger.debug(f'IP: {get_client_ip(request)} User: {request.user.username} [USER LOGIN]: LOGIN SUCCESS - '
                         f'ACCESS GRANTED USER [{request.user.username}] with EMAIL [{request.user.email}]')
        elif sec_level.startswith('I') or sec_level.startswith('i'):
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
    if (obj_access_control.startswith('t')) or (obj_access_control.startswith('T')):
        sec_level = ApplicationConfiguration.objects.get(title='Security Level',
                                                         code='owf.security.level').value
        if sec_level.startswith('D') or sec_level.startswith('d'):
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
        elif sec_level.startswith('I') or sec_level.startswith('i'):
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
    if (obj_access_control.startswith('t')) or (obj_access_control.startswith('T')):
        sec_level = ApplicationConfiguration.objects.get(title='Security Level',
                                                         code='owf.security.level').value
        if sec_level.startswith('D') or sec_level.startswith('d'):
            return logger.debug(f'IP: {get_client_ip(request)} '
                                f'USER: {credentials["username"]}'
                                f' [USER LOGIN]: ACCESS DENIED with FAILURE MSG: [Login for {credentials["username"]} '
                                f'attempted with authenticated credentials')
        elif sec_level.startswith('I') or sec_level.startswith('i'):
            return logger.info(f'IP: {get_client_ip(request)} '
                               f'USER: {credentials["username"]}'
                               f'[USER LOGIN]: ACCESS DENIED with FAILURE MSG: [Login for {credentials["username"]}] '
                               f'attempted with authenticated credentials')
    else:
        pass


@receiver(session_expired)
def on_done(sender, user, request, **kwargs):
    obj_access_control = ApplicationConfiguration.objects.get(title='Enable CEF Object Access Logging',
                                                              group_name='AUDITING',
                                                              code='owf.enable.cef.object.access.logging').value
    if (obj_access_control.startswith('t')) or (obj_access_control.startswith('T')):
        sec_level = ApplicationConfiguration.objects.get(title='Security Level',
                                                         code='owf.security.level').value
        if sec_level.startswith('D') or sec_level.startswith('d'):
            return logger.debug(f'IP: {get_client_ip(request)} '
                                f'SessionID: {request.session.session_key} '
                                f'USER: {user.username} [USER SESSION TIMEOUT], '
                                f'with ID [{user.id}], with EMAIL [{user.email}], '
                                f'with LAST LOGIN DATE [{user.last_login}] '
                                )
        elif sec_level.startswith('I') or sec_level.startswith('i'):
            return logger.info(f'IP: {get_client_ip(request)} '
                               f'SessionID: {request.session.session_key} '
                               f'USER: {user.username} [USER SESSION TIMEOUT]'
                               )
    else:
        pass
