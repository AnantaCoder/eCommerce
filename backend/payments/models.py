from django.db import models
from accounts.models import User,Seller
from store.models import Order
# Create your models here.

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('wallet', 'Wallet'),
        ('netbanking', 'NetBanking'),
        ('cod', 'Cash on Delivery'),
        ('other', 'Other'),
    ]

    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    seller_id = models.ForeignKey(
        Seller,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    order_id =  models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='other')
    payment_gateway = models.CharField(max_length=100)
    transaction_id = models.CharField(max_length=100, unique=True)
    refunded_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refund_reference = models.CharField(max_length=100, null=True, blank=True)
    is_successful = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_id} - {self.status}"

    
class PaymentGatewayLog(models.Model):
        payment_id = models.ForeignKey(
            Payment,
            on_delete = models.CASCADE,
            related_name = 'gateway_logs'
        )
        gateway_response = models.JSONField()
        timestamp = models.DateTimeField(auto_now_add=True)
        
        def __str__(self):
             return f"Log for {self.payment_id.transaction_id} at {self.timestamp}"
        
        