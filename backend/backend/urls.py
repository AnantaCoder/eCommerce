
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/store/', include('store.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/support/',include('support.urls')),
    path('api/analyzer/',include('analyzer.urls')),
]