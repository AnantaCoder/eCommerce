from django.db import models
from accounts.models import User,Seller
import uuid
from django.conf import settings
# Create your models here.


class ChatSession(models.Model):
    email = models.EmailField(max_length=254,unique=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE, #<---------- user delete chat delete 
        null=True,
        blank=True,
        related_name='chat_sessions'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_active= models.BooleanField(default=True)

    def __str__(self):
        return f"session {self.id} for {self.email}"

class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
        ('human', 'Human Agent'),
    ]
    session = models.ForeignKey(
        ChatSession, 
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.CharField(max_length=10, choices=ROLE_CHOICES)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"[{self.timestamp}] {self.sender}: {self.message[:30]}"