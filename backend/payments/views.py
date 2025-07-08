from django.shortcuts import render
from rest_framework import permissions, mixins, generics, viewsets
from payments.models import Payments, PaymentsGatewayLog
from payments.serializers import PaymentsSerializer, PaymentsGatewayLogSerializer
from rest_framework.views import *
from rest_framework.response import *
import stripe
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListAPIView
from django.utils.decorators import method_decorator
from django.conf import settings

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
            amount_in_paise = int(float(amount)) #change this letter 
            
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
                amount=amount,  
                currency=currency.upper(),
                status="pending",  
                payment_method=method,
                payment_gateway="stripe",
                transaction_id=intent.id,
                is_successful=False  
            )

            return Response({
                "client_secret": intent.client_secret,
                "payment_id": payment.id,
                "status": "pending"
            })

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        
@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as e:
            print(f"Invalid payload: {e}")
            return Response({"error": "Invalid payload"}, status=400)
        except stripe.error.SignatureVerificationError as e:
            print(f"Invalid signature: {e}")
            return Response({"error": "Invalid signature"}, status=400)

        # Handle multiple event types
        if event["type"] == "payment_intent.succeeded":
            self.handle_payment_intent_succeeded(event)
        elif event["type"] == "charge.succeeded":
            self.handle_charge_succeeded(event)
        elif event["type"] == "charge.updated":
            self.handle_charge_updated(event)
        elif event["type"] == "payment_intent.payment_failed":
            self.handle_payment_failed(event)
        else:
            print(f"Unhandled event type: {event['type']}")

        return Response({"status": "success"}, status=200)

    def handle_payment_intent_succeeded(self, event):
        """Handle payment_intent.succeeded event"""
        intent = event["data"]["object"]
        pi_id = intent["id"]
        
        try:
            payment = Payments.objects.get(transaction_id=pi_id)
            payment.status = "completed"
            payment.is_successful = True
            payment.completed_at = timezone.now()
            payment.save()
            
            # Update related order status
            if hasattr(payment, 'order_id') and payment.order_id:
                order = payment.order_id
                order.status = 'confirmed'  # or 'paid' based on your business logic
                order.save()
            
            # Log the event
            PaymentsGatewayLog.objects.create(
                payment_id=payment,
                gateway_response=intent
            )
            
            print(f"Payment {pi_id} marked as completed")
            
        except Payments.DoesNotExist:
            print(f"No Payments record found for transaction_id={pi_id}")
        except Exception as e:
            print(f"Error processing payment_intent.succeeded: {e}")

    def handle_charge_succeeded(self, event):
        """Handle charge.succeeded event"""
        charge = event["data"]["object"]
        pi_id = charge["payment_intent"]
        
        try:
            payment = Payments.objects.get(transaction_id=pi_id)
            payment.status = "completed"
            payment.is_successful = True
            payment.completed_at = timezone.now()
            payment.save()
            
            # Update related order status
            if hasattr(payment, 'order_id') and payment.order_id:
                order = payment.order_id
                order.status = 'confirmed'
                order.save()
            
            # Log the event
            PaymentsGatewayLog.objects.create(
                payment_id=payment,
                gateway_response=charge
            )
            
            print(f"Charge for payment {pi_id} succeeded")
            
        except Payments.DoesNotExist:
            print(f"No Payments record found for transaction_id={pi_id}")
        except Exception as e:
            print(f"Error processing charge.succeeded: {e}")

    def handle_charge_updated(self, event):
        """Handle charge.updated event"""
        charge = event["data"]["object"]
        pi_id = charge["payment_intent"]
        charge_status = charge["status"]
        
        try:
            payment = Payments.objects.get(transaction_id=pi_id)
            
            # Map Stripe charge status to your payment status
            if charge_status == "succeeded" and charge["captured"]:
                payment.status = "completed"
                payment.is_successful = True
                payment.completed_at = timezone.now()
                
                # Update related order status
                if hasattr(payment, 'order_id') and payment.order_id:
                    order = payment.order_id
                    order.status = 'confirmed'
                    order.save()
                    
            elif charge_status == "failed":
                payment.status = "failed"
                payment.is_successful = False
                
            elif charge_status == "pending":
                payment.status = "pending"
                
            payment.save()
            
            # Log the event
            PaymentsGatewayLog.objects.create(
                payment_id=payment,
                gateway_response=charge
            )
            
            print(f"Charge updated for payment {pi_id}: {charge_status}")
            
        except Payments.DoesNotExist:
            print(f"No Payments record found for transaction_id={pi_id}")
        except Exception as e:
            print(f"Error processing charge.updated: {e}")

    def handle_payment_failed(self, event):
        """Handle payment_intent.payment_failed event"""
        intent = event["data"]["object"]
        pi_id = intent["id"]
        
        try:
            payment = Payments.objects.get(transaction_id=pi_id)
            payment.status = "failed"
            payment.is_successful = False
            payment.save()
            
            # Update related order status
            if hasattr(payment, 'order_id') and payment.order_id:
                order = payment.order_id
                order.status = 'cancelled'
                order.save()
            
            # Log the event
            PaymentsGatewayLog.objects.create(
                payment_id=payment,
                gateway_response=intent
            )
            
            print(f"Payment {pi_id} failed")
            
        except Payments.DoesNotExist:
            print(f"No Payments record found for transaction_id={pi_id}")
        except Exception as e:
            print(f"Error processing payment failure: {e}")