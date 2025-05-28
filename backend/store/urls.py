from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, OrderViewSet, SellerViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'seller', SellerViewSet, basename='seller')

urlpatterns = [
    path('', include(router.urls)),
]
