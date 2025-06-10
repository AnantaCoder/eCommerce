import React from "react";
import {
    X, ShoppingCart,
    Plus, Minus, Trash2,
    CreditCard, Truck,
} from "lucide-react";
import Navbar from "../../components/Navbar";

// CartItem UI component
const CartItem = () => (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gradient-to-r from-gray-900/80 to-gray-800/80 shadow-lg rounded-2xl p-4 border border-white/10 hover:shadow-xl transition-shadow">
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mia_Khalifa_in_2016.jpg/250px-Mia_Khalifa_in_2016.jpg"
            alt="Product"
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-white/10 shadow"
        />
        <div className="flex-1 min-w-0 w-full">
            <h4 className="text-white font-semibold text-base sm:text-lg truncate">Product Name</h4>
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">Product description goes here. This is a placeholder for the product details.</p>
            <div className="flex items-center gap-3 mt-3">
                <button
                    className="p-2 bg-gray-700/60 rounded-full hover:bg-blue-600/80 disabled:opacity-40 transition"
                    disabled
                >
                    <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-white font-bold text-base px-2">1</span>
                <button
                    className="p-2 bg-gray-700/60 rounded-full hover:bg-blue-600/80 transition"
                >
                    <Plus className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
        <div className="flex flex-row sm:flex-col items-end gap-3 w-full sm:w-auto justify-between sm:justify-end mt-3 sm:mt-0">
            <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight">
                $19.99
            </span>
            <button
                className="p-2 bg-red-500/10 rounded-full hover:bg-red-500/30 transition"
                title="Remove item"
            >
                <Trash2 className="w-5 h-5 text-red-400" />
            </button>
        </div>
    </div>
);

// Fullscreen Cart UI component
const Cart = () => (
    
    <div className=" flex inset-0 z-50  flex-col bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl  sm:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-extrabold text-2xl sm:text-3xl flex items-center gap-3 tracking-tight">
                <ShoppingCart className="w-7 h-7" /> My Cart
            </h2>
            <button
                className="p-2 hover:bg-white/10 rounded-full transition"
                title="Close cart"
            >
                <X className="w-6 h-6 text-white" />
            </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-1 custom-scroll mb-6">
            <CartItem />
            {/* <CartItem /> */}
            {/* <CartItem /> */}
        </div>

        {/* Footer */}
        <div className="space-y-4">
            <div className="flex justify-between scroll-smooth items-center text-white font-semibold text-lg border-t border-white/10 pt-4">
                <span>Subtotal</span>
                <span>$59.97</span>
            </div>
            <button
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-3 rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
                <CreditCard className="w-5 h-5" />
                Checkout
            </button>
            <button
                className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl transition"
            >
                <Truck className="w-5 h-5 text-white/80" />
                Continue Shopping
            </button>
        </div>
    </div>
);

export default Cart;

