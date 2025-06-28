from django.shortcuts import render
from rest_framework import permissions, mixins, generics, viewsets
from payments.models import Payments, PaymentsGatewayLog
from payments.serializers import PaymentsSerializer, PaymentsGatewayLogSerializer
from rest_framework.views import *
from rest_framework.response import *
import stripe
from datetime import timezone
from django.views.decorators.csrf import csrf_exempt
# Payment list + create
class PaymentListCreateViewSet(
    mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):

    queryset = Payments.objects.all()
    serializer_class = PaymentsSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status="pending")


# Payment retrieve + update + delete
class PaymentDetailViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Payments.objects.all()
    serializer_class = PaymentsSerializer

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)


# Gateway log list + create
class PaymentsGatewayLogListCreateViewSet(
    mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    queryset = PaymentsGatewayLog.objects.all()
    serializer_class = PaymentsGatewayLogSerializer


# Gateway log retrieve
class PaymentsGatewayLogDetailViewSet(
    mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    queryset = PaymentsGatewayLog.objects.all()
    serializer_class = PaymentsGatewayLogSerializer


class CreatePaymentIntent(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        order_id = request.data.get("order_id")
        seller_id = request.data.get("seller_id", 1)  # Default 1
        amount = request.data.get("amount", 0)
        currency = request.data.get("currency", "inr").lower()
        method = request.data.get("payment_method", "card").lower()

        # Validate inputs
        if not order_id:
            return Response(
                {"error": "order_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if amount <= 0:
            return Response(
                {"error": "Amount must be greater than zero"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if method not in ("card", "upi"):
            return Response(
                {"error": "Invalid payment_method. Must be 'card' or 'upi'"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            amount_in_paise = int(amount)
            
            stripe.api_key = settings.STRIPE_SECRET_KEY
            intent = stripe.PaymentIntent.create(
                amount=amount_in_paise,
                currency=currency,
                payment_method_types=[method],
                metadata={
                    "user_id": str(user.id),
                    "order_id": str(order_id),
                    "method": method,
                },
            )

            payment = Payments.objects.create(
                user_id=user,
                seller_id_id=seller_id,  
                order_id_id=order_id,   
                amount=amount_in_paise / 100, 
                currency=currency.upper(),
                status="pending",
                payment_method=method,
                payment_gateway="stripe",
                transaction_id=intent.id,
            )

            return Response({
                "client_secret": intent.client_secret,
                "payment_id": payment.id
            })

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        
class StripeWebhookView(APIView):
    permission_classes = []

    @csrf_exempt
    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except Exception as e:
            print("Webhook error:", e)
            return Response(status=400)

        if event["type"] == "payment_intent.succeeded":
            intent = event["data"]["object"]
            pi_id = intent["id"]
            try:
                payment = Payments.objects.get(transaction_id=pi_id)
                payment.status = "completed"
                payment.is_successful = True
                payment.completed_at = timezone.now()
                payment.save()
                PaymentsGatewayLog.objects.create(
                    payment_id=payment,
                    gateway_response=intent
                )
            except Payments.DoesNotExist:
                print(f"No Payments record for transaction_id={pi_id}")
            except Exception as e:
                print(f"Webhook processing error: {e}")

        return Response(status=200)