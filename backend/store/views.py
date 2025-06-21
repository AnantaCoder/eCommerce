from rest_framework import viewsets,permissions,mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Item,Order,Category,WishlistItem, CartItem
from .serializers import ItemSerializer ,OrderSerializer , CreateOrderSerializer,CategorySerializer,WishlistItemSerializer,CartItemSerializer
from .permissions import IsSeller
from accounts.models import Seller
from accounts.serializers import SellerSerializer
class ItemViewSet(viewsets.ModelViewSet):
    
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_fields = ['category'] 
    search_fields = ['item_name', 'description', 'manufacturer']
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
    
    # remove the custom list since drf handles pagination automatically 
    # def list(self, request, *args, **kwargs):
    #     response = super().list(request, *args, **kwargs)
    #     response.data['total_items'] = self.get_queryset().count()
    #     return response
    
    
    
    
    def perform_create(self, serializer):
        seller = self.request.user.seller
        serializer.save(seller=seller)
   


    def perform_update(self, serializer):
        serializer.save()



class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """
    GET    /orders/        → list your orders
    GET    /orders/{pk}/   → retrieve a single order
    POST   /orders/        → create a new order (uses CreateOrderSerializer)
    POST   /orders/{pk}/confirm  → confirm an order(only Buyer)
    """
    queryset = Order.objects.all()

    def get_queryset(self):
        # only your own orders
        return self.queryset.filter(buyer=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # serialize the resulting Order with your read-only serializer
        output = OrderSerializer(order, context={'request': request})
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def confirm(self,request,pk=None):
        order = self.get_object()
        
        if order.buyer != request.user:
            return Response(
                {"detail": "Not allowed to confirm this order."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if order.status != order.ORDER_STATUS[0][0]:
                return Response(
                {"detail": f"Order cannot be confirmed once {order.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = 'confirmed'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
                

        
    
class SellerViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    viewsets.GenericViewSet):
    serializer_class = SellerSerializer
    permission_classes = [permissions.IsAuthenticated] #this line is not required . remove !!!
    
    def get_queryset(self):
        return Seller.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # user = self.request.user
        # # user.is_seller = True
        # # user.save(update_fields=['is_seller'])
        
        
        
class CategoryViewSet(viewsets.ModelViewSet):
    
    """
    GET    /categories/        → list all categories (anyone)
    GET    /categories/{pk}/   → retrieve a category (anyone)
    POST   /categories/        → create new category (only sellers)
    PUT    /categories/{pk}/   → full update (only sellers)
    PATCH  /categories/{pk}/   → partial update (only sellers)
    DELETE /categories/{pk}/   → delete (only sellers)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        # only authenticated sellers can create/update/delete
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsSeller]
        else:
            permission_classes = [permissions.AllowAny]
        return [p() for p in permission_classes]
    
    
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishlistItemViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)
    
    
    def perform_create(self, serializer):
        serializer.save(user= self.request.user)