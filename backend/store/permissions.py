from rest_framework import permissions

class IsSeller(permissions.BasePermission):
    
    def has_permission(self, request,view):
        return bool(request.user and request.user.is_authenticated and request.user.is_seller)