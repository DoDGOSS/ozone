from rest_framework.response import Response
from rest_framework import status
from rest_framework import exceptions


class MultiSerializerMixin(object):
    def get_serializer_class(self, action=None):
        """
        Look for serializer class in self.serializer_action_classes, which
        should be a dict mapping action name (key) to serializer class (value),
        i.e.:

        class MyViewSet(MultiSerializerViewSetMixin, ViewSet):
            serializer_class = MyDefaultSerializer
            serializer_action_classes = {
               'list': MyListSerializer,
               'my_action': MyActionSerializer,
            }

            @action
            def my_action:
                ...

        If there's no entry for that action then just fallback to the regular
        get_serializer_class lookup: self.serializer_class, DefaultSerializer.

        """

        # action = action or self.action
        #
        # # stupid browser bug, api works fine without it :/
        # # only problem comes when retrieve and update are together.
        # # the problem only occurred in browser, api requests were fine.
        # if not hasattr(self, 'last_action'):
        #     self.last_action = action
        # else:
        #     action = self.last_action

        try:
            return self.serializer_classes[action]
        except (KeyError, AttributeError):
            return super(MultiSerializerMixin, self).get_serializer_class()


class BulkDestroyModelMixin(object):
    """
    Bulk Destroy model instances.
    Param: id
    id: [1,2,3,4]
    """

    def allow_bulk_destroy(self, *args, **kwargs):
        """
        Ensure that the bulk destroy should be allowed.
        Override if needed.
        """
        return True

    def bulk_destroy(self, request, *args, **kwargs):
        qs = self.get_queryset().filter(**kwargs)
        if qs.count() > 0 and self.allow_bulk_destroy(*args, **kwargs):
            self.perform_bulk_destroy(qs)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def perform_bulk_destroy(self, objects):
        for obj in objects:
            # ignore exception and try to delete all we can.
            try:
                # May raise a permission denied
                self.check_object_permissions(self.request, obj)
                self.perform_destroy(obj)
            except exceptions.APIException:
                continue

    def perform_destroy(self, instance):
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        try:
            filters = {}
            # delete if we have a list of ids.
            id_list = request.data and request.data.getlist('id')
            if id_list:
                filters.update({
                    # use map and int to validate and assure its an int.
                    # 'id__in': list(map(int, id_list.split(',')))
                    'id__in': list(map(int, id_list))
                })
            return self.bulk_destroy(request, **filters)
        except (ValueError,):
            return Response(status=status.HTTP_400_BAD_REQUEST)
