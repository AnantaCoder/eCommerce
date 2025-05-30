from django.shortcuts import render
from rest_framework import viewsets
from support.models import *
from support.serializers import *
# Create your views here.




# incomplete code 
class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer