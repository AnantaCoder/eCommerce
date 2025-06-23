import { useState } from "react";
import ProductGrid from "../features/product/Product";
import CategoryGrid from "../features/category/Category";
import AIChatWidget from "../features/support/AIChatWidget";

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <>
    <AIChatWidget/>
    <div className="py-5 px-2">
      <h1 className="text-4xl text-center py-2 pb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">
        Categories 🛍️
      </h1>
      <CategoryGrid onCategorySelect={setSelectedCategory} />
      <h1 className="text-4xl text-center py-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">
        Trending Now 🔥
      </h1>
      <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded"
      />
      <ProductGrid searchQuery={searchQuery} selectedCategory={selectedCategory} />
    </div>
    </div>
    </>
  );
}
