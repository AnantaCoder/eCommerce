from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from support.models import ChatSession, ChatMessage
from support.serializers import ChatSessionSerializer, ChatMessageSerializer, SendMessageSerializer
from support.ai import generate_ai_response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class StartChatSessionView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {"error": "Email is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check for existing active session
        existing_session = ChatSession.objects.filter(
            email=email, 
            is_active=True
        ).first()
        
        if existing_session:
            serializer = ChatSessionSerializer(existing_session)
            return Response({
                'message': 'Existing active session found',
                **serializer.data
            }, status=status.HTTP_200_OK)
        
        # Create new session
        session = ChatSession.objects.create(email=email)
        serializer = ChatSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChatHistoryView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, session_id):
        try:
            session = ChatSession.objects.get(id=session_id)
            serializer = ChatSessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Chat session not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class SendMessageView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        session_id = serializer.validated_data['session_id']
        message_text = serializer.validated_data['message']
        sender = serializer.validated_data['sender']
        
        try:
            session = ChatSession.objects.get(id=session_id, is_active=True)
            
            # Create the message
            message = ChatMessage.objects.create(
                session=session,
                message=message_text,
                sender=sender
            )
            
            # Send via WebSocket
            channel_layer = get_channel_layer()
            group_name = f'chat_{session_id}'
            
            async_to_sync(channel_layer.group_send)(
                group_name, {
                    'type': 'chat_message',
                    'sender': sender,
                    'message': message_text,
                }
            )
            
            # Generate AI response for user messages
            if sender == 'user':
                try:
                    ai_response = generate_ai_response(message_text, session.id)
                    ai_message = ChatMessage.objects.create(
                        session=session,
                        message=ai_response,
                        sender='bot'
                    )
                    
                    # Send AI response via WebSocket
                    async_to_sync(channel_layer.group_send)(
                        group_name, {
                            'type': 'chat_message',
                            'sender': 'bot',
                            'message': ai_response,
                        }
                    )
                except Exception as e:
                    print(f"AI generation error: {e}")
                    fallback = "I'm sorry, I'm having trouble right now. Please try again."
                    ChatMessage.objects.create(
                        session=session,
                        message=fallback,
                        sender='bot'
                    )
                    async_to_sync(channel_layer.group_send)(
                        group_name, {
                            'type': 'chat_message',
                            'sender': 'bot',
                            'message': fallback,
                        }
                    )
            
            message_serializer = ChatMessageSerializer(message)
            return Response(message_serializer.data, status=status.HTTP_201_CREATED)
            
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Chat session not found or inactive"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class EndChatSessionView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        session_id = request.data.get('session_id')
        
        if not session_id:
            return Response(
                {"error": "session_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            session = ChatSession.objects.get(id=session_id)
            session.is_active = False
            session.save()
            
            # Notify via WebSocket
            channel_layer = get_channel_layer()
            group_name = f'chat_{session_id}'
            
            async_to_sync(channel_layer.group_send)(
                group_name, {
                    'type': 'chat_message',
                    'sender': 'system',
                    'message': 'Chat session has been ended.',
                }
            )
            
            return Response(
                {"message": "Chat session ended successfully"}, 
                status=status.HTTP_200_OK
            )
            
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Chat session not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )