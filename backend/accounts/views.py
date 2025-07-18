from django.contrib.auth import get_user_model,authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.urls import reverse
from rest_framework import status, generics, permissions,viewsets,mixins,serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from accounts.serializers import (
    RegisterSerializer, UserSerializer, EmailVerificationSerializer,
    OTPVerificationSerializer, RequestOTPSerializer ,SellerSerializer,NewsletterUserSerializer, PasswordResetConfirmSerializer
)
from django.core.mail import send_mail, BadHeaderError
import logging
from django.shortcuts import redirect

logger = logging.getLogger(__name__)
from .models import *

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    Handles user registration and sends email verification.
    
    The create method registers a new user and automatically sends
    a verification email with a secure token-based link.
    """
    
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        """
        Create a new user account and send verification email.
        
        This method validates the registration data, creates the user,
        and attempts to send a verification email. If email sending fails,
        the user is still created but an appropriate message is returned.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        try:
            # Call the instance method (note the 'self.')
            self.send_verification_email(request, user)
            return Response(
                {"message": "User registered successfully. Check your email for a verification link."},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            # Log the specific error for debugging
            logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
            return Response(
                {
                    "message": "User registered successfully but email verification could not be sent.",
                    "detail": "Please use the request-otp endpoint to verify your email.",
                    "email": user.email
                },
                status=status.HTTP_201_CREATED
            )
    
    def send_verification_email(self, request, user):
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build the absolute URL for email verification
        # This uses Django's reverse() to get the correct URL pattern
        try:
            verify_path = reverse('accounts:verify_email')  # Note: using the namespaced URL
        except:
            verify_path = reverse('verify-email')
        base_url = request.build_absolute_uri(verify_path)
        verification_link = f"{base_url}?uid={uid}&token={token}"
        
        print(f"[DEBUG] Email verification link: {verification_link}")
        logger.info(f"Generated verification link for user {user.email}")
        
        subject = "Verify Your Email Address"
        message = (
            f"Hello,\n\n"
            f"Thank you for registering! Please click the link below to verify your email address:\n\n"
            f"{verification_link}\n\n"
            f"This link will expire in 24 hours for security purposes.\n\n"
            f"If you did not create this account, you can safely ignore this email.\n\n"
            f"Best regards,\n"
            f"E-Commerce by Anirban Sarkar "
        )
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False, 
            )
            logger.info(f"Verification email sent successfully to {user.email}")
            
        except BadHeaderError as e:
            logger.error(f"Bad email header when sending to {user.email}: {str(e)}")
            raise Exception("Invalid email header detected")
            
        except Exception as e:
            logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
            raise Exception(f"Email sending failed: {str(e)}")


class VerifyEmailView(APIView):
    '''this view verifies the email and set the things active :)'''
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        serializer = EmailVerificationSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)  
        
        token = serializer.validated_data['token']
        uid = request.query_params.get('uid')  
        
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
                frontend_base = settings.FRONTEND_URL.rstrip("/")
                redirect_url =  f"{frontend_base}/auth/callback?access={str(refresh.access_token)}&refresh={str(refresh)}"
                return redirect(redirect_url)
            
            
            # previous format-----------------------------------------------------------------------------------------
                # return Response({
                #     "detail": "Email successfully verified.",
                #     "refresh": str(refresh),
                #     "access": str(refresh.access_token)
                # }, status=status.HTTP_200_OK)
                # # return redirect('http/localhost:5173/home')
            #----------------------------------------------------------------------------------------------------------
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
                message=f"Your verification code is: {otp.code}. It expires in 15 minutes. Ecommerce by Anirban Sarkar",
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
            user.save(update_fields=['is_active', 'is_email_verified'])

            # Delete the used OTP
            user.otps.all().delete()

            # Generate JWT token from scratch 
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
    
    def get_object(self):
        return self.request.user
    
    
class LoginView(APIView):
    
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')

        if not email or not password:
            return Response({
                "detail":"Email and Password is required",
                "status":"error"
            },status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=email, password=password)

        if user is not None:
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            refresh = RefreshToken.for_user(user)
            user_serializer= UserSerializer(user)
            # this will be  thrown out 
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_serializer.data,
                'message': 'Login successful',
                'status': 'success'
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            try:
                user = User.objects.get(email=email)
                if not user.is_active:
                    return Response(
                        {"detail": "Account is not active. Please verify your email."},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except User.DoesNotExist:
                return Response(
                    {"detail": "Invalid credentials.", "status": "error"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            return Response(
                {"detail": "Invalid credentials.", "status": "error"},
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
        
        

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password has been reset successfully.🥳 Login Again."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IsOwner(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class SellerViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet ):
    """
    POST   /api/auth/seller/      → create  seller profile
    GET    /api/seller/{pk}/      → retrieve it
    PATCH  /api/seller/{pk}/      → partial update
    PUT    /api/seller/{pk}/      → full update
    """
    serializer_class = SellerSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Seller.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user

        if user.is_seller:
            raise serializers.ValidationError("You are already a seller.")

        serializer.save(user=user)

        # user.is_seller = True
        # user.save(update_fields=['is_seller'])
        



class NewsletterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = NewsletterUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        if NewsletterUser.objects.filter(email__iexact=email).exists():
            return Response(
                {"detail": "A subscription with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            NewsletterUser.objects.create(email=email)

            subject = "🎉 Welcome to the E-Commerce Newsletter!"
            message = (
                "Hello!\n\n"
                "Thank you for subscribing to our newsletter. We're excited to have you on board!\n\n"
                "You'll now be the first to know about our latest products, exclusive offers, and special updates.\n\n"
                "If you ever wish to unsubscribe, just click the link at the bottom of any of our emails.\n\n"
                "Happy shopping!\n"
                "— The E-Commerce Team by Anirban Sarkar 💌"
            )

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            logger.info(f"Newsletter confirmation email sent successfully to {email}")

            return Response(
                {
                    "detail": (
                        "🎉 Subscription successful! A welcome email has been sent to your inbox. "
                        "Thank you for joining our community."
                    )
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"detail": "An internal error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
# The mixin classes provide the actions that are used to provide the basic
# view behavior. Note that the mixin classes provide action methods 
# rather than defining the handler methods, such as .get() and 
# .post(), directly. This allows for more flexible composition of behavior.


'''viewsets'''
# user NameSet for a viewset based classes. 
'''A ViewSet class is simply a type of class-based View, that does not provide any method handlers such as .get() or .post(), and instead provides actions such as .list() and .create().

The method handlers for a ViewSet are only bound to the corresponding actions at the point of finalizing the view, using the .as_view() method.'''