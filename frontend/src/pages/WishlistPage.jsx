import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import WishlistCard from '../features/wishlist/WishlistCard';

function WishlistPage() {
  const wishlistItems = useSelector(state => state.wishlist); 
  const navigate = useNavigate(); 

  if (!wishlistItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center max-w-2xl mx-auto px-6">
          {/* Empty state icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center border border-blue-500/30 backdrop-blur-sm">
              <Heart className="w-16 h-16 text-blue-300 opacity-60" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-cyan-400 opacity-70" />
            </div>
          </div>

          {/* Empty state content */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent mb-4">
            Your Wishlist Awaits
          </h1>
          
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Discover amazing products and save your favorites here. 
            Start building your dream collection today!
          </p>

          {/* Call to action button */}
          <button 
            onClick={() => navigate('/home')}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-500/30"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Start Shopping</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Decorative bottom element */}
          <div className="mt-12 w-24 h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
              <Heart className="w-8 h-8 text-blue-300 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                My Wishlist
              </h1>
              <p className="text-slate-300 opacity-80">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map(wishlist => (
              <div key={wishlist.id} className="relative">
                <WishlistCard wishlist={wishlist} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-16"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
}

export default WishlistPage;