from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from support.models import ChatSession, ChatMessage
from support.serializers import (
    ChatSessionSerializer,
    ChatMessageSerializer,
    SendMessageSerializer,
)
from support.ai import generate_ai_response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from channels.exceptions import ChannelFull,InvalidChannelLayerError
import socket


class SessionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        if user:
            session, _ = ChatSession.objects.get_or_create(
                user=user, email=user.email, is_active=True
            )
        else:
            email = request.data.get("email")
            if not email:
                return Response(
                    {"error": "Email required for anonymous chat"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            session, _ = ChatSession.objects.get_or_create(
                email=email, user=None, is_active=True
            )
        serializer = ChatSessionSerializer(session)
        return Response(serializer.data)


class ListSessionsView(APIView):

    def get(self, request):
        sessions = ChatSession.objects.filter(user=request.user)
        serializer = ChatSessionSerializer(sessions, many=True)
        return Response(serializer.data)


class ChatHistoryView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, session_id):
        try:
            session = ChatSession.objects.get(id=session_id)
            serializer = ChatSessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Chat session not found"}, status=status.HTTP_404_NOT_FOUND
            )


class SendMessageView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        session_id = serializer.validated_data["session_id"]
        message_text = serializer.validated_data["message"]
        sender = serializer.validated_data["sender"]

        try:
            session = ChatSession.objects.get(id=session_id, is_active=True)
            message = ChatMessage.objects.create(
                session=session, message=message_text, sender=sender
            )

            channel_layer = get_channel_layer()
            group_name = f"session_{session_id}"

            try:
                async_to_sync(channel_layer.group_send)(
                    group_name,
                    {
                        "type": "chat.message",
                        "sender": sender,
                        "message": message_text,
                    },
                )
            except (
                ChannelFull,
                InvalidChannelLayerError,
                ConnectionRefusedError,
                socket.error,
            ) as e:
                print(f"WebSocket broadcast error: {e}")
                return Response(
                    {
                        "error": "Real-time messaging service is temporarily unavailable. Please try again later."
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            if sender == "user":
                try:
                    ai_response = generate_ai_response(message_text, session.id)
                except Exception:
                    ai_response = (
                        "I'm sorry, I'm having trouble right now. Please try again."
                    )

                ChatMessage.objects.create(
                    session=session, message=ai_response, sender="bot"
                )

                async_to_sync(channel_layer.group_send)(
                    group_name,
                    {
                        "type": "chat.message",
                        "sender": "bot",
                        "message": ai_response,
                    },
                )

            message_serializer = ChatMessageSerializer(message)
            return Response(message_serializer.data, status=status.HTTP_201_CREATED)

        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Chat session not found or inactive"},
                status=status.HTTP_404_NOT_FOUND,
            )
