import React, { useState } from 'react';
import { 
  Smartphone, 
  Headphones, 
  Gamepad2, 
  Watch, 
  Camera, 
  Laptop, 
  Home, 
  Car, 
  Shirt, 
  Book, 
  Dumbbell, 
  Heart,
  ChevronRight,
  TrendingUp,
  Star,
  Users
} from 'lucide-react';

const CategoryCard = ({ 
  category = {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets and tech",
    icon: "Smartphone",
    productCount: 1250,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
    trending: true,
    discount: "Up to 40% off",
    popularBrands: ["Apple", "Samsung", "Sony"],
    color: "blue"
  }
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Icon mapping
  const iconMap = {
    Smartphone,
    Headphones,
    Gamepad2,
    Watch,
    Camera,
    Laptop,
    Home,
    Car,
    Shirt,
    Book,
    Dumbbell,
    Heart
  };

  const IconComponent = iconMap[category.icon] || Smartphone;

  // Color schemes
  const colorSchemes = {
    blue: {
      gradient: 'from-blue-600 to-blue-800',
      accent: 'text-blue-400',
      border: 'border-blue-500/20',
      shadow: 'hover:shadow-blue-500/25'
    },
    purple: {
      gradient: 'from-purple-600 to-purple-800',
      accent: 'text-purple-400',
      border: 'border-purple-500/20',
      shadow: 'hover:shadow-purple-500/25'
    },
    green: {
      gradient: 'from-green-600 to-green-800',
      accent: 'text-green-400',
      border: 'border-green-500/20',
      shadow: 'hover:shadow-green-500/25'
    },
    red: {
      gradient: 'from-red-600 to-red-800',
      accent: 'text-red-400',
      border: 'border-red-500/20',
      shadow: 'hover:shadow-red-500/25'
    },
    yellow: {
      gradient: 'from-yellow-600 to-yellow-800',
      accent: 'text-yellow-400',
      border: 'border-yellow-500/20',
      shadow: 'hover:shadow-yellow-500/25'
    },
    pink: {
      gradient: 'from-pink-600 to-pink-800',
      accent: 'text-pink-400',
      border: 'border-pink-500/20',
      shadow: 'hover:shadow-pink-500/25'
    }
  };

  const colors = colorSchemes[category.color] || colorSchemes.blue;

  const handleCategoryClick = () => {
    console.log(`Navigating to category: ${category.name}`);
    // Your navigation logic here
  };

  return (
    <div 
      className={`relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${colors.shadow} cursor-pointer border ${colors.border}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCategoryClick}
    >
      {/* Trending Badge */}
      {category.trending && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Trending
        </div>
      )}

      {/* Discount Badge */}
      {category.discount && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {category.discount}
        </div>
      )}

      {/* Background Image with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-80`} />
        
        {/* Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 ${isHovered ? 'scale-110 bg-white/20' : ''}`}>
            <IconComponent className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      {/* Category Details */}
      <div className="p-6 space-y-4">
        {/* Category Name */}
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-bold">
            {category.name}
          </h3>
          <ChevronRight className={`w-6 h-6 text-gray-400 transition-all duration-300 ${isHovered ? 'translate-x-1 text-white' : ''}`} />
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm">
          {category.description}
        </p>

        {/* Product Count */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">
            {category.productCount.toLocaleString()} products
          </span>
        </div>

        {/* Popular Brands */}
        {category.popularBrands && category.popularBrands.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300 text-sm font-medium">Popular Brands</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.popularBrands.slice(0, 3).map((brand, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 bg-gray-800 ${colors.accent} text-xs rounded-full border ${colors.border}`}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2`}
        >
          Explore {category.name}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hover Overlay Effect */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

// Category Grid Component
const CategoryGrid = () => {
  const sampleCategories = [
    {
      id: 1,
      name: "Electronics",
      description: "Latest gadgets and tech innovations",
      icon: "Smartphone",
      productCount: 1250,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
      trending: true,
      discount: "Up to 40% off",
      popularBrands: ["Apple", "Samsung", "Sony"],
      color: "blue"
    },
    {
      id: 2,
      name: "Gaming",
      description: "Gaming gear and accessories",
      icon: "Gamepad2",
      productCount: 850,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
      trending: true,
      discount: "Up to 60% off",
      popularBrands: ["PlayStation", "Xbox", "Nintendo"],
      color: "purple"
    },
    {
      id: 3,
      name: "Fashion",
      description: "Trendy clothing and accessories",
      icon: "Shirt",
      productCount: 2100,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
      trending: false,
      discount: "Up to 50% off",
      popularBrands: ["Nike", "Adidas", "Zara"],
      color: "pink"
    },
    {
      id: 4,
      name: "Home & Garden",
      description: "Everything for your home",
      icon: "Home",
      productCount: 950,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      trending: false,
      discount: "Up to 35% off",
      popularBrands: ["IKEA", "HomeDepot", "Wayfair"],
      color: "green"
    },
    {
      id: 5,
      name: "Sports & Fitness",
      description: "Gear up for your active lifestyle",
      icon: "Dumbbell",
      productCount: 680,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      trending: true,
      discount: "Up to 45% off",
      popularBrands: ["Nike", "Under Armour", "Reebok"],
      color: "red"
    },
    {
      id: 6,
      name: "Books & Media",
      description: "Knowledge and entertainment",
      icon: "Book",
      productCount: 1500,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      trending: false,
      discount: "Up to 30% off",
      popularBrands: ["Kindle", "Audible", "Penguin"],
      color: "yellow"
    }
  ];

//   const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Shop by Category
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover amazing products across all our categories with exclusive deals and trending items
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCategories.map(category => (
            <CategoryCard 
              key={category.id} 
              category={category}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">8,000+</div>
              <div className="text-gray-400">Total Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">500+</div>
              <div className="text-gray-400">Brands</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">50+</div>
              <div className="text-gray-400">Categories</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-400">4.8★</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;