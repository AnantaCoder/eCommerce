from rest_framework import serializers
from .models import Item, Order, OrderItem, Category


class CategorySerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'is_active', 'item_count', 'created_at']
        read_only_fields = ['id', 'item_count', 'created_at']
    
    def get_item_count(self, obj):
        return obj.items.filter(is_active=True).count()


class ItemSerializer(serializers.ModelSerializer):
    
    total_value = serializers.SerializerMethodField()
    seller_name = serializers.CharField(source='seller.shop_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_in_stock = serializers.ReadOnlyField()  
    
    class Meta:
        model = Item
        fields = [
            'id',
            'item_name',
            'item_type', 
            'manufacturer',
            'category',
            'category_name',
            'quantity',
            'price',
            'sku',
            'description',
            'is_active',
            'total_value',
            'is_in_stock',
            'seller_name',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id', 
            'total_value', 
            'is_in_stock',
            'seller_name',
            'category_name',
            'created_at', 
            'updated_at'
        ]
    
    def get_total_value(self, obj):
        """Calculate total inventory value (quantity × price)."""
        return obj.quantity * obj.price
    
    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value
    
    def create(self, validated_data):
        
        user = self.context['request'].user
        
        if not hasattr(user, 'seller'):
            raise serializers.ValidationError(
                "Only sellers can create items."
            )
        
        if not validated_data.get('sku'):
            import uuid
            validated_data['sku'] = str(uuid.uuid4())[:8].upper()
        
        return Item.objects.create(seller=user.seller, **validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'item_name',
            'item_price', 
            'manufacturer',
            'quantity',
            'original_item',
            'seller'
        ]
        read_only_fields = ['id']


class OrderSerializer(serializers.ModelSerializer):
   
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_email = serializers.CharField(source='buyer.email', read_only=True)
    
    
    '''
    change this to support update and create operations 
    '''
    '''if issue then add a total amount method '''
    
    # def create(self, validated_data):
    # items_data = validated_data.pop('items')
    # order = Order.objects.create(**validated_data)
    # for item_data in items_data:
    #     order_item = OrderItem.objects.create(**item_data)
    #     order.items.add(order_item)
    # return order

    class Meta:
        model = Order
        fields = [
            'id',
            'buyer_email',
            'status',
            'total_amount',
            'items',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id', 
            'buyer_email',
            'total_amount',  
            'items',
            'created_at', 
            'updated_at'
        ]


class CreateOrderSerializer(serializers.Serializer):
   
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        ),
        min_length=1
    )
    
    def validate_items(self, value):
        
        validated_items = []
        
        for item_data in value:
            try:
                item_id = int(item_data.get('item_id'))
                quantity = int(item_data.get('quantity'))
                
                if quantity <= 0:
                    raise serializers.ValidationError(
                        f"Quantity must be positive for item {item_id}."
                    )
                
                item = Item.objects.get(id=item_id, is_active=True)
                
                if item.quantity < quantity:
                    raise serializers.ValidationError(
                        f"Not enough stock for {item.item_name}. "
                        f"Available: {item.quantity}, Requested: {quantity}"
                    )
                
                validated_items.append({
                    'item': item,
                    'quantity': quantity
                })
                
            except (ValueError, TypeError):
                raise serializers.ValidationError("Invalid item data format.")
            except Item.DoesNotExist:
                raise serializers.ValidationError(f"Item with ID {item_id} not found.")
        
        return validated_items
    
    def create(self, validated_data):
        
        user = self.context['request'].user
        items_data = validated_data['items']
        
        total_amount = sum(
            item_data['item'].price * item_data['quantity']
            for item_data in items_data
        )
        
        order = Order.objects.create(
            buyer=user,
            total_amount=total_amount
        )
        
        for item_data in items_data:
            item = item_data['item']
            quantity = item_data['quantity']
            
            order_item = OrderItem.objects.create(
                item_name=item.item_name,
                item_price=item.price,
                manufacturer=item.manufacturer,
                quantity=quantity,
                original_item=item,
                seller=item.seller
            )
            
            order.items.add(order_item)
            
            item.quantity -= quantity
            item.save()
        
        return order