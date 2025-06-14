from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, OrderViewSet, SellerViewSet,CategoryViewSet,WishlistItemViewSet,CartItemViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'seller', SellerViewSet, basename='seller')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'wishlist', WishlistItemViewSet, basename='wishlist')


urlpatterns = [
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
