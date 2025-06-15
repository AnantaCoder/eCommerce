from rest_framework import serializers
from .models import Item, Order, OrderItem, Category,CartItem,WishlistItem
from django.conf import settings 
from supabase import create_client, Client 
import os 
import uuid 
import random

supabase_client: Client = None
SUPABASE_BUCKET_NAME = None

try:
    if settings.SUPABASE_URL and settings.SUPABASE_KEY and settings.SUPABASE_BUCKET_NAME:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        SUPABASE_BUCKET_NAME = settings.SUPABASE_BUCKET_NAME
    else:
        print("Supabase settings (URL, Key, or Bucket Name) are not fully configured in settings.py.")
except AttributeError as e:
    print(f"Warning: Supabase settings not fully loaded. Ensure .env and settings.py are correct. Error: {e}")
except Exception as e:
    print(f"Error initializing Supabase client: {e}")


class CategorySerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()
    # discount = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = [
            'id', 
            'name', 
            'description', 
            'is_active', 
            'item_count',
            'discount', 
            'created_at',
            'image',
            'icon',
            'color',
            'popular_brands'
            ]
        read_only_fields = ['id', 'item_count', 'created_at']
    
    def get_item_count(self, obj):
        return obj.items.filter(is_active=True).count()
    # def get_discount(self,obj):
    #     return random.randint(20,50)


class ItemSerializer(serializers.ModelSerializer):
    
    total_value = serializers.SerializerMethodField()
    seller_name = serializers.CharField(source='seller.shop_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_in_stock = serializers.ReadOnlyField()  
    
    
    image_files = serializers.ListField(
        child=serializers.ImageField(), 
        allow_empty=True, 
        required=False,
        write_only=True 
    )
    # This field will be used for output, displaying the stored URLs
    image_urls = serializers.ListField(
        child=serializers.URLField(), 
        allow_empty=True, 
        read_only=True
    )
    
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
            'image_urls',   # For displaying stored URLs
            'image_files',  # For uploading files (input only)
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
        
        #popping both seller and seller id to get rid of multiple values error 
        validated_data.pop('seller', None) 
        validated_data.pop('seller_id', None) 

        if not validated_data.get('sku'):
            validated_data['sku'] = str(uuid.uuid4())[:8].upper()
        
        # Extract image_files from validated_data
        image_files = validated_data.pop('image_files', [])
        
        uploaded_image_urls = []
        if supabase_client and SUPABASE_BUCKET_NAME:
            for image_file in image_files:
                #unique na\me
                file_extension = os.path.splitext(image_file.name)[1]
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                
                try:
                    
                    upload_response = supabase_client.storage.from_(SUPABASE_BUCKET_NAME).upload(
                        unique_filename, 
                        image_file.read(), 
                        {"content-type": image_file.content_type}
                    )

                    if upload_response and hasattr(upload_response, 'path') and upload_response.path:
                        public_url = supabase_client.storage.from_(SUPABASE_BUCKET_NAME).get_public_url(unique_filename)
                        if public_url:
                            uploaded_image_urls.append(public_url)
                        else:
                            print(f"Error getting public URL for {unique_filename}: {public_url}")
                    else:
                        print(f"Error uploading image {unique_filename}: {upload_response}")

                except Exception as e:
                    print(f"An error occurred during Supabase upload for {image_file.name}: {e}")
                    raise serializers.ValidationError(f"Image upload failed for {image_file.name}: {e}")
        else:
            print("Supabase client not initialized or bucket name missing. Image uploads will be skipped.")

        # Assign the list of uploaded URLs to the model's image_urls field
        validated_data['image_urls'] = uploaded_image_urls
        
        return Item.objects.create(seller=user.seller, **validated_data)

    def update(self, instance, validated_data):
        # Ensure 'seller' or 'seller_id' is not in validated_data during update as well
        validated_data.pop('seller', None)
        validated_data.pop('seller_id', None)

        image_files = validated_data.pop('image_files', [])
        
        # If new image files are provided, upload them and update image_urls
        if image_files:
            # Start with existing URLs to append new ones
            uploaded_image_urls = list(instance.image_urls) if instance.image_urls else [] 
            if supabase_client and SUPABASE_BUCKET_NAME:
                for image_file in image_files:
                    file_extension = os.path.splitext(image_file.name)[1]
                    unique_filename = f"{uuid.uuid4()}{file_extension}"
                    try:
                        upload_response = supabase_client.storage.from_(SUPABASE_BUCKET_NAME).upload(
                            unique_filename, 
                            image_file.read(),
                            {"content-type": image_file.content_type}
                        )
                        if upload_response and hasattr(upload_response, 'path') and upload_response.path:
                            public_url = supabase_client.storage.from_(SUPABASE_BUCKET_NAME).get_public_url(unique_filename)
                            if public_url:
                                uploaded_image_urls.append(public_url)
                            else:
                                print(f"Error getting public URL for {unique_filename} during update: {public_url}")
                        else:
                            print(f"Error uploading image {unique_filename} during update: {upload_response}")
                    except Exception as e:
                        print(f"An error occurred during Supabase upload for {image_file.name} (update): {e}")
                        raise serializers.ValidationError(f"Image upload failed for {image_file.name} during update: {e}")
            else:
                print("Supabase client not initialized during update. Image uploads will be skipped.")
                # Optionally raise an error
            
            validated_data['image_urls'] = uploaded_image_urls
        
        # Call super to handle updating other fields
        return super().update(instance, validated_data)


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



# store/serializers.py

class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), source='item', write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'item', 'item_id', 'quantity', 'added_at']

class WishlistItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), source='item', write_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'item', 'item_id', 'added_at']