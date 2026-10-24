import { Heart, ShoppingCart, Star, Eye, Share2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openLoginModal } from '../features/auth/authSlice';
import { addToCart as addToCartAction, deleteAllCart, fetchCartItems } from '../features/cart/cartSlice';
import { addToWishlist as addToWishlistAction } from '../features/wishlist/wishlistSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product, addToCart, addToWishlist, buyNow }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Map API response to component props
  const mappedProduct = {
    id: product.id,
    name: product.item_name,
    category: product.category_name,
    description: product.description,
    price: parseFloat(product.price),
    image: product.image_urls?.[0] || 'https://images.unsplash.com/photo-1735812030252-2e292cdb4d7c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    inStock: product.is_in_stock,
    manufacturer: product.manufacturer,
    sku: product.sku,
    seller: product.seller_name,
    quantity: product.quantity,
    // Default values for missing fields
    rating: 4.5,
    reviewCount: 128,
    fastDelivery: true,
    discount: null,
    originalPrice: null
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      dispatch(openLoginModal("Please sign in to save items to your wishlist."));
      return;
    }
    if (addToWishlist) {
      addToWishlist(mappedProduct.id);
    } else {
      dispatch(addToWishlistAction({ itemId: mappedProduct.id }));
    }
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      dispatch(openLoginModal("Please sign in to add items to your shopping cart."));
      return;
    }
    if (addToCart) {
      addToCart(mappedProduct);
    } else {
      dispatch(addToCartAction({ itemId: mappedProduct.id, quantity: 1 }));
    }
  };

  const handleBuyClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      dispatch(openLoginModal("Please sign in to purchase this product and checkout."));
      return;
    }
    try {
      if (buyNow) {
        await buyNow(mappedProduct);
      } else {
        await dispatch(deleteAllCart()).unwrap();
        await dispatch(addToCartAction({ itemId: mappedProduct.id, quantity: 1 }));
        await dispatch(fetchCartItems()).unwrap();
        navigate("/checkout");
      }
    } catch (err) {
      toast.error("Could not start Buy Now: " + (err.message || err));
    }
  };

  return (
    <div className="group relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-200 hover:scale-[1.03] active:scale-[0.99] hover:shadow-blue-500/20 ">
      {mappedProduct.discount && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          -{mappedProduct.discount}%
        </div>
      )}

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
        <button 
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
          className="p-2.5 rounded-full bg-black/60 text-white hover:bg-red-500 active:scale-90 active:bg-red-600 backdrop-blur-md transition-all duration-150 cursor-pointer shadow-lg"
        >
          <Heart className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-full bg-black/40 text-white hover:bg-blue-500 backdrop-blur-md transition-all duration-200"
      onClick={()=>navigate(`/product/${product.id}`)}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-full bg-black/40 text-white hover:bg-blue-500 backdrop-blur-md transition-all duration-200">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="relative h-36 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <img
          src={mappedProduct.image}
          alt={mappedProduct.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <span className="h-2 w-6 bg-blue-500 rounded-full" />
          <span className="h-2 w-2 bg-white/50 rounded-full" />
          <span className="h-2 w-2 bg-white/50 rounded-full" />
        </div>

        <div className="absolute bottom-4 right-4">
          {mappedProduct.inStock ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              In Stock ({mappedProduct.quantity})
            </span>
          ) : (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-blue-400 text-sm font-medium uppercase tracking-wide">
            {mappedProduct.category}
          </span>
          {mappedProduct.fastDelivery && (
            <div className="flex items-center gap-1 text-yellow-400 text-xs">
              <Zap className="w-3 h-3" />
              <span>Fast Delivery</span>
            </div>
          )}
        </div>

        <div className="space-y-1"
      onClick={()=>navigate(`/product/${product.id}`)}
        
        >
          <h3 className="text-white text-xl font-bold leading-tight hover:text-blue-400 transition-colors">
            {mappedProduct.name}
          </h3>
          <p className="text-gray-500 text-xs">
            by {mappedProduct.manufacturer} • SKU: {mappedProduct.sku}
          </p>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2">{mappedProduct.description}</p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(mappedProduct.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-white font-medium">{mappedProduct.rating}</span>
          <span className="text-gray-400 text-sm">({mappedProduct.reviewCount})</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">₹{mappedProduct.price.toLocaleString('en-IN')}</span>
          {mappedProduct.originalPrice && (
            <span className="text-lg text-gray-500 line-through">₹{mappedProduct.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Sold by {mappedProduct.seller}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            disabled={!mappedProduct.inStock}
            onClick={handleCartClick}
            className="flex-1 bg-gray-800 hover:bg-gray-700 active:scale-95 active:shadow-inner text-white font-semibold py-2.5 px-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg border border-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <ShoppingCart className="w-4 h-4 text-purple-400" />
            <span className="text-xs">Add to Cart</span>
          </button>
          <button
            disabled={!mappedProduct.inStock}
            onClick={handleBuyClick}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 active:shadow-inner text-white font-semibold py-2.5 px-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md hover:shadow-emerald-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-xs">Buy Now</span>
          </button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export  default ProductCard