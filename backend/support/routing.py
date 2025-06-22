from django.urls import re_path
from support.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<session_id>[^/]+)/$', ChatConsumer.as_asgi()),
]