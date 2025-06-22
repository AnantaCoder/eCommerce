from django.urls import path, include
from rest_framework.routers import DefaultRouter
from support.views import (
    StartChatSessionView,
    ChatHistoryView,
    SendMessageView,
    EndChatSessionView,
)

app_name = 'support'

urlpatterns = [
    path('start/', StartChatSessionView.as_view(), name='start_chat_session'),
    path('history/<int:session_id>/', ChatHistoryView.as_view(), name='chat_history'),
    path('message/', SendMessageView.as_view(), name='send_message'),
    path('end-session/', EndChatSessionView.as_view(), name='end_chat_session'),
]