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
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()

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

  // Fallback dummy values
  const fallbackIcon = 'Smartphone';
  const fallbackColor = "pink";
  const fallbackImage = 'https://www.lovepanky.com/wp-content/uploads/2021/01/how-to-look-sexy.jpg';
  const fallbackBrands = ['Sony', 'Samsung', 'Apple'];

  const IconComponent = iconMap[category.icon || fallbackIcon] || Smartphone;

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

  const colors = colorSchemes[category.color || fallbackColor];

  // Mapped Category with Fallbacks
  const mappedCategory = {
    id: category.id,
    name: category.name,
    description: category.description || 'Explore the best in this category.',
    itemCount: category.item_count || 0,
    isActive: category.is_active,
    productCount: category.productCount ?? category.item_count ?? 0,

    //dummy starts 
    trending: category.trending ?? true,
    discount: category.discount ?? (Math.floor(Math.random() * 41) + 10) + '% OFF',
    image: category.image || fallbackImage,
    icon: category.icon || fallbackIcon,
    color: category.color || fallbackColor,
    popularBrands: category.popular_brands || fallbackBrands
  };

  return (
    <div
      className={`relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${colors.shadow} cursor-pointer border ${colors.border}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
        onClick={()=>navigate(`/store?category=${mappedCategory.id}`)}

    >
      {mappedCategory.trending && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Trending
        </div>
      )}

      {mappedCategory.discount && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {mappedCategory.discount}
        </div>
      )}

      <div className="relative h-36 overflow-hidden">
        <img
          src={mappedCategory.image}
          alt={mappedCategory.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-80`} />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 ${isHovered ? 'scale-110 bg-white/20' : ''}`}>
            <IconComponent className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-bold">
            {mappedCategory.name}
          </h3>
          <ChevronRight className={`w-6 h-6 text-gray-400 transition-all duration-300 ${isHovered ? 'translate-x-1 text-white' : ''}`} />
        </div>

        <p className="text-gray-400 text-sm">
          {mappedCategory.description}
        </p>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">
            {mappedCategory.productCount.toLocaleString()} products
          </span>
        </div>

        {mappedCategory.popularBrands.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300 text-sm font-medium">Popular Brands</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {mappedCategory.popularBrands.slice(0, 3).map((brand, index) => (
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

        <button
          className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2`}
        >
          Explore {mappedCategory.name}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default CategoryCard;
