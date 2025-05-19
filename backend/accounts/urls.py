from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RegisterView,
    VerifyEmailView,
    RequestOTPView,
    VerifyOTPView,
    UserDetailView,
    LoginView,
    LogoutView,
    SellerViewSet,       
)

app_name = 'accounts'

router = DefaultRouter()
router.register(r'seller', SellerViewSet, basename='seller')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginView.as_view(), name='user_login'),
    path('logout/', LogoutView.as_view(), name='user_logout'),

    path('signup/', RegisterView.as_view(), name='user_register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('request-otp/', RequestOTPView.as_view(), name='request_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),

    path('me/', UserDetailView.as_view(), name='user_detail'),

    path('', include(router.urls)),
]
