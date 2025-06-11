import React, { useEffect, useState } from "react"
import dataService from "../../components/dataService"
import ProductCard from "../../components/ProductCard"

export default function ProductGrid({ selectedCategory }) {
  const [products, setProducts] = useState([])
  useEffect(() => {
    if (selectedCategory && selectedCategory.id) {
      dataService.getProducts({ categoryId: selectedCategory.id }).then((items) => setProducts(items))
    } else {
      dataService.getProducts().then((items) => setProducts(items))
    }
  }, [selectedCategory])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product =>
        product && product.image ? (
          <ProductCard key={product.id} product={product} />
        ) : null
      )}
    </div>
  )
}