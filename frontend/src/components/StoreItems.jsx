import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  Share2, 
  Zap, 
  Award,
  TrendingUp,
  Shield,
  Truck,
  ArrowRight,
  Plus,
  Minus,
  Tag,
  ArrowLeft
} from 'lucide-react';

// Compact Product Card Component
const CompactProductCard = ({ product, onViewDetails }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const categoryColors = {
    purple: 'from-purple-500 to-purple-700',
    blue: 'from-blue-500 to-blue-700',
    green: 'from-green-500 to-green-700',
    red: 'from-red-500 to-red-700',
    yellow: 'from-yellow-500 to-yellow-700'
  };

  const categoryStyle = categoryColors[product.category.color] || categoryColors.blue;

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    console.log(`Quick add to cart: ${product.name}`);
  };

  return (
    <div 
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 border border-gray-700/50 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-black/40 text-white hover:bg-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Category Badge */}
        <div className={`absolute bottom-3 left-3 bg-gradient-to-r ${categoryStyle} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
          <span>{product.category.icon}</span>
          {product.category.name}
        </div>

        {/* Status Badges */}
        <div className="absolute bottom-3 right-3 flex gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">NEW</span>
          )}
          {product.isBestseller && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">★</span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="text-white font-semibold text-sm line-clamp-2 hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-white text-sm font-medium">{product.rating}</span>
          <span className="text-gray-400 text-xs">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 text-sm line-through">${product.originalPrice}</span>
            )}
          </div>
          
          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`p-2 bg-gradient-to-r ${categoryStyle} text-white rounded-lg hover:opacity-90 transition-all duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-80'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Stock Status */}
        <div className={`text-center py-1 px-2 rounded text-xs font-medium ${
          product.inStock 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>
    </div>
  );
};

// Detailed Product Page Component
const DetailedProductPage = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const categoryColors = {
    purple: {
      bg: 'from-purple-500 to-purple-700',
      text: 'text-purple-300',
      border: 'border-purple-500/30',
      shadow: 'shadow-purple-500/20'
    },
    blue: {
      bg: 'from-blue-500 to-blue-700',
      text: 'text-blue-300',
      border: 'border-blue-500/30',
      shadow: 'shadow-blue-500/20'
    },
    green: {
      bg: 'from-green-500 to-green-700',
      text: 'text-green-300',
      border: 'border-green-500/30',
      shadow: 'shadow-green-500/20'
    },
    red: {
      bg: 'from-red-500 to-red-700',
      text: 'text-red-300',
      border: 'border-red-500/30',
      shadow: 'shadow-red-500/20'
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-700',
      text: 'text-yellow-300',
      border: 'border-yellow-500/30',
      shadow: 'shadow-yellow-500/20'
    }
  };

  const categoryStyle = categoryColors[product.category.color] || categoryColors.blue;

  const handleBuyNow = () => {
    console.log(`Buy Now: ${product.name} - Quantity: ${quantity} - Total: $${(product.price * quantity).toFixed(2)}`);
  };

  const handleAddToCart = () => {
    console.log(`Added to Cart: ${product.name} - Quantity: ${quantity}`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  -{product.discount}% OFF
                </div>
              )}

              {/* Status Badges */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    NEW ARRIVAL
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    BESTSELLER
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Key Features</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryStyle.bg}`}></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Category and Title */}
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${categoryStyle.bg} text-white px-4 py-2 rounded-full font-semibold`}>
                <span className="text-lg">{product.category.icon}</span>
                {product.category.name}
              </div>
              
              <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight">
                {product.name}
              </h1>
              
              <p className="text-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white text-xl font-bold">{product.rating}</span>
                <span className="text-gray-400">({product.reviewCount.toLocaleString()} reviews)</span>
              </div>
            </div>

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-500/30"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Services */}
            <div className="flex flex-wrap gap-4">
              {product.fastDelivery && (
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                  <Truck className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm">Fast Delivery</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-white text-sm">{product.warranty} Warranty</span>
                </div>
              )}
            </div>

            {/* Price and Purchase Section */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 space-y-6">
              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                product.inStock 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium text-lg">Quantity:</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-white font-bold text-xl min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleWishlist}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    isWishlisted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 border border-gray-600"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className={`flex-1 bg-gradient-to-r ${categoryStyle.bg} hover:opacity-90 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 ${categoryStyle.shadow} shadow-lg`}
                >
                  Buy Now
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              {/* Total Price */}
              <div className="pt-4 border-t border-gray-700/50 flex justify-between items-center">
                <span className="text-gray-400 text-lg">Total:</span>
                <span className="text-2xl font-bold text-white">${(product.price * quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const ProductApp = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const sampleProducts = [
    {
      id: 1,
      name: "Ultra Pro Gaming Headset",
      price: 189.99,
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop",
      rating: 4.9,
      reviewCount: 1847,
      category: { name: "Gaming", color: "purple", icon: "🎮" },
      discount: 24,
      inStock: true,
      isNew: true,
      isBestseller: false,
      fastDelivery: true,
      warranty: "2 Year",
      description: "Professional gaming headset with 7.1 surround sound, RGB lighting, and premium comfort for extended gaming sessions.",
      features: ["7.1 Surround Sound", "RGB Lighting", "Noise Cancelling", "Comfortable Padding"],
      badges: ["New Arrival", "Premium Quality"]
    },
    {
      id: 2,
      name: "Smartwatch Pro Max",
      price: 399.99,
      originalPrice: 499.99,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop",
      rating: 4.7,
      reviewCount: 2341,
      category: { name: "Wearables", color: "blue", icon: "⌚" },
      discount: 20,
      inStock: true,
      isNew: false,
      isBestseller: true,
      fastDelivery: true,
      warranty: "1 Year",
      description: "Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration.",
      features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-Day Battery"],
      badges: ["Bestseller", "Editor's Choice"]
    },
    {
      id: 3,
      name: "Wireless Earbuds Elite",
      price: 149.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
      rating: 4.8,
      reviewCount: 3127,
      category: { name: "Audio", color: "green", icon: "🎵" },
      discount: 25,
      inStock: false,
      isNew: false,
      isBestseller: false,
      fastDelivery: false,
      warranty: "1 Year",
      description: "Premium wireless earbuds with active noise cancellation and exceptional sound quality.",
      features: ["Active Noise Cancellation", "30H Battery Life", "Quick Charge", "IPX7 Waterproof"],
      badges: ["Popular Choice"]
    },
    {
      id: 4,
      name: "4K Webcam Pro",
      price: 129.99,
      originalPrice: 179.99,
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=500&fit=crop",
      rating: 4.6,
      reviewCount: 892,
      category: { name: "Tech", color: "red", icon: "📷" },
      discount: 28,
      inStock: true,
      isNew: true,
      isBestseller: false,
      fastDelivery: true,
      warranty: "1 Year",
      description: "Ultra-high definition webcam perfect for streaming, video calls, and content creation.",
      features: ["4K Resolution", "Auto Focus", "Built-in Microphone", "Privacy Shutter"],
      badges: ["New Arrival", "Streamer's Choice"]
    },
    {
      id: 5,
      name: "Mechanical Keyboard RGB",
      price: 89.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
      rating: 4.5,
      reviewCount: 1456,
      category: { name: "Gaming", color: "purple", icon: "⌨️" },
      discount: 31,
      inStock: true,
      isNew: false,
      isBestseller: true,
      fastDelivery: true,
      warranty: "2 Year",
      description: "Premium mechanical keyboard with customizable RGB lighting and tactile switches.",
      features: ["Mechanical Switches", "RGB Backlighting", "Programmable Keys", "Durable Build"],
      badges: ["Bestseller", "Gamer's Choice"]
    },
    {
      id: 6,
      name: "Portable SSD 1TB",
      price: 159.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop",
      rating: 4.9,
      reviewCount: 734,
      category: { name: "Storage", color: "yellow", icon: "💾" },
      discount: 20,
      inStock: true,
      isNew: false,
      isBestseller: false,
      fastDelivery: true,
      warranty: "3 Year",
      description: "Ultra-fast portable SSD with 1TB capacity for all your storage needs.",
      features: ["1TB Capacity", "USB 3.2 Gen 2", "Compact Design", "Password Protection"],
      badges: ["High Performance", "Reliable"]
    }
  ];

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return <DetailedProductPage product={selectedProduct} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            The Store
          </h1>
          
        </div>

        {/* Compact Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map(product => (
            <CompactProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductApp;