from rest_framework import permissions
from store.models import OrderItem
class IsSeller(permissions.BasePermission):
    
    def has_permission(self, request,view):
        return bool(request.user and request.user.is_authenticated and request.user.is_seller)
    

class IsBuyerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Only authenticated users can perform write operations
        if not (request.user and request.user.is_authenticated):
            return False

        # Allow read-only methods for any user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Determine the item being reviewed
        item_id = request.data.get('item') or view.kwargs.get('item_id')
        if not item_id:
            return False

        # Check that the authenticated user has purchased this item
        # Uses the ManyToMany relation 'orders' on OrderItem to link to Order.buyer
        return OrderItem.objects.filter(
            original_item_id=item_id,
            orders__buyer=request.user
        ).exists()