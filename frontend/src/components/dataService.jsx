// services/dataService.js
// This file centralizes all data operations and will be your single point for API integration

// Sample data - this will be replaced with actual API calls
const sampleCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets and tech innovations",
    icon: "Smartphone",
    productCount: 1250,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
    trending: true,
    discount: "Up to 40% off",
    popularBrands: ["Apple", "Samsung", "Sony"],
    color: "blue"
  },
  {
    id: 2,
    name: "Gaming",
    description: "Gaming gear and accessories",
    icon: "Gamepad2",
    productCount: 850,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    trending: true,
    discount: "Up to 60% off",
    popularBrands: ["PlayStation", "Xbox", "Nintendo"],
    color: "purple"
  },
  {
    id: 3,
    name: "Fashion",
    description: "Trendy clothing and accessories",
    icon: "Shirt",
    productCount: 2100,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    trending: false,
    discount: "Up to 50% off",
    popularBrands: ["Nike", "Adidas", "Zara"],
    color: "pink"
  },
  {
    id: 4,
    name: "Home & Garden",
    description: "Everything for your home",
    icon: "Home",
    productCount: 950,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    trending: false,
    discount: "Up to 35% off",
    popularBrands: ["IKEA", "HomeDepot", "Wayfair"],
    color: "green"
  },
  {
    id: 5,
    name: "Sports & Fitness",
    description: "Gear up for your active lifestyle",
    icon: "Dumbbell",
    productCount: 680,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    trending: true,
    discount: "Up to 45% off",
    popularBrands: ["Nike", "Under Armour", "Reebok"],
    color: "red"
  },
  {
    id: 6,
    name: "Books & Media",
    description: "Knowledge and entertainment",
    icon: "Book",
    productCount: 1500,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    trending: false,
    discount: "Up to 30% off",
    popularBrands: ["Kindle", "Audible", "Penguin"],
    color: "yellow"
  }
];

const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 2847,
    category: "Electronics",
    categoryId: 1, // This links the product to its category
    discount: 25,
    inStock: true,
    fastDelivery: true,
    description: "High-quality wireless headphones with noise cancellation and premium sound quality."
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 1203,
    category: "Electronics",
    categoryId: 1,
    discount: 20,
    inStock: true,
    fastDelivery: false,
    description: "Advanced fitness tracking with heart rate monitoring and GPS capabilities."
  },
  {
    id: 3,
    name: "Mechanical Gaming Keyboard",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 856,
    category: "Gaming",
    categoryId: 2,
    inStock: false,
    fastDelivery: true,
    description: "RGB backlit mechanical keyboard with custom switches for gaming enthusiasts."
  },
  {
    id: 4,
    name: "Wireless Gaming Mouse",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 1456,
    category: "Gaming",
    categoryId: 2,
    discount: 25,
    inStock: true,
    fastDelivery: true,
    description: "High-precision wireless gaming mouse with customizable RGB lighting."
  },
  {
    id: 5,
    name: "Designer Sneakers",
    price: 159.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 892,
    category: "Fashion",
    categoryId: 3,
    discount: 20,
    inStock: true,
    fastDelivery: false,
    description: "Comfortable and stylish sneakers perfect for everyday wear."
  },
  {
    id: 6,
    name: "Smart Home Speaker",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=400&fit=crop",
    rating: 4.4,
    reviewCount: 2103,
    category: "Home & Garden",
    categoryId: 4,
    inStock: true,
    fastDelivery: true,
    description: "Voice-controlled smart speaker with premium audio quality."
  }
];

// Data service functions - these will be replaced with actual API calls
export const dataService = {
  // Get all categories
  async getCategories() {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/categories');
    // return response.json();
    
    // Simulate API delay
    return new Promise(resolve => 
      setTimeout(() => resolve(sampleCategories), 100)
    );
  },

  // Get products with optional filtering and sorting
  async getProducts(filters = {}) {
    // TODO: Replace with actual API call
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`/api/products?${queryParams}`);
    // return response.json();
    
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = [...sampleProducts];
        
        // Filter by category if specified
        if (filters.categoryId) {
          filtered = filtered.filter(p => p.categoryId === parseInt(filters.categoryId));
        }
        
        // Filter by search query if specified
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
          );
        }
        
        // Sort products based on sortBy parameter
        if (filters.sortBy) {
          filtered.sort((a, b) => {
            switch (filters.sortBy) {
              case 'price-low':
                return a.price - b.price;
              case 'price-high':
                return b.price - a.price;
              case 'rating':
                return b.rating - a.rating;
              case 'name':
              default:
                return a.name.localeCompare(b.name);
            }
          });
        }
        
        resolve(filtered);
      }, 200);
    });
  },

  // Get a single product by ID
  async getProduct(id) {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/products/${id}`);
    // return response.json();
    
    return new Promise(resolve => {
      setTimeout(() => {
        const product = sampleProducts.find(p => p.id === parseInt(id));
        resolve(product);
      }, 100);
    });
  },

  // Get category by ID
  async getCategory(id) {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/categories/${id}`);
    // return response.json();
    
    return new Promise(resolve => {
      setTimeout(() => {
        const category = sampleCategories.find(c => c.id === parseInt(id));
        resolve(category);
      }, 100);
    });
  }
};

export default dataService;