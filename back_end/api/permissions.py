# api/permissions.py
from rest_framework import permissions

class IsAnimateur(permissions.BasePermission):
    """
    Allows access only to users with the 'animateur' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'animateur'

class IsParticipant(permissions.BasePermission):
    """
    Allows access only to users with the 'participant' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'participant'
    
class IsAdmin(permissions.BasePermission):
    """
    Allows access only to users with the 'admin' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

class IsAnimateurOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners (animateur) of an object to edit/delete it.
    Assumes the model instance has an `animateur` attribute.
    Allows read-only access for any authenticated user.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (getattr(request.user, 'role', None) == 'animateur' and
                obj.animateur == request.user)

class IsAnimateurOrParticipantReadOnly(permissions.BasePermission):
     def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if getattr(request.user, 'role', None) == 'animateur':
            return True
        if getattr(request.user, 'role', None) == 'participant' and request.method in permissions.SAFE_METHODS:
            return True
        return False

     def has_object_permission(self, request, view, obj):
         if request.method in permissions.SAFE_METHODS:
             return True

         return (getattr(request.user, 'role', None) == 'animateur' and
                 obj.animateur == request.user)