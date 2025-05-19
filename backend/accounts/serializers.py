from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import OTP
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_email_verified')
        read_only_fields = ('id', 'is_email_verified')


class RegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        """Create and return a new user."""
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class EmailVerificationSerializer(serializers.Serializer):
    
    token = serializers.CharField()


class OTPVerificationSerializer(serializers.Serializer):
    """Serializer for verifying OTP code."""
    
    email = serializers.EmailField()
    code = serializers.CharField(min_length=6, max_length=6)
    
    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('code')
        
        try:
            user = User.objects.get(email=email)
            
            # Get the latest OTP for this user
            try:
                otp = OTP.objects.filter(user=user).latest('created_at')
                
                if not otp.is_valid():
                    raise serializers.ValidationError({"code": "OTP has expired. Please request a new one."})
                
                if otp.code != code:
                    raise serializers.ValidationError({"code": "Invalid OTP code."})
                
                # Add user to attrs for the view to use
                attrs['user'] = user
                
            except OTP.DoesNotExist:
                raise serializers.ValidationError({"code": "No OTP found. Please request a new one."})
            
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "No user found with this email address."})
        
        return attrs


class RequestOTPSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            User.objects.get(email=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        
        
