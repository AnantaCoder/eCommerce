import { useState } from "react";
import ProductGrid from "../features/product/Product";
import CategoryGrid from "../features/category/Category";

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      <CategoryGrid onCategorySelect={setSelectedCategory} />
      <h1 className="text-4xl text-center p-2 pb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">
        Trending Now 🔥
      </h1>
      <ProductGrid selectedCategory={selectedCategory} />
    </div>
  );
}
