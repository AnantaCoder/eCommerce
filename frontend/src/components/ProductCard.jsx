
import React from 'react';
import { Heart, ShoppingCart, Star, Eye, Share2, Zap } from 'lucide-react';

const ProductCard = ({ product }) => {
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

  return (
    <div className="group relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 cursor-pointer">
      {mappedProduct.discount && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          -{mappedProduct.discount}%
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

        <div className="space-y-1">
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

        <div className="flex gap-3 pt-2">
          <button
            disabled={!mappedProduct.inStock}
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

export  default ProductCard