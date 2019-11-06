import importlib
from typing import Any

import django.conf
from django.utils.functional import SimpleLazyObject

DEFAULTS = {
    'JSON_MODULE': 'json',
    'TRANSFORM_CASES_IN_OUTPUT': True,
    'TRANSFORM_CASES_IN_INPUT': True,
    'TRANSFORM_CASES_IN_HTTP_METHODS': ['GET', 'POST']
}

IMPORT_MODULES = ['JSON_MODULE']

__all__ = ['OwfCaseTransformerSettings', 'owf_case_transformer_settings', 'django_settings']


class OwfCaseTransformerSettings:
    def __init__(self, settings: dict = None, defaults: dict = None) -> None:
        self._defaults = (defaults or DEFAULTS).copy()
        self._settings = {**self._defaults, **settings.copy()}

    def __getattr__(self, attr: str) -> Any:
        if attr not in self._defaults:
            raise AttributeError(f'Unknown setting: {attr!r}')

        if attr in IMPORT_MODULES:
            value = SimpleLazyObject(
                lambda: importlib.import_module(self._settings[attr])
            )
        else:
            value = self._settings[attr]

        setattr(self, attr, value)
        return value

    @property
    def has_convert_key(self) -> bool:
        return any([self.HEADER_KEY, self.QUERY_KEY, self.BODY_KEY])


def owf_case_transformer_settings(settings: Any) -> OwfCaseTransformerSettings:
    return OwfCaseTransformerSettings(
        settings=getattr(settings, 'OWF_CASE_TRANSFORMER_SETTINGS', {}),
        defaults=DEFAULTS,
    )


django_settings = SimpleLazyObject(
    lambda: owf_case_transformer_settings(django.conf.settings)
)
