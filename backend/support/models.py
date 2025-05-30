from django.db import models
from accounts.models import User,Seller
import uuid
from django.conf import settings
# Create your models here.



class TimeStampModel(models.Model):
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta: abstract = True

class ChatRoom(TimeStampModel):
    id  = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    participants = models.ManyToManyField(User,related_name="chat_rooms")
    is_group = models.BooleanField(default=False)
    
    def __str__(self):
        return f"ChatRoom {self.id} - {'Group' if self.is_group else "Private"}"
    
class Message(TimeStampModel):
    
    room = models.ForeignKey(ChatRoom,related_name="messages",on_delete=models.CASCADE)
    sender = models.ForeignKey(User,related_name="sent_messages",on_delete=models.CASCADE)
    content = models.TextField()
    is_ai =models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Message {self.id} in {self.room} by {self.sender} - {'AI' if self.is_ai else 'User'}"