from django.core.management.base import BaseCommand
from django.forms import model_to_dict
from django.utils import timezone
from datetime import timedelta, datetime

from appconf.models import ApplicationConfiguration
from people.models import Person
import logging

logger = logging.getLogger('owf.enable.cef.logging')


class Command(BaseCommand):
    help = "Cleans inactive users."

    def handle(self, *args, **options):
        disable_inactive = ApplicationConfiguration.objects.get(code='owf.disable.inactive.accounts').value
        inactivity_threshold = ApplicationConfiguration.objects.get(code='owf.inactivity.threshold').value
        if disable_inactive == 'true':
            min_dt = timezone.now() - timedelta(days=int(inactivity_threshold))
            people = Person.objects.filter(last_login__lte=min_dt)
            for person in people:
                # print('Clean > Person >', person.pk)
                cef_control = ApplicationConfiguration.objects.get(
                    title='Enable CEF Logging', group_name='AUDITING',
                    code='owf.enable.cef.logging').value
                if (cef_control.startswith('t')) or (cef_control.startswith('T')):
                    sec_level = ApplicationConfiguration.objects.get(title='Security Level',
                                                                     code='owf.security.level').value
                    if sec_level.startswith('D') or sec_level.startswith('d'):
                        logger.debug(
                            f'Clean > Person > {person.pk}'
                        )  # Add A verbose log message to the DEBUG logging
                    elif sec_level.startswith('I') or sec_level.startswith('i'):
                        logger.info(
                            f'Clean > Person > {person.pk}'
                        )  # Add a simple log message for the INFO logging
                Person.objects.get(pk=person.pk).delete()

                # re-create person.
                person_object = model_to_dict(person, exclude=('id',))
                person_object['is_active'] = False
                for k, v in person_object.items():
                    if isinstance(v, datetime):
                        person_object[k] = None
                Person.objects.create(**person_object)
