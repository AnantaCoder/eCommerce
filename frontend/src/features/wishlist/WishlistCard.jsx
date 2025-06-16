import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromWishlist } from './wishlistSlice';
import { X } from 'lucide-react';

const WishlistCard = ({ wishlist }) => {
  const dispatch = useDispatch();
  const { id, item } = wishlist; 

  const handleRemove = () => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition">
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        title="Remove from wishlist"
      >
        <X className="w-5 h-5" />
      </button>

      <img
        src={item.image_urls?.[0] || '/placeholder.jpg'}
        alt={item.item_name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />

      <h3 className="text-lg font-semibold">{item.item_name}</h3>
      <p className="text-sm text-gray-600">{item.manufacturer}</p>
      <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
    </div>
  );
};

export default WishlistCard;
