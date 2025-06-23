from django.urls import path, include
from rest_framework.routers import DefaultRouter
from support.views import (
    ChatHistoryView,
    SendMessageView,
    SessionView,
    ListSessionsView
)

urlpatterns = [
    path('session/', SessionView.as_view(), name='create-session'),
    path('sessions/', ListSessionsView.as_view(), name='list-sessions'),
    path('history/<int:session_id>/', ChatHistoryView.as_view(), name='chat-history'),
    path('send/', SendMessageView.as_view(), name='send-message'),
]
