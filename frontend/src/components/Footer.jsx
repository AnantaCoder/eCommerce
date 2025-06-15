import { 

  ShoppingCart, 

  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';
import Button from './Button';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">



          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">StoreHub</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online shopping destination. We bring you the best products 
              at competitive prices with exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a  href="#" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" target="_blank"  className="text-gray-400 blank target-blank hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a target="_blank" href="https://www.instagram.com/bong_ani_007" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About Us
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                FAQ
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Shipping Info
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Returns Policy
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Size Guide
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">+91 8927665759</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">support@storehub.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5" />
                <span className="text-gray-400 text-sm">
                    City Center , 
                  <br />
                  NH-31 , Matigara
                  <br />
                  Siliguri, WB 734010
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
                <div className="space-y-4">
                <h3 className="text-lg font-semibold">Stay Updated</h3>
                <p className="text-gray-400 text-sm">
                  Subscribe to our newsletter for exclusive deals and updates.
                </p>
                <div className="space-y-2">
                  <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <div className='flex justify-center'>
                  <button className="relative px-6 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 overflow-hidden group">
                    <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-purple-300 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                    <span className="relative">Subscribe Now!</span>
                  </button>
                  </div>
                </div>
                </div>
              </div>
              </div>

              {/* Trust Indicators */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Truck className="w-6 h-6 text-purple-400" />
              <div>
                <h4 className="font-semibold text-sm">Free Shipping</h4>
                <p className="text-gray-400 text-xs">On orders over ₹999</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-6 h-6 text-purple-400" />
              <div>
                <h4 className="font-semibold text-sm">Secure Payment</h4>
                <p className="text-gray-400 text-xs">SSL protected checkout</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CreditCard className="w-6 h-6 text-purple-400" />
              <div>
                <h4 className="font-semibold text-sm">Easy Returns</h4>
                <p className="text-gray-400 text-xs">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 StoreHub. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer