import React from "react";
import { ShoppingCart, X, Tag, User, Calendar } from "lucide-react";

const CartCard = ({ cart, onRemove }) => {
const mapped = {
  id: cart.id,
  cartQuantity: cart.quantity,
  unitPrice: parseFloat(cart.price),
  totalPrice: cart.total_price,
  addedAt: cart.added_at,
  ...cart.item, 
  image: cart.item.image_urls?.[0] || null,
};


  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="group relative bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 border border-gray-700 flex flex-col md:flex-row">
      {/* Remove button */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100">
        <button
          onClick={() => onRemove && onRemove(mapped.id)}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-800 flex items-center justify-center overflow-hidden">
        {mapped.image ? (
          <img
            src={mapped.image}
            alt={mapped.item_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <ShoppingCart size={32} className="text-gray-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-white text-base md:text-lg font-bold leading-snug line-clamp-2 hover:text-blue-400 transition-colors">
            {mapped.item_name}
          </h3>

          <div className="text-lg font-bold text-white">
            {formatPrice(mapped.unitPrice)} × {mapped.cartQuantity} ={" "}
            {formatPrice(mapped.totalPrice)}
          </div>

          <p className="text-sm text-gray-400 line-clamp-2">
            {mapped.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Tag size={12} />
              <span className="truncate">{mapped.manufacturer}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={12} />
              <span className="truncate">{mapped.seller_name}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={12} />
          <span>Added {formatDate(mapped.addedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
