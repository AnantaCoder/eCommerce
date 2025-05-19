from rest_framework import serializers
from .models import Item, Order

class ItemSerializer(serializers.ModelSerializer):
    # Expose “total_value” as quantity * price
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            "id",
            "item_name",
            "item_type",
            "manufacturer",
            "quantity",
            "price",
            "total_value",      
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_total_value(self, obj):
        return obj.quantity * obj.price


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'item', 'quantity', 'purchased_at']
        read_only_fields = ['id', 'purchased_at']

    def create(self, validated_data):
        user = self.context['request'].user
        item = validated_data['item']
        qty  = validated_data['quantity']
        if item.quantity < qty:
            raise serializers.ValidationError("Not enough stock.")
        item.quantity -= qty
        item.save()
        return Order.objects.create(buyer=user, **validated_data)