import React from 'react';
import { Heart, ShoppingCart, Package, Calendar, User, Tag, X, Zap } from 'lucide-react';

const WishlistCard = ({ wishlist, onRemove, onAddToCart }) => {
  const mapped = {
    id: wishlist.id,
    name: wishlist.item.item_name,
    category: wishlist.item.category_name,
    description: wishlist.item.description,
    price: parseFloat(wishlist.item.price),
    image: wishlist.item.image_urls?.[0] || null,
    inStock: wishlist.item.is_in_stock,
    manufacturer: wishlist.item.manufacturer,
    sku: wishlist.item.sku,
    seller: wishlist.item.seller_name,
    quantity: wishlist.item.quantity,
    addedAt: wishlist.added_at,
    fastDelivery: true,
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    });

  const getStockStatus = () => {
    if (!mapped.inStock) return { text: 'Out of Stock', color: 'bg-red-500' };
    if (mapped.quantity < 10) return { text: 'Low Stock', color: 'bg-orange-500' };
    return { text: 'In Stock', color: 'bg-green-500' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="group relative bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 border border-gray-700 flex flex-col md:flex-row">
      {/* Remove button */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100">
        {onRemove && (
          <button
            onClick={() => onRemove(mapped.id)}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Image */}
      <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-800 flex items-center justify-center overflow-hidden">
        {mapped.image ? (
          <img
            src={mapped.image}
            alt={mapped.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <Package size={32} className="text-gray-600" />
        )}
        <div
          className={`absolute bottom-2 right-2 ${stockStatus.color} text-white px-2 py-0.5 rounded-full text-xs`}
        >
          {stockStatus.text}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-blue-400 text-xs font-medium uppercase tracking-wide">
              {mapped.category}
            </span>
            {mapped.fastDelivery && (
              <div className="flex items-center gap-1 text-yellow-400 text-xs">
                <Zap className="w-4 h-4" />
                <span>Fast</span>
              </div>
            )}
          </div>

          <h3 className="text-white text-base md:text-lg font-bold leading-snug line-clamp-2 hover:text-blue-400 transition-colors">
            {mapped.name}
          </h3>

          <div className="text-lg md:text-xl font-bold text-white">
            {formatPrice(mapped.price)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
            {mapped.manufacturer && (
              <div className="flex items-center gap-1">
                <Tag size={12} />
                <span className="truncate">{mapped.manufacturer}</span>
              </div>
            )}
            {mapped.seller && (
              <div className="flex items-center gap-1">
                <User size={12} />
                <span className="truncate">{mapped.seller}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={12} />
            <span>Added {formatDate(mapped.addedAt)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onAddToCart && onAddToCart(mapped)}
              disabled={!mapped.inStock}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 shadow-lg transition ${
                mapped.inStock
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={16} />
              {mapped.inStock ? 'Add to Cart' : 'N/A'}
            </button>

            <button
              onClick={() => onRemove && onRemove(mapped.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 text-sm font-semibold transition flex items-center justify-center gap-1"
            >
              <Heart size={16} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
