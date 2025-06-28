from django.urls import path, include
from rest_framework.routers import DefaultRouter
from payments.views import *

router = DefaultRouter()
router.register(r'payments', PaymentListCreateViewSet, basename='payment')
router.register(r'payment-detail', PaymentDetailViewSet, basename='payment-detail')
router.register(r'gateway-logs', PaymentsGatewayLogListCreateViewSet, basename='gateway-log')
router.register(r'gateway-log-detail', PaymentsGatewayLogDetailViewSet, basename='gateway-log-detail')

urlpatterns = [
    path('', include(router.urls)),
    path("create-intent/", CreatePaymentIntent.as_view(), name="create-intent"),
    path("webhook/",StripeWebhookView.as_view(),name="stripe-webhook"),
]
