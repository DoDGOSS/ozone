from django.http import HttpRequest, HttpResponse, QueryDict
from django.utils.deprecation import MiddlewareMixin

from .settings import django_settings, OwfCaseTransformerSettings
from .utils import json, json_loads, is_json_possible, is_json_content, nested_snake_case_transformer, \
    nested_camel_case_transformer, swap_data_keys

__all__ = [
    'TransformCaseInputMixin',
    'TransformCaseOutputMixin',
    'OwfCaseTransformerMiddleware',
    'owf_transform_cases_middleware_class',
]


class TransformCaseInputMixin:
    @staticmethod
    def params_to_snake_case(request: HttpRequest, method: str):
        """
        Convert GET or POST params to snake_case
        :param request:
        :param method:
        :return:
        """
        request_method = getattr(request, method)
        request_method._mutable = True
        request_params_dict = nested_snake_case_transformer(request_method.dict())
        request_params = QueryDict('', mutable=True)
        request_params.update(request_params_dict)
        request_params._mutable = False
        setattr(request, method, request_params)

    @staticmethod
    def process_request(request: HttpRequest):
        if is_json_possible(request):
            try:
                json_body = json_loads(request)
                request.json = nested_snake_case_transformer(json_body)
                request._body = json.dumps(request.json).encode('utf-8')
            except ValueError:
                pass

        http_methods = django_settings.TRANSFORM_CASES_IN_HTTP_METHODS
        if isinstance(http_methods, (list, tuple)):
            for http_method in http_methods:
                assert http_method in ['GET', 'POST'], 'HTTP METHOD NOT ALLOWED'
                TransformCaseInputMixin.params_to_snake_case(request, http_method.upper())


class TransformCaseOutputMixin:
    @staticmethod
    def process_response(
            request: HttpRequest,
            response: HttpResponse,
    ) -> HttpResponse:
        if is_json_content(response):
            try:
                json_content = json.loads(response.content)
                converted = nested_camel_case_transformer(json_content)
                converted = swap_data_keys(converted)
                response.content = json.dumps(converted)
            except ValueError:
                pass

        return response


def owf_transform_cases_middleware_class(settings: OwfCaseTransformerSettings) -> MiddlewareMixin:
    bases = [MiddlewareMixin]

    if settings.TRANSFORM_CASES_IN_OUTPUT:
        bases.append(TransformCaseOutputMixin)

    if settings.TRANSFORM_CASES_IN_INPUT:
        bases.append(TransformCaseInputMixin)

    return type('OwfCaseTransformerMiddleware', tuple(bases), {})


OwfCaseTransformerMiddleware = owf_transform_cases_middleware_class(django_settings)
