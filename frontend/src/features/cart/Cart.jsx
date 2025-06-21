import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../cart/cartSlice';
import {  ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Loader from '../../components/Loader';

function Cart() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const [removingItems, setRemovingItems] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = async (id) => {
    setRemovingItems(prev => new Set(prev).add(id));
    await dispatch(removeFromCart(id));
    setRemovingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  if (loading) {
    <Loader/>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center bg-red-900/20 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-300 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl"></div>
        <div className="relative px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4">
            Your Cart
          </h1>
          <p className="text-gray-400 text-lg">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="px-6 pb-12">
        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-12">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-3">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some items to get started with your shopping</p>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Cart Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:bg-gray-800/70 hover:border-gray-600/50 hover:scale-[1.02] ${
                      removingItems.has(item.id) ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden">
                          <img
                            src={item.image || 'https://via.placeholder.com/150'}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-white truncate pr-4">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={removingItems.has(item.id)}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                          >
                            {removingItems.has(item.id) ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-700/50 rounded-lg overflow-hidden">
                            <button className="p-2 hover:bg-gray-600/50 transition-colors duration-200">
                              <Minus className="w-4 h-4 text-gray-300" />
                            </button>
                            <span className="px-4 py-2 text-white font-medium bg-gray-600/30">
                              {item.quantity}
                            </span>
                            <button className="p-2 hover:bg-gray-600/50 transition-colors duration-200">
                              <Plus className="w-4 h-4 text-gray-300" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400">
                              ₹{item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal ({items.length} items)</span>
                        <span>₹{total}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span className="text-green-400">Free</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Tax</span>
                        <span>₹{(total * 0.18).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-4">
                        <div className="flex justify-between text-xl font-bold text-white">
                          <span>Total</span>
                          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            ₹{(parseFloat(total) + parseFloat(total) * 0.18).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                      Proceed to Checkout
                    </button>
                    
                    <button className="w-full mt-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500">
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;