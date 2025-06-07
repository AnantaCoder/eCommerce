import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  ShoppingCart, 
  User, 
  Heart,
  ChevronDown,

} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="bg-gray-900  shadow-lg sticky top-0 z-50">
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
              <a href="#" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Categories
              </a>
              <a href="#" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Products
              </a>
              <a href="#" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Deals
              </a>
              <a href="#" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
              <a href="#" className="text-amber-50 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8 text-amber-50">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-b-cyan-500 text-amber-50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500" />
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-red-500 hover:text-purple-600 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-yellow-500 hover:text-purple-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-1 text-blue-500 hover:text-purple-600 transition-colors p-2"
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Wishlist
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Out
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-100 hover:text-purple-600 focus:outline-none focus:text-purple-600 cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <div className="relative ">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 text-amber-50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-violet-400 "  />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
            <a href="#" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium">
              Home
            </a>
            <a href="#" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium">
              Categories
            </a>
            <a href="#" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium">
              Products
            </a>
            <a href="#" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium">
              Deals
            </a>
            <a href="#" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium">
              About
            </a>
            <a href="#" className="text-amber-50 hover:text-purple-600 block px-3 py-2 text-base font-medium">
              Contact
            </a>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-around">
                <button className="flex items-center space-x-2 cursor-pointer text-red-500 hover:text-purple-600">
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button className="flex items-center space-x-2 cursor-pointer text-yellow-500 hover:text-purple-600">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart </span>
                </button>
                <button className="flex  cursor-pointer items-center space-x-2 text-blue-500 hover:text-purple-600">
                  <User className="w-5 h-5" />
                  <span>Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar
