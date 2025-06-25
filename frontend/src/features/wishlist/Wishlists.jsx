import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistItems,
  selectWishlistItems,
  // selectWishlistLoading,
  selectWishlistError,
  removeFromWishlist,
} from "./wishlistSlice";
import { Heart } from "lucide-react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import WishlistCard from "../../components/WishlistCard";
import { addToCart } from "../cart/cartSlice";

export default function Wishlists() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  // const loading = useSelector(selectWishlistLoading);
  const error = useSelector(selectWishlistError);

  const prevItems = useRef(items);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong");
    }
  }, [error]);

  // Success toast for remove/add to wishlist
  useEffect(() => {
    if (prevItems.current.length > items.length) {
      toast.success("Item removed from wishlist!");
    }
    if (prevItems.current.length < items.length) {
      toast.success("Item added to wishlist!");
    }
    prevItems.current = items;
  }, [items]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromWishlist({ itemId }))
      
  };

  const handleAddToCart = (mapped) => {
    dispatch(addToCart({ itemId: mapped.id, quantity: 1 }))
      
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700">
          <Heart size={32} className="mx-auto mb-3 text-gray-600" />
          <h2 className="text-lg font-semibold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400 text-sm">Please log in to view your wishlist.</p>
        </div>
      </div>
    );
  }

  // if (loading) return <Loader />

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart size={24} className="text-red-500 fill-current" />
          <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
        </div>
        <p className="text-gray-400">
          {items.length > 0 
            ? `${items.length} item${items.length > 1 ? 's' : ''} in your wishlist`
            : 'Your favorite items will appear here'
          }
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 max-w-sm mx-auto">
            <Heart size={48} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-lg font-semibold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 text-sm mb-4">
              Start adding items you love to your wishlist.
            </p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((wishlistItem) => (
            <WishlistCard
              key={wishlistItem.id}
              wishlist={wishlistItem}
              onRemove={handleRemoveItem}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}