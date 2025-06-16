import React from 'react';
import { useSelector } from 'react-redux';
import WishlistCard from '../features/wishlist/WishlistCard';

function WishlistPage() {
  const wishlistItems = useSelector(state => state.wishlist); 

  if (!wishlistItems.length) {
    return (
      <>

      <div className='flex flex-col justify-center items-center text-center'>
        <img src="https://static3.depositphotos.com/1002881/151/i/950/depositphotos_1519030-stock-photo-error-404.jpg" alt="" />
      <div className="text-center text-gray-400 font-bold py-10">Your wishlist is empty.</div>
      
      </div>
      </>
    );
  }

  return (
    <div className="relative min-h-screen p-6 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(wishlist => (
          <div key={wishlist.id} className="relative">
            <WishlistCard wishlist={wishlist} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
