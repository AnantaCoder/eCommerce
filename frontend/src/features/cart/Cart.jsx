import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  selectCartItems,
  selectCartError,
  removeFromCart,
  deleteAllCart,
} from "./cartSlice";
import CartCard from "../../components/CartCard";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openLoginModal } from "../auth/authSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const error = useSelector(selectCartError);
  const token = localStorage.getItem("access_token");
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );
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
  let  quantity = 1
  const handleRemove = (id) => {
    dispatch(removeFromCart({ itemId: id }));
  };
 const handleDeleteAll = async () => {
  await dispatch(deleteAllCart());
  dispatch(fetchCartItems());
}

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="text-center p-8 bg-gray-900/90 backdrop-blur-md rounded-3xl border border-gray-700/80 shadow-2xl max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-purple-500/25">
            <ShoppingCart size={28} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed">
            Please log in to your account to view saved items and manage your shopping cart.
          </p>
          <button
            onClick={() => dispatch(openLoginModal("Please sign in to view your shopping cart."))}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all text-xs cursor-pointer"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  // if (loading) return <Loader />;

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
            <h2 className="text-lg font-semibold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Start adding items to see them here.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* {console.log(items)} */}
            {items.map((cartItem) => (
              <CartCard
                key={cartItem.id}
                cart={cartItem}
                onRemove={handleRemove}
                quantity={quantity}
              />
            ))}
          </div>
          <div className="max-w-lg mx-auto mt-10 bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <button onClick={handleDeleteAll} 
              className="p-1 border-2 rounded border-amber-300 text-red-300 hover:scale-110 ease-in active:scale-100"
              >Empty cart 🛒</button>
              <span className="text-xl font-semibold text-white">Total:</span>
              <span className="text-2xl font-bold text-amber-400">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-xl"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
