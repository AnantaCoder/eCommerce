from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, OrderViewSet, SellerViewSet,CategoryViewSet,WishlistItemViewSet,CartItemViewSet,OrderAddressViewSet, ReviewOrderViewSet,FeedbackView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'seller', SellerViewSet, basename='seller')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'wishlist', WishlistItemViewSet, basename='wishlist')
router.register(r'order_address', OrderAddressViewSet, basename='order_address')
router.register(r'reviews', ReviewOrderViewSet, basename='review')


urlpatterns = [
    path('', include(router.urls)),
    path('feedback/', FeedbackView.as_view(), name='feedback'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
