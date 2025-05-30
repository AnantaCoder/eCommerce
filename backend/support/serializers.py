from rest_framework import serializers 
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from support.models import *



# incomplete code 
class MessageSerializer(serializers.ModelSerializer):
    pass

class ChatRoomSerializer(serializers.ModelSerializer):
    pass 