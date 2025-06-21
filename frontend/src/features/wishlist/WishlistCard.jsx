import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromWishlist } from './wishlistSlice';
import { X, Heart } from 'lucide-react';

const WishlistCard = ({ wishlist }) => {
  const dispatch = useDispatch();
  const { id, item } = wishlist; 

  const handleRemove = () => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 flex flex-col hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-700 group overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Heart icon in top left */}
      <div className="absolute top-3 left-3 text-pink-400 opacity-70">
        <Heart className="w-5 h-5 fill-current" />
      </div>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full p-1 transition-all duration-200 z-10"
        title="Remove from wishlist"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Image container with enhanced styling */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img
          src={item.image_urls?.[0] || '/placeholder.jpg'}
          alt={item.item_name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors duration-200">
          {item.item_name}
        </h3>
        
        <p className="text-slate-300 text-sm mb-3 opacity-80">
          {item.manufacturer}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            ₹{item.price}
          </p>
          
          {/* Premium badge effect */}
          <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
            <span className="text-blue-300 text-xs font-medium">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </div>
  );
};

export default WishlistCard;