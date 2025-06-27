import { useState } from "react";
import ProductGrid from "../features/product/Product";
import CategoryGrid from "../features/category/Category";
import AIChatWidget from "../features/support/AIChatWidget";

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <AIChatWidget />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-10 px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl text-center py-4 font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-500 tracking-tight">
          Curated Collections 🛍️
        </h1>
        <div className="max-w-7xl mx-auto">
          <CategoryGrid
            categoryId={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
        {selectedCategory && (
          <button
            className="block mx-auto mt-6 mb-2 px-4 py-2 bg-amber-400 text-black rounded-lg font-semibold"
            onClick={() => setSelectedCategory(null)}
          >
            ← Back to All Categories
          </button>
        )}
        <h1 className="text-4xl md:text-5xl text-center py-6 font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-500 tracking-tight">
          Exquisite Trends 🔥
        </h1>
        <div className="max-w-3xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search our exclusive products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-amber-300/30 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="max-w-7xl mx-auto">
          <ProductGrid searchQuery={searchQuery} selectedCategory={selectedCategory} />
        </div>
      </div>
    </>
  );
}