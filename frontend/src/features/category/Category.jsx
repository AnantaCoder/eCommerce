import React, { useEffect, useState } from "react"
import dataService from "../../components/dataService"
import CategoryCard from "../../components/CategoryCard"

export default function CategoryGrid({ onCategorySelect }) {
  const [categories, setCategories] = useState([])
  useEffect(() => {
    dataService.getCategories().then((items) => setCategories(items))
  }, [])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map(category =>
        category ? (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => onCategorySelect && onCategorySelect(category)}
          />
        ) : null
      )}
    </div>
  )
}