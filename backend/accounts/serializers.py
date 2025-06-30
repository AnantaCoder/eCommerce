# serializer for validating the data before saving it to the db.
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Seller, OTP , NewsletterUser

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    is_seller = serializers.ReadOnlyField()  # uses the property from user model

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_email_verified",
            "is_seller",
        )
        read_only_fields = ("id", "is_email_verified", "is_seller")


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    password2 = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ("email", "password", "password2", "first_name", "last_name")
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):

        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):

        # Remove password2 from validated data
        validated_data.pop("password2", None)

        user = User.objects.create_user(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"],
        )
        return user


class EmailVerificationSerializer(serializers.Serializer):

    token = serializers.CharField()


class OTPVerificationSerializer(serializers.Serializer):

    email = serializers.EmailField()
    code = serializers.CharField(min_length=6, max_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        code = attrs.get("code")

        try:
            user = User.objects.get(email=email)

            # Get the latest OTP for this user
            try:
                otp = OTP.objects.filter(user=user).latest("created_at")

                if not otp.is_valid():
                    raise serializers.ValidationError(
                        {"code": "OTP has expired. Please request a new one."}
                    )

                if otp.code != code:
                    raise serializers.ValidationError({"code": "Invalid OTP code."})

                # Add user to attrs for the view to use
                attrs["user"] = user

            except OTP.DoesNotExist:
                raise serializers.ValidationError(
                    {"code": "No OTP found. Please request a new one."}
                )

        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "No user found with this email address."}
            )

        return attrs


class RequestOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")


class SellerSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = Seller
        fields = [
            "user_email",
            "user_name",
            "shop_name",
            "gst_number",
            "address",
            "seller_type",
            "is_verified",
            "created_at",
            "updated_at",
        ]
        read_only_fields = (
            "user_email",
            "user_name",
            "is_verified",
            "created_at",
            "updated_at",
        )

    # addition validation for gst number
    # def validate_gst_number(self, value):
    #     if value and len(value) != 15:
    #         raise serializers.ValidationError("gst number must be 15 characters long")
    #     return value


class SellerRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ["shop_name", "gst_number", "address", "seller_type"]
        extra_kwargs = {"shop_name": {"required": True}}

    def create(self, validated_data):

        user = self.context["request"].user

        if hasattr(user, "seller"):
            raise serializers.ValidationError("User is already registered as a seller.")

        return Seller.objects.create(user=user, **validated_data)



class NewsletterUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = NewsletterUser
        fields=[
            "email"
        ]