import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye, Share2, Zap } from 'lucide-react';

const ProductCard = ({ 
  product = {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 2847,
    category: "Electronics",
    discount: 25,
    inStock: true,
    fastDelivery: true,
    description: "High-quality wireless headphones with noise cancellation and premium sound quality."
  }
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample additional images
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop"
  ];

  const handleBuyNow = () => {
    console.log(`Purchasing ${product.name} for $${product.price}`);
    // Your buy logic here
  };

  const handleAddToCart = () => {
    console.log(`Added ${product.name} to cart`);
    // Your add to cart logic here
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log(`${isWishlisted ? 'Removed from' : 'Added to'} wishlist: ${product.name}`);
  };

  const handleQuickView = () => {
    console.log(`Quick view for ${product.name}`);
    // Your quick view logic here
  };

  const handleShare = () => {
    console.log(`Sharing ${product.name}`);
    // Your share logic here
  };

  return (
    <div 
      className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          -{product.discount}%
        </div>
      )}

      {/* Action Buttons */}
      <div className={`absolute top-4 right-4 z-20 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <button
          onClick={handleWishlist}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isWishlisted 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-black/40 text-white hover:bg-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={handleQuickView}
          className="p-2 rounded-full bg-black/40 text-white hover:bg-blue-500 backdrop-blur-md transition-all duration-200"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={handleShare}
          className="p-2 rounded-full bg-black/40 text-white hover:bg-blue-500 backdrop-blur-md transition-all duration-200"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <img
          src={productImages[selectedImage]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {productImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                selectedImage === index 
                  ? 'bg-blue-500 w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Stock Status */}
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

      {/* Product Details */}
      <div className="p-6 space-y-4">
        {/* Category & Fast Delivery */}
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

        {/* Product Name */}
        <h3 className="text-white text-xl font-bold leading-tight hover:text-blue-400 transition-colors cursor-pointer">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
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
          <span className="text-gray-400 text-sm">({product.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">${product.price}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div className={`absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

// Example usage with multiple cards
const ProductGrid = () => {
  const sampleProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.8,
      reviewCount: 2847,
      category: "Electronics",
      discount: 25,
      inStock: true,
      fastDelivery: true,
      description: "High-quality wireless headphones with noise cancellation and premium sound quality."
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 199.99,
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.6,
      reviewCount: 1203,
      category: "Wearables",
      discount: 20,
      inStock: true,
      fastDelivery: false,
      description: "Advanced fitness tracking with heart rate monitoring and GPS capabilities."
    },
    {
      id: 3,
      name: "Mechanical Gaming Keyboard",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
      rating: 4.9,
      reviewCount: 856,
      category: "Gaming",
      inStock: false,
      fastDelivery: true,
      description: "RGB backlit mechanical keyboard with custom switches for gaming enthusiasts."
    }
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Explore Latest Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;