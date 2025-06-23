from django.urls import re_path
from support.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/support/(?P<session_id>[^/]+)/$', ChatConsumer.as_asgi()),
]