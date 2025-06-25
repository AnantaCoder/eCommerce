import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  selectCartItems,
  selectCartLoading,
  selectCartError,
} from "./cartSlice";
import CartCard from "../../components/CartCard";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch cart");
    }
  }, [error]);

  const handleRemove = (id) => {
    console.log("Remove from cart:", id);
    // dispatch(removeCartItem(id));
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700">
          <ShoppingCart size={32} className="mx-auto mb-3 text-gray-600" />
          <h2 className="text-lg font-semibold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400 text-sm">Please log in to view your cart.</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <ShoppingCart size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-white">My Cart</h1>
        </div>
        <p className="text-gray-400">
          {items.length > 0
            ? `${items.length} item${items.length > 1 ? "s" : ""} in your cart`
            : "Your cart is empty"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 max-w-sm mx-auto">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-lg font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mb-4">
              Start adding items to see them here.
            </p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {console.log(items)}
          {items.map((cartItem) => (
            <CartCard key={cartItem.id} cart={cartItem} onRemove={handleRemove}  />
          ))}
        </div>
      )}
    </div>
  );
}
