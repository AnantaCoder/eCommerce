import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  ShoppingCart, 
  User, 
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const toggleMenu = () => setIsMenuOpen(open => !open);
  const toggleUserMenu = () => setIsUserMenuOpen(open => !open);

  // Function to get display name with fallbacks
  const getDisplayName = () => {
    if (!user) return '';
    
    // Try different possible user name properties
    return user.first_name || 
           user.firstName || 
           user.name || 
           user.username || 
           user.email?.split('@')[0] || 
           'User';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-dropdown')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Debug: Log user data to console
  useEffect(() => {
    console.log('User data:', user);
    console.log('Is authenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Add CSS styles for smooth animations */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 500px;
            opacity: 1;
          }
        }
        
        .animate-dropdown {
          animation: fadeInScale 0.2s ease-out forwards;
        }
        
        .slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
      
      <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-amber-100">StoreHub</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8 text-amber-50">
                <a href="/home" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Home
                </a>
                <a href="/category" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Categories
                </a>
                <a href="/store" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Store
                </a>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-cyan-500 bg-gray-800 text-amber-50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500" />
              </div>
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <button className="p-2 text-red-500 cursor-pointer hover:text-purple-600 transition-colors duration-200 hover:scale-110 transform"
                    onClick={() => {
                      navigate('/wishlist');
                    }}>
                    <Heart className="w-5 h-5" />
                  </button>

                  <button className="p-2 cursor-pointer text-yellow-500 hover:text-purple-600 relative transition-all duration-200 hover:scale-110 transform"
                    onClick={() => {
                      navigate('/cart');
                    }}>
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex cursor-pointer items-center justify-center transition-all duration-200">
                      3
                    </span>
                  </button>

                  {/* User Avatar + Dropdown with Smooth Animation */}
                  <div className="relative user-dropdown">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 text-blue-500 hover:text-purple-600 p-2 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-800"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-amber-50 text-sm font-medium">
                        {getDisplayName()}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-amber-50 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Smooth Dropdown Menu */}
                    <div className={`absolute right-0 mt-2 w-48 cursor-pointer bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700 transition-all duration-300 ease-in-out transform origin-top-right ${
                      isUserMenuOpen 
                        ? 'opacity-100 scale-100 translate-y-0 visible' 
                        : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                    }`}>
                      <button 
                        onClick={() => {
                          navigate('/account');
                          setIsUserMenuOpen(false);
                        }} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-50 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                      >
                        My Account
                      </button>
                      
                      <div className="border-t border-gray-600 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-gray-700 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-gradient-to-r cursor-pointer from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 border border-transparent hover:border-purple-400"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-100 hover:text-purple-600 focus:outline-none focus:text-purple-600 cursor-pointer transition-all duration-200 hover:bg-gray-800 p-2 rounded-lg"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-800 text-amber-50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Smooth Mobile Menu with Slide Animation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
            <a href="/home" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium transition-all duration-200 hover:bg-gray-800 rounded-lg">
              Home
            </a>
            <a href="/category" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium transition-all duration-200 hover:bg-gray-800 rounded-lg">
              Categories
            </a>
            <a href="/store" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium transition-all duration-200 hover:bg-gray-800 rounded-lg">
              Store
            </a>
            
            <div className="border-t border-gray-200 pt-4">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 pb-3 text-amber-50 font-mono font-bold text-center transition-all duration-200">
                    Welcome, {getDisplayName()}
                  </div>
                  <div className="flex items-center justify-around">
                    <button 
                      onClick={() => {
                        navigate('/wishlist');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 cursor-pointer text-red-500 hover:text-purple-600 transition-all duration-200 p-2 rounded-lg hover:bg-gray-800"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Wishlist</span>
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/cart');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 cursor-pointer text-yellow-500 hover:text-purple-600 transition-all duration-200 p-2 rounded-lg hover:bg-gray-800"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Cart</span>
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/account');
                        setIsMenuOpen(false);
                      }}
                      className="flex cursor-pointer items-center space-x-2 text-blue-500 hover:text-purple-600 transition-all duration-200 p-2 rounded-lg hover:bg-gray-800"
                    >
                      <User className="w-5 h-5" />
                      <span>Account</span>
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center px-3 py-2 text-red-500 font-bold hover:text-purple-600 mt-2 transition-all duration-200 rounded-lg hover:bg-gray-800"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md active:scale-95 transition-all duration-200 ease-in-out hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02]"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;