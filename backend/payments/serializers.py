from payments.models import Payments,PaymentsGatewayLog
from rest_framework import serializers 
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.conf import settings


class PaymentsSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    seller = serializers.StringRelatedField(read_only=True)
    order = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Payments
        fields = [
            'id',
            'user',
            'seller',
            'order',
            'amount',
            'currency',
            'status',
            'payment_method',
            'payment_gateway',
            'transaction_id',
            'refunded_amount',
            'refund_reference',
            'is_successful',
            'created_at',
            'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'completed_at', 'refunded_amount', 'is_successful']

    
    def validate(self, attrs):
        if attrs.get('amount')<= 0:
            raise ValidationError(_("Amount must be greater than zero."))


class PaymentsGatewayLogSerializer(serializers.ModelSerializer):
    payment = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PaymentsGatewayLog
        fields = [
            'id',
            'payment',
            'gateway_response',
            'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']



