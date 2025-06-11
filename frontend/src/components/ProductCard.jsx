import React from 'react';
import { Heart, ShoppingCart, Star, Eye, Share2, Zap } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 cursor-pointer">
      {product.discount && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          -{product.discount}%
        </div>
      )}

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
        <button className="p-2 rounded-full bg-black/40 text-white hover:bg-red-500 backdrop-blur-md transition-all duration-200">
          <Heart className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-full bg-black/40 text-white hover:bg-blue-500 backdrop-blur-md transition-all duration-200">
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-full bg-black/40 text-white hover:bg-blue-500 backdrop-blur-md transition-all duration-200">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="relative h-36 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <span className="h-2 w-6 bg-blue-500 rounded-full" />
          <span className="h-2 w-2 bg-white/50 rounded-full" />
          <span className="h-2 w-2 bg-white/50 rounded-full" />
        </div>

        <div className="absolute bottom-4 right-4">
          {product.inStock ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              In Stock
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
            {product.category}
          </span>
          {product.fastDelivery && (
            <div className="flex items-center gap-1 text-yellow-400 text-xs">
              <Zap className="w-3 h-3" />
              <span>Fast Delivery</span>
            </div>
          )}
        </div>

        <h3 className="text-white text-xl font-bold leading-tight hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-white font-medium">{product.rating}</span>
          <span className="text-gray-400 text-sm">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">${product.price}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            disabled={!product.inStock}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default ProductCard;
