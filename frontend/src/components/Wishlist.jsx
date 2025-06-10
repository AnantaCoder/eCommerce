import React, { useState, useEffect, memo } from "react";
import { Heart, Trash2, ShoppingCart, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// WishlistItem: represents a single item in the wishlist
const WishlistItem = memo(({ item, onAddToCart, onRemove }) => {
  const handleAddToCart = () => {
    onAddToCart(item);
    toast.success(`Added "${item.name}" to cart!`);
  };

  const handleRemove = () => {
    onRemove(item.id);
    toast("Removed from wishlist", { icon: "🗑️" });
  };

  return (
    <div className="flex items-center gap-4 bg-gray-900/70 shadow-xl rounded-2xl p-5 border border-white/15 backdrop-blur-sm hover:scale-[1.02] transition-all duration-200">
      <img
        src={item.image || "https://via.placeholder.com/96"}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg border border-white/20"
      />
      <div className="flex-1 text-white">
        <h4 className="font-bold text-lg truncate">{item.name}</h4>
        <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleAddToCart}
          className="p-2 bg-blue-600/20 rounded-full hover:bg-blue-600/40 transition-all duration-200"
          title="Add to cart"
          aria-label={`Add ${item.name} to cart`}
        >
          <ShoppingCart className="w-5 h-5 text-blue-400" />
        </button>
        <button
          onClick={handleRemove}
          className="p-2 bg-red-600/20 rounded-full hover:bg-red-600/40 transition-all duration-200"
          title="Remove from wishlist"
          aria-label={`Remove ${item.name} from wishlist`}
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </div>
  );
});

// Main Wishlist component
const Wishlist = ({ initialItems = [], onClose, onAddToCart }) => {
  const [wishlistItems, setWishlistItems] = useState(initialItems);

  const handleRemove = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item) => {
    // Move to cart: invoke parent callback
    onAddToCart(item);
    // Remove from wishlist
    handleRemove(item.id);
  };

  return (
    <div className=" inset-0 z-50 flex flex-col bg-gray-900/90 backdrop-blur-xl p-6 sm:p-8 overflow-hidden animate-slide-in-right">
      <Toaster position="bottom-center" />
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
        <h2 className="text-white font-extrabold text-3xl sm:text-4xl flex items-center gap-4">
          <Heart className="w-8 h-8 text-pink-500" /> My Wishlist
        </h2>
        <button
          onClick={onClose}
          className="p-3 hover:bg-white/15 rounded-full transition-all duration-200"
          title="Close wishlist"
          aria-label="Close wishlist"
        >
          <X className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-3 custom-scroll mb-8">
        {wishlistItems.length === 0 ? (
          <p className="text-gray-400 text-lg text-center mt-10">
            Your wishlist is empty.
          </p>
        ) : (
          wishlistItems.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
