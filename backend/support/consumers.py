import json
from channels.generic.websocket import AsyncWebsocketConsumer
from support.models import *
from support.ai import generate_ai_response
from channels.db import database_sync_to_async
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.group_name = f'chat_{self.session_id}'

        # Join room group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"received data:{text_data}")
        sender = data['sender']
        message = data['message']

        session = await database_sync_to_async(ChatSession.objects.get)(id=self.session_id)
        await database_sync_to_async(ChatMessage.objects.create)(
            session=session, sender=sender, message=message
        )

        await self.channel_layer.group_send(
            self.group_name, {
                'type': 'chat_message',
                'sender': sender,
                'message': message,
            }
        )

        if sender == 'user':
            reply = await generate_ai_response(message, session.id)
            await database_sync_to_async(ChatMessage.objects.create)(
                session=session, sender='bot', message=reply
            )
            await self.channel_layer.group_send(
                self.group_name, {
                    'type': 'chat_message',
                    'sender': 'bot',
                    'message': reply,
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'sender': event['sender'],
            'message': event['message'],
        }))


