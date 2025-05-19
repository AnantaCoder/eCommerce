from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
import random
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
        
        # create this method 
        user.set_password(password)
        
        user.save(using=self._db)
        return user
    
    
    def create_user(self,email,password=None , **extra_fields):
        extra_fields.setdefault('is_staff',False)
        extra_fields.setdefault('is_superuser',False)
        extra_fields.setdefault('is_active',False) #user inactive until verified. 
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
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] #email and password required by default 
    
    objects = UserManager()
    def __str__(self):
        return self.email
    
    
class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps")
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField(null=True)  # Allow NULL

    def save(self, *args, **kwargs):
        if not self.expired_at:
            self.expired_at = timezone.now() + timedelta(minutes=15)
        super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() <= self.expired_at  # Fixed typo

    @classmethod
    def generate_otp(cls, user):
        user.otps.all().delete()
        code = ''.join(secrets.choice(string.digits) for _ in range(6))  # More secure
        otp = cls(user=user, code=code)
        otp.save()
        return otp