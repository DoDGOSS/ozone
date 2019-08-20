####################################
Authentications & Permissions
####################################

The examples are ways to create custom permissions for use in Django Views.

The following is an example of a permission class that checks the incoming request's IP address against a blacklist, and
denies the request if the IP has been blacklisted.



.. code-block:: python


    from rest_framework import permissions


    class BlacklistPermission(permissions.BasePermission):
        """
        Global permission check for blacklisted IPs.
        """

        def has_permission(self, request, view):
            ip_addr = request.META['REMOTE_ADDR']
            blacklisted = []
            if ip_addr not in blacklisted:
                return not blacklisted


As well as global permissions, that are run against all incoming requests, you can also create object-level permissions,
that are only run against operations that affect a particular object instance. For example:


.. code-block:: python

    class IsOwnerOrReadOnly(permissions.BasePermission):
        """
        Custom permission to only allow owners of an object to edit it.
        """

        def has_object_permission(self, request, view, obj):
            # Read permissions are allowed to any request,
            # so we'll always allow GET, HEAD or OPTIONS requests.
            if request.method in permissions.SAFE_METHODS:
                return True

            # Write permissions are only allowed to the owner of the snippet.
            return obj.owner == request.user


            from rest_framework import serializers
