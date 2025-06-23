import json
from channels.generic.websocket import AsyncWebsocketConsumer
from support.models import ChatMessage,ChatSession
from support.ai import generate_ai_response
from channels.db import database_sync_to_async , sync_to_async
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
        message = data.get('message')
        sender = data.get('sender','user')
        mode = data.get('ai','human') #data btn ai and human 
        
        
        if not message or not sender:
            return await self.send(text_data=json.dumps({
                "error":"message and senders are required. "
            }))
            
        session = database_sync_to_async(ChatSession.objects.get)(id=self.session_id)


        # only saved fir users 

        if session.user:
            await database_sync_to_async(ChatMessage.objects.create)(
                session=session, sender='user',message= message
            )
        """if they want a human response then it goes to the admin group """
        if mode =='human':
            await self.channel_layer.group_send(
                'support_admins',
                {
                    'type':'admin.message',
                    'message':message,
                    'session_id':session.id,
                    'sender':'user', #sent by an user 
                }
            )
        else:
            ai_response = await generate_ai_response(prompt=message,session_id=self.session_id)
            if session.user: #<-- only save if user exists 
                await sync_to_async(ChatMessage.objects.create)(
                    session=session, sender='bot', message=ai_response
                )
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat.message',
                    'message': ai_response,
                    'sender': 'bot'
                }
            )
            
            
    async def chat_message(self,event):
        await self.send(text_data=json.dumps({
            'message':event['message'],
            'sender':event['sender']
        }))
        


class AdminConsumer(AsyncWebsocketConsumer):
    
    
    async def connect(self):
        user = self.scope['user']
        
        if not user.is_staff:
             await self.close()

        await self.channel_layer.group_add('support_admin',self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('support_admin',self.channel_name)
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        session_id = data.get('session_id')
        message = data.get('message')

        session = await sync_to_async(ChatSession.objects.get)(id=session_id)
        
        await sync_to_async(ChatMessage.objects.create)(
            session=session, sender='human', message=message
        )
        # send back to user group
        await self.channel_layer.group_send(
            f'session_{session_id}',
            {
                'type': 'chat.message',
                'message': message,
                'sender': 'human'
            }
        )

    async def admin_message(self, event):
        # no incoming events for admin
        pass

# # AI helper
# async def get_ai_response(message, email):
#     # integrate with your AI (e.g., OpenAI)
#     # placeholder echo
#     return f"AI echoes: {message}"
        
        