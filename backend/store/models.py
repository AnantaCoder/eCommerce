from django.db import models
from django.conf import settings
from accounts.models import Seller

# Create your models here.


class Category(models.Model):
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name
class Item(models.Model):
    seller = models.ForeignKey(
        Seller,
        on_delete=models.CASCADE,
        related_name='items'
    )
    item_name    = models.CharField(max_length=200,db_index=True)
    item_type    = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=200)
    
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='items'
    )
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    
    sku = models.CharField(max_length=100, unique=True, blank=True)  
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        # Composite indexes for common query patterns 
        indexes = [
            models.Index(fields=['seller', 'is_active']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['item_name', 'is_active']),
        ]
    def __str__(self):
        return f"{self.item_name}({self.manufacturer})"
    
    @property
    def is_in_stock(self):
        return self.quantity>0
    

class OrderItem(models.Model):
    
    
    item_name = models.CharField(max_length=200)
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturer = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField()
    
    
    original_item = models.ForeignKey(
        Item, 
        on_delete=models.SET_NULL, 
        null=True,  # Allow null if item is deleted
        related_name='order_items'
    )
    seller = models.ForeignKey(Seller, on_delete=models.PROTECT) #PROTECT SELLER DATA 


class Order(models.Model):
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    items = models.ManyToManyField(OrderItem, related_name='orders')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['buyer', 'status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Order #{self.id} - {self.buyer.email}"

'''A Stock Keeping Unit (SKU) is a unique alphanumeric code used by businesses to track and manage their inventory. It's essentially a product's identifier within a company's system. SKUs are used to identify specific products, including variations like size, color, or model, and help with internal stock management'''