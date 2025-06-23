from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from support.models import *


# incomplete code
class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "sender", "message", "timestamp"]
    
    # task - add a get to exclude the <think> block . 

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ["id", "email", "created_at", "is_active", "messages"]
class SendMessageSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()
    message = serializers.CharField(max_length=1000)
    sender = serializers.ChoiceField(choices=['user', 'bot', 'human'], default='user')