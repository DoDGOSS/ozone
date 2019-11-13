from django.contrib.auth.signals import user_logged_in
from people.models import PersonSession
from django.contrib.sessions.models import Session
from appconf.models import ApplicationConfiguration


def user_logged_in_handler(sender, request, user, **kwargs):
    PersonSession.objects.get_or_create(
        person=user,
        session_id=request.session.session_key
    )
    expired_sessions = PersonSession.objects.get_user_expired_sessions(user=user)
    Session.objects.filter(session_key__in=expired_sessions).delete()
    session_control = ApplicationConfiguration.objects.get(code='owf.session.control.enabled').value
    if session_control.startswith('t') or session_control.startswith('T'):
        records = PersonSession.objects.get_user_sessions(user=user)
        num_sessions = ApplicationConfiguration.objects.get(code='owf.session.control.max.concurrent').value
        if len(records) > int(num_sessions):
            num_to_remove = int(len(records) - int(num_sessions))
            records_to_remove = records[:int(num_to_remove)]
            Session.objects.filter(session_key__in=records_to_remove).delete()


user_logged_in.connect(user_logged_in_handler)
