from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

import string
from datetime import timedelta
from django.utils import timezone
import secrets
# Create your models here.


class UserManager(BaseUserManager):
    
    
    def _create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError("Please set the email")
        email = self.normalize_email(email)
        user = self.model(email=email,**extra_fields)
        
        
        user.set_password(password)
        
        user.save(using=self._db)
        return user
    
    
    def create_user(self,email,password=None , **extra_fields):
        extra_fields.setdefault('is_staff',False)
        extra_fields.setdefault('is_superuser',False)
        extra_fields.setdefault('is_active',False) 
        return self._create_user(email,password,**extra_fields)
    
    def create_superuser(self,email,password=None , **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        extra_fields.setdefault('is_active',True) #user active always. 
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        
        return self._create_user(email,password,**extra_fields)
    
class User(AbstractUser):
    
    username = None
    email = models.EmailField(_('email address') , unique=True)
    is_email_verified = models.BooleanField(default=False)
    
    # redundant filed for user type . 
    # is_seller = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] #email and password required by default 
    
    objects = UserManager()
    def __str__(self):
        return self.email
    
    # dynamically checks if user is seller or not 
    @property
    def is_seller(self):
        return hasattr(self,'seller')
    
class Seller(models.Model):
    
    
    SELLER_TYPES = [
        ('individual', 'Individual'),
        ('wholesaler', 'Wholesaler'),
        ('enterprise', 'Enterprise'),
    ]
      
      
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='seller',
        primary_key=True
    )
    shop_name = models.CharField(max_length=200)
    gst_number = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    seller_type = models.CharField(max_length=20, choices=SELLER_TYPES, default='individual')
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        indexes= [
            models.Index(fields=['shop_name']),
            models.Index(fields=['gst_number'])
            
        ]
    def __str__(self):
        return self.shop_name
    
class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps")
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField(null=True)  

    def save(self, *args, **kwargs):
        if not self.expired_at:
            self.expired_at = timezone.now() + timedelta(minutes=15)
        super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() <= self.expired_at 

    @classmethod
    def generate_otp(cls, user):
        user.otps.all().delete()
        code = ''.join(secrets.choice(string.digits) for _ in range(6))  
        otp = cls(user=user, code=code)
        otp.save()
        return otp
    