
import React from 'react';
import { Star, Truck, ShoppingCart, Heart } from 'lucide-react';

const StoreCard = ({ product }) => {
  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const formatRating = (rating) => rating.toFixed(1);

  return (
    <div className="group relative bg-gray-900/95 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-black/40 transition-all duration-500 hover:-translate-y-2 max-w-lg border border-gray-800/50">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 pointer-events-none" />
      
      {/* Image Container */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
        />
        
        {/* Dark overlay on image */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl backdrop-blur-sm">
              -{product.discount}% OFF
            </div>
          )}
          {product.fastDelivery && (
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-gray-900 p-2 rounded-full shadow-xl backdrop-blur-sm">
              <Truck size={14} />
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-gray-700 transition-all duration-300 hover:scale-110 border border-gray-700/50">
          <Heart size={16} className="text-gray-300 hover:text-red-400 transition-colors" />
        </button>

        {/* Category Tag */}
        <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700/50">
          <span className="text-xs font-medium text-gray-200 uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Title */}
        <h3 className="font-bold text-white text-xl mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1.5 rounded-full border border-yellow-500/30">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-300">
              {formatRating(product.rating)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {product.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold text-white tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-red-400'} shadow-sm`} />
            <span className={`text-sm font-medium ${product.inStock ? 'text-emerald-300' : 'text-red-300'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            disabled={!product.inStock}
            className={`group/btn flex items-center gap-2.5 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              product.inStock 
                ? 'bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white shadow-lg hover:shadow-xl hover:scale-105' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
            }`}
          >
            <ShoppingCart size={16} className="transition-transform group-hover/btn:scale-110" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </div>
  );
};
export default StoreCard