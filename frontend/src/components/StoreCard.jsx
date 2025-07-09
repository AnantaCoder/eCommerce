import React, { useState } from "react";
import { Star, Truck, ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StoreCard = ({ product ,  addWishlist,addToCart,buyNow}) => {
  const formatPrice = (price) =>
    `₹${parseFloat(price).toLocaleString("en-IN")}`;
  const formatRating = (rating) => rating.toFixed(1);
  const mappedProduct = {
    id: product.id,
    name: product.item_name,
    category: product.category_name,
    description: product.description,
    price: parseFloat(product.price),
    image:
      product.image_urls?.[0] ||
      "https://images.unsplash.com/photo-1735812030252-2e292cdb4d7c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    inStock: product.is_in_stock,
    manufacturer: product.manufacturer,
    sku: product.sku,
    seller: product.seller_name,
    quantity: product.quantity,
    itemType: product.item_type,
    totalValue: product.total_value,
    isActive: product.is_active,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    // Default values for missing fields
    rating: 4.5,
    reviewCount: 128,
    fastDelivery: true,
    discount: null,
    originalPrice: null,
  };
  // wishlist adder functionality
 const navigate = useNavigate()
 const [onClicked,setOnClicked] = useState(false)

  return (
    <div className="group relative bg-gray-900/95 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-black/40 transition-all duration-500 hover:-translate-y-2 max-w-lg border border-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 pointer-events-none" />

      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <img
          src={mappedProduct.image}
          alt={mappedProduct.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {mappedProduct.discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl backdrop-blur-sm">
              -{mappedProduct.discount}% OFF
            </div>
          )}
          {mappedProduct.fastDelivery && (
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-gray-900 p-2 rounded-full shadow-xl backdrop-blur-sm">
              <Truck size={14} />
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
        onClick={()=>addWishlist(mappedProduct.id)}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-gray-700 transition-all duration-300 hover:scale-110 border border-gray-700/50"
        >
          <Heart
            size={16}
            className="text-gray-300 hover:text-red-400 transition-colors"
          />
        </button>

        {/* Category Tag */}
        <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700/50">
          <span className="text-xs font-medium text-gray-200 uppercase tracking-wider">
            {mappedProduct.category}
          </span>
        </div>
      </div>

      <div className="p-6 relative "
      
      
      >
      
        <h3 className="font-bold text-white text-xl mb-2 leading-tight cursor-pointer"onClick={()=>navigate(`/product/${product.id}`)}>
          {mappedProduct.name}
        </h3>

        <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
          {mappedProduct.description}
        </p>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1.5 rounded-full border border-yellow-500/30">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-300">
              {formatRating(mappedProduct.rating)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {mappedProduct.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold text-white tracking-tight">
            {formatPrice(mappedProduct.price)}
          </span>
          {mappedProduct.originalPrice &&
            mappedProduct.originalPrice > mappedProduct.price && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(mappedProduct.originalPrice)}
              </span>
            )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              mappedProduct.inStock ? "bg-emerald-400" : "bg-red-400"
            } shadow-sm`}
          />
          <span
            className={`text-sm font-medium ${
              mappedProduct.inStock ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {mappedProduct.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            disabled={!mappedProduct.inStock}
            onClick={() => addToCart(mappedProduct)}

            className={`group/btn flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              mappedProduct.inStock
                ? "bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
            }`}
          >
            <ShoppingCart
              size={16}
              className="transition-transform group-hover/btn:scale-110"
            />
            Add to Cart
          </button>

          {/* Purchase Button */}
          <button
            disabled={!mappedProduct.inStock ||onClicked}
            onClick={()=>{
              setOnClicked(true)
              buyNow(mappedProduct)
            }}
            className={`group/btn flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              mappedProduct.inStock
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
            }`}
          >
            <span className="text-lg">⚡</span>
            Buy Now
          </button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </div>
  );
};


export default StoreCard;
