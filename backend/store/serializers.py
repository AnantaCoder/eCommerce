from rest_framework import serializers
from store.models import Item, Order, OrderItem,Feedback, Category,CartItem,WishlistItem , OrderAddress,Review
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
        return obj.items.count()
    


class ItemSerializer(serializers.ModelSerializer):
    
    total_value = serializers.SerializerMethodField()
    seller_name = serializers.CharField(source='seller.shop_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_in_stock = serializers.ReadOnlyField()  
    avg_rating = serializers.FloatField(read_only=True)
    
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
            'avg_rating',
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
            'avg_rating',
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
        validated_data.pop('seller', None)
        validated_data.pop('seller_id', None)

        image_files = validated_data.pop('image_files', [])
        
        if image_files:
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
            
            validated_data['image_urls'] = uploaded_image_urls
        
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




class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), source='item', write_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id', 'item', 'item_id', 'quantity', 'price', 'total_price', 'added_at']

    def get_total_price(self, obj):
        return obj.quantity * obj.price

    def create(self, validated_data):
        item = validated_data['item']
        validated_data['price'] = item.price  # snapshot price from Item
        return super().create(validated_data)

    def update(self, instance, validated_data):
        #prevent price change 
        validated_data.pop('price', None)
        return super().update(instance, validated_data)





class WishlistItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), source='item', write_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'item', 'item_id', 'added_at']
        
        

class OrderAddressSerializer(serializers.ModelSerializer):
    def validate_phone_number(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return value

    class Meta:
        model = OrderAddress
        fields = ['phone_number', 'shipping_address', 'country', 'city']
        
        
class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    item_name = serializers.CharField(source='item.item_name',read_only=True)
    class Meta :
        model = Review
        fields = ['id', 'item','item_name', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'user_name','item_name', 'created_at']
    def validate_rating(self,value):
        if not (1<=value<=5):
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value 
    def create(self,validated_data):
        request = self.context['request']
        validated_data['user'] = request.user
        return super().create(validated_data)
    
    
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        
        
        
        
        
'''
# THIS FOR ITEM SERIALIZER 
| Feature                        | What it Does                                     |
| ------------------------------ | ------------------------------------------------ |
| `total_value`                  | Calculates `price * quantity` automatically      |
| `seller_name`, `category_name` | Shows related data without extra effort          |
| `image_files`                  | Lets users upload images                         |
| `image_urls`                   | Stores + returns public image URLs from Supabase |
| `create()`                     | Validates seller, uploads images, saves item     |
| `update()`                     | Optionally adds new images, updates fields       |
| Validations                    | Makes sure price and quantity are reasonable     |


'''