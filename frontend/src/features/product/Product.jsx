import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import { fetchProducts, resetProducts } from "./productSlice";
import Loader from "../../components/Loader";
import { addToWishlist } from "../wishlist/wishlistSlice";
import { addToCart } from "../cart/cartSlice";

export default function ProductGrid({ selectedCategory, searchQuery }) {
  const dispatch = useDispatch();

  // Extracting state from Redux store
  const items = useSelector((state) => state.product.items) || [];
  const loading = useSelector((state) => state.product.loading);
  const errorObj = useSelector((state) => state.product.error);
  const page = useSelector((state) => state.product.page);
  const totalPages = useSelector((state) => state.product.totalPages);

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products on category, search or mount
  useEffect(() => {
    dispatch(resetProducts());
    dispatch(
      fetchProducts({
        categoryId: selectedCategory?.id,
        search: debouncedSearch,
        page: 1,
        pageSize: 10,
      })
    );
  }, [dispatch, selectedCategory?.id, debouncedSearch]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) {
      dispatch(
        fetchProducts({
          categoryId: selectedCategory?.id,
          search: debouncedSearch,
          page: page + 1,
          pageSize: 10,
        })
      );
    }
  }, [dispatch, page, totalPages, loading, debouncedSearch, selectedCategory]);

  // Error state
  if (errorObj) {
    const message = typeof errorObj === "string" ? errorObj : errorObj.message;
    const status = errorObj.status;
    return (
      <div className="text-red-500 p-4">
        <p>
          <strong>Error{status ? ` ${status}` : ""}:</strong> {message}
        </p>
      </div>
    );
  }

  // Initial loading state
  if (loading && page === 1) {
    return <Loader />;
  }
  const handleAddToWishList = (id) => {
    dispatch(addToWishlist({ itemId: id }));
  };

  const handleAddToCart = (mapped) => {
    dispatch(addToCart({ itemId: mapped.id, quantity: 1 }));
  };

  // No items found
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-gray-400 p-4 text-center ">No products found.</div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToWishlist={handleAddToWishList}
            addToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Pagination: Load More Button */}
      {page < totalPages && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            {loading ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
