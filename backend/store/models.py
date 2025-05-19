from django.db import models
from django.conf import settings

# Create your models here.

class Item(models.Model):
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='items',
        null=True,
        blank=True,
    )
    item_name    = models.CharField(max_length=200)
    item_type    = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=200)
    quantity     = models.IntegerField()
    price        = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.item_name}({self.manufacturer})"
    

# this is an additional model for billing records to the seller 
class Order(models.Model):
    buyer     = models.ForeignKey(
                    settings.AUTH_USER_MODEL,
                    on_delete=models.CASCADE,
                    related_name='orders'
                )
    item      = models.ForeignKey(Item, on_delete=models.PROTECT)
    quantity  = models.PositiveIntegerField(default=1)
    purchased_at = models.DateTimeField(auto_now_add=True)
