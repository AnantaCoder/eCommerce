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
import { useNavigate } from "react-router-dom";
import { openLoginModal } from "../auth/authSlice";

export default function Wishlists() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  // const loading = useSelector(selectWishlistLoading);
  const error = useSelector(selectWishlistError);
  const navigate = useNavigate();
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
      toast.success("Item removed from wishlist!", {
        position: "bottom-right",
      });
    }
    if (prevItems.current.length < items.length) {
      toast.success("Item added to wishlist!", { position: "bottom-right" });
    }
    prevItems.current = items;
  }, [items]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromWishlist({ itemId }));
  };

  const handleAddToCart = (mapped) => {
    dispatch(addToCart({ itemId: mapped.id, quantity: 1 }));
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="text-center p-8 bg-gray-900/90 backdrop-blur-md rounded-3xl border border-gray-700/80 shadow-2xl max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-rose-500/25">
            <Heart size={28} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed">
            Please log in to your account to view and manage your saved wishlist items.
          </p>
          <button
            onClick={() => dispatch(openLoginModal("Please sign in to view your wishlist."))}
            className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-rose-500/25 transition-all text-xs cursor-pointer"
          >
            Sign In Now
          </button>
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
            ? `${items.length} item${
                items.length > 1 ? "s" : ""
              } in your wishlist`
            : "Your favorite items will appear here"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 max-w-sm mx-auto">
            <Heart size={48} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-lg font-semibold text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Start adding items you love to your wishlist.
            </p>
            <button
            onClick={()=>navigate('/home')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
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
