from django.contrib.auth import get_user_model,authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from .serializers import (
    RegisterSerializer, UserSerializer, EmailVerificationSerializer,
    OTPVerificationSerializer, RequestOTPSerializer 
)
from .models import OTP

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    
    serializer_class = RegisterSerializer #serializer class
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = serializer.save()
            self.send_verification_email(user)
            return Response({
            "message": "User registered successfully. Please check your email to verify your account."
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
            {"detail": f"Registration failed: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
            )
    
    def send_verification_email(self, user):
        try:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            verification_link = f"http://127.0.0.1:8000/api/auth/verify-email/?uid={uid}&token={token}"
            # verification_link = f"{settings.FRONTEND_URL}/verify-email/?uid={uid}&token={token}"
            print(f"verification mail is :{verification_link} ")
        
            send_mail(
            subject="Verify Your Email \n",
            message=f"Please click the link to verify your email: {verification_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
            )
        except Exception as e :
            return Response({
                "detail":"Unable to send verification email."
            },status=status.HTTP_503_SERVICE_UNAVAILABLE)


class VerifyEmailView(APIView):
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        serializer = EmailVerificationSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)  # Will auto-validate the token field
        
        token = serializer.validated_data['token']
        uid = request.query_params.get('uid')  # Still need to handle uid separately
        
        
            
            
        if not uid or not token:
            return Response({"detail": "Missing parameters."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = get_object_or_404(User, pk=user_id)
            
            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.is_email_verified = True
                user.save()
                
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    "detail": "Email successfully verified.",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RequestOTPView(APIView):
    """View for requesting OTP."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = RequestOTPSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "No user found with that email address."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            otp = OTP.generate_otp(user)
            
            send_mail(
                subject="Your Verification Code",
                message=f"Your verification code is: {otp.code}. It expires in 15 minutes.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            return Response(
                {"detail": f"Failed to generate or send OTP. Please try again later.{e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {"detail": "OTP sent to your email."},
            status=status.HTTP_200_OK
        )

class VerifyOTPView(APIView):

    permission_classes = [permissions.AllowAny]
    serializer_class = OTPVerificationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = serializer.validated_data['user']

            # Activate the user
            user.is_active = True
            user.is_email_verified = True
            user.save()

            # Delete the used OTP
            user.otps.all().delete()

            # Generate JWT token
            refresh = RefreshToken.for_user(user)

            return Response({
                "detail": "Email successfully verified.",
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
            
            
        except Exception as e:
            return Response(
                {"detail": f"OTP verification failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserDetailView(generics.RetrieveAPIView):
    
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated] permission class is default . 
    
    def get_object(self):
        return self.request.user
    
    
class LoginView(APIView):
    
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '')
        password = request.data.get('password', '')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            refresh = RefreshToken.for_user(user)
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                },
                'message': 'Login successful',
                'status': 'success'
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    return Response(
                        {"detail": "Account is not active. Please verify your email."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                else:
                    return Response(
                        {"detail": "Invalid credentials."},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except User.DoesNotExist:
                return Response(
                    {"detail": "Invalid credentials."},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
                
class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    
    
class LogoutView(APIView):
    
    def post(self,request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except KeyError:
            return Response({"detail": "Refresh token not provided."}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError as e:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)