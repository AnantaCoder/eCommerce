import React from 'react';
import Chair from '../components/VantaBackground';
import VantaBackground from '../components/VantaBackground';

function LandingPage() {
  // Sample data for featured products - in a real app, this would come from your Django API
  const featuredProducts = [
    {
      id: 1,
      name: 'Quantum X Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      category: 'Audio'
    },
    {
      id: 2,
      name: 'Aether Gaming Mouse',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      category: 'Gaming'
    },
    {
      id: 3,
      name: 'Nova Smartwatch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      category: 'Wearables'
    },
    {
      id: 4,
      name: 'Nebula VR Headset',
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'Virtual Reality'
    }
  ];

  // Categories data with corresponding images
 const categories = [
  {
    name: 'Audio',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop'
  },
  {
    name: 'Gaming',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=150&fit=crop'
  },
  {
    name: 'Wearables',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200&h=150&fit=crop'
  },
  {
    name: 'Virtual Reality',
    image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=200&h=150&fit=crop'
  },
  {
    name: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=200&h=150&fit=crop'
  },
  {
    name: 'Mobile Accessories',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=200&h=150&fit=crop'
  },
  {
    name: 'Computing',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=150&fit=crop'
  },
  {
    name: 'Photography',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=150&fit=crop'
  },
  {
    name: 'Fitness Tech',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop'
  },
  {
    name: 'Networking',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=150&fit=crop'
  }
];

  // Testimonials data with avatar images
  const testimonials = [
    {
      id: 1,
      name: 'Mia Malik',
      avatar: 'https://plus.unsplash.com/premium_photo-1669704098858-8cd103f4ac2e?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      text: 'StoreHub has revolutionized my online shopping experience. The product quality is unmatched, and the customer service is exceptional!'
    },
    {
      id: 2,
      name: 'David Nigga',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      text: 'I\'m a huge fan of the gaming gear available at StoreHub. The Aether Gaming Mouse has significantly improved my performance.'
    },
    {
      id: 3,
      name: 'Emily Blunt',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      text: 'The Nova Smartwatch is not only stylish but also packed with features. It\'s become an essential part of my daily routine.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero with three js effects */}
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Vanta Background - positioned absolutely behind everything */}
  <div className="absolute inset-0 z-0">
    <VantaBackground />
  </div>

  {/* Hero Content - positioned above the background */}
  <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
      Welcome to Future of e-Commerce
    </h1>
    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
      Explore the future of online shopping with our curated collection of cutting-edge products and exclusive deals.
    </p>
    <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
      Shop Now
    </button>
  </div>
</section>

      {/* Featured Products Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 group">
                {/* Product image with overlay effect on hover */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-cyan-400 text-sm font-medium">{product.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div className="bg-gray-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-center">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
                {/* Customer avatar with gradient border effect */}
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 p-0.5">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-8 shadow-xl">
              <div className="text-4xl font-bold text-cyan-400 mb-2">10,000+</div>
              <div className="text-gray-300 text-lg">Total Orders</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-8 shadow-xl">
              <div className="text-4xl font-bold text-purple-400 mb-2">5,000+</div>
              <div className="text-gray-300 text-lg">Happy Customers</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-8 shadow-xl">
              <div className="text-4xl font-bold text-teal-400 mb-2">500+</div>
              <div className="text-gray-300 text-lg">Products Sold</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;