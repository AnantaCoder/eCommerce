from rest_framework import viewsets,permissions,mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Item,Order
from .serializers import ItemSerializer ,OrderSerializer
from .permissions import IsSeller
from accounts.models import Seller
from accounts.serializers import SellerSerializer
class ItemViewSet(viewsets.ModelViewSet):
    
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    """
    GET    /items/          → list all items (anyone)
    GET    /items/{pk}/     → retrieve an item (anyone)
    POST   /items/          → create new item (only sellers)
    PUT    /items/{pk}/     → full update (only sellers)
    PATCH  /items/{pk}/     → partial update (only sellers)
    DELETE /items/{pk}/     → delete (only sellers)

    POST   /items/{pk}/purchase/ → purchase (any authenticated user)
    """


    def get_permissions(self):
        if self.action in ['create','update','partial_update','destroy']:
            permission_classes = [permissions.IsAuthenticated,IsSeller]
        elif self.action == 'purchase':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes =[permissions.AllowAny]
            
        return [prem() for prem in permission_classes]
    
    
    @action(detail=True, methods=['post'])
    def purchase(self,request,pk=None):
        item = self.get_object()
        if item.quantity < 1:
            return Response(
                {"detail": "Out of stock."},
                status=status.HTTP_400_BAD_REQUEST
            )
        item.quantity -= 1 
        item.save()
        return Response(
            {"detail": f"Purchased 1 x {item.item_name}. Remaining: {item.quantity}"},
            status=status.HTTP_200_OK
        )
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        total_items = queryset.count()
        return Response({
            "total_items": total_items,
            "items": serializer.data
        })

class OrderViewSet(mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        return self.queryset.filter(buyer=self.request.user)
    
    
class SellerViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    viewsets.GenericViewSet):
    serializer_class = SellerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Seller.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        user = self.request.user
        user.is_seller = True
        user.save(update_fields=['is_seller'])