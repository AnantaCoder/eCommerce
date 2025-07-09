from rest_framework import viewsets,permissions,mixins,serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from store.models import Item,Order,Category,WishlistItem, CartItem,OrderAddress ,Review,Feedback
from store.serializers import ItemSerializer ,OrderSerializer , CreateOrderSerializer,OrderAddressSerializer,CategorySerializer,WishlistItemSerializer,CartItemSerializer , ReviewSerializer,FeedbackSerializer
from .permissions import IsSeller,IsBuyerOrReadOnly
from accounts.models import Seller
from accounts.serializers import SellerSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.db.models import Avg
from django.core.paginator import Paginator
from rest_framework.views import APIView
class ItemViewSet(viewsets.ModelViewSet):
    
    queryset = (
        Item.objects.all()
        .annotate(avg_rating=Avg('reviews__rating'))  # review model er rating field ke access kora ho66e 
        .distinct()
    )
    serializer_class = ItemSerializer
    #presa class for searching 
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends=[DjangoFilterBackend,SearchFilter]
    filterset_fields = ['category','id'] 
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
    
    def get_queryset(self):
        queryset= super().get_queryset()
        seller_id = self.request.query_params.get("seller")
        if seller_id:
            queryset = queryset.filter(seller__user__id=seller_id)
        return queryset.distinct()
    
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
    
    @action(detail=True, methods=['get'], url_path='items')
    def items(self, request, pk=None):
        category = self.get_object()
        items = category.items.all()
        serializer = ItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)
            
            
            
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        item = serializer.validated_data.get('item')
        
        if CartItem.objects.filter(user=user,item=item).exists():
             raise serializers.ValidationError(
                {"detail": "This product is already in your cart."}
            )
        
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['delete'],url_path='delete-all')
    def delete_all(self,request):
        user = self.request.user
        try: 
            if not user.is_authenticated:
                return Response(
                    {"error":"Auth credentials not provided"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            deleted_count,_=CartItem.objects.filter(user=user).delete()
            return Response(
                {"detail": f"Deleted {deleted_count} cart item(s) successfully."},
                 status=status.HTTP_200_OK
            )
        except Exception as e :
               return Response(
                    {"error":f"Unexpected : {e}"},
                    status=status.HTTP_401_UNAUTHORIZED
                )    

class WishlistItemViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)
    
    
    def perform_create(self, serializer):
        user = self.request.user
        item = serializer.validated_data.get('item')
        
        if WishlistItem.objects.filter(user=user,item=item).exists():
             raise serializers.ValidationError(
                {"detail": "This product is already in your wishlist."}
            )
        serializer.save(user= self.request.user)
        
        
        

class OrderAddressViewSet(viewsets.ModelViewSet):
    queryset = OrderAddress.objects.all()
    serializer_class = OrderAddressSerializer
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        
class ReviewOrderViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().select_related('user','item')
    serializer_class = ReviewSerializer
    permission_classes = [IsBuyerOrReadOnly,permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        
        queryset = super().get_queryset()
        user=self.request.user
        
        if hasattr(user,"seller"):
            queryset=queryset.filter(item__seller= user.seller)
        
        item_id = self.request.query_params.get("item")
        if item_id:
            queryset = queryset.filter(item_id=item_id)

        return queryset.distinct()
    
    def perform_create(self, serializer):
        user = self.request.user
        item = serializer.validated_data.get("item")

        if Review.objects.filter(user=user, item=item).exists():
            raise serializers.ValidationError(
            {"detail": "One review per item is allowed ."}
            )
        serializer.save(user= self.request.user)
        
    @action(detail=False, methods=['get'], url_path='is-reviewed')
    def is_reviewed(self, request):
        user = request.user
        item_id = request.query_params.get("item_id")
        item_name=request.query_params.get("item_name")

        if not item_id:
            return Response(
                {"error": "Item ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        has_reviewed = Review.objects.filter(user=user, item_id=item_id).exists()

        return Response(
            {"item_id": item_id, "reviewed": has_reviewed,"item_name":item_name},
            status=status.HTTP_200_OK
        )
        

    @action(detail=False, methods=['get'], url_path='pending-reviews')
    def pending_reviews(self, request):
        user = request.user

        user_orders = Order.objects.filter(buyer=user, status='confirmed')

        ordered_item_ids = set(
            user_orders.values_list("items__id", flat=True)
        )

        reviewed_item_ids = set(
            Review.objects.filter(user=user).values_list("item_id", flat=True)
        )

        pending_review_ids = ordered_item_ids - reviewed_item_ids

        items_to_review = Item.objects.filter(id__in=pending_review_ids).values("id", "item_name")

        return Response({
            "total_unique_orders": len(ordered_item_ids),
            "total_reviews": len(reviewed_item_ids),
            "pending_reviews": list(items_to_review),
        })





class FeedbackView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes     = [JSONParser]

    def get(self, request):
        page = request.GET.get('page', 1)
        qs   = Feedback.objects.all().order_by('-created_at')
        paginator = Paginator(qs, 10)
        page_obj  = paginator.get_page(page)
        serializer = FeedbackSerializer(page_obj, many=True)
        return Response({
            'feedbacks': serializer.data,
            'total_pages': paginator.num_pages,
            'current_page': page_obj.number,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'total_count': paginator.count
        })

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'feedback': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
