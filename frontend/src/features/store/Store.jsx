import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoreCard from "../../components/StoreCard";
import { fetchProducts, resetProducts } from "../product/productSlice";
import Loader from "../../components/Loader";
import { addToWishlist } from "../wishlist/wishlistSlice";
import { addToCart, deleteAllCart, fetchCartItems } from "../cart/cartSlice";
import { SearchX } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Store({ selectedCategory, searchQuery }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items = [],
    loading,
    error,
    page,
    totalPages,
  } = useSelector((state) => state.product);

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(resetProducts());
    dispatch(fetchProducts({ search: debouncedSearch, page: 1, pageSize: 10 }));
  }, [dispatch, debouncedSearch]);

  const handleAddToWishList = useCallback(
    (id) => {
      dispatch(addToWishlist({ itemId: id }));
    },
    [dispatch]
  );

  const handleAddToCart = useCallback(
    (product) => {
      dispatch(addToCart({ itemId: product.id, quantity: 1 }));
    },
    [dispatch]
  );

  const handleBuyNow = async (product) => {
    try {
      await dispatch(deleteAllCart()).unwrap();
      await dispatch(addToCart({ itemId: product.id, quantity: 1 }));
      await dispatch(fetchCartItems()).unwrap();
      navigate("/checkout");
    } catch (err) {
      toast.error("Could not start Buy Now: " + (err.message || err), {
        position: "bottom-right",
      });
    }
  };

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
  }, [
    page,
    totalPages,
    loading,
    dispatch,
    debouncedSearch,
    selectedCategory?.id,
  ]);

  if (loading && page === 1 && items.length === 0) {
    return <Loader />;
  }

  if (error) {
    const message = typeof error === "string" ? error : error.message;
    const status = error.status;
    return (
      <div className="text-red-500 p-4">
        <p>
          <strong>Error{status ? ` ${status}` : ""}:</strong> {message}
        </p>
      </div>
    );
  }

  return (
    <div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 space-y-4">
          <SearchX className="w-16 h-16 text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-500">
            No Matches Found
          </h2>
          <p className="text-md text-gray-400">
            Try refining your search or explore different categories.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <StoreCard
                key={product.id}
                product={product}
                addWishlist={handleAddToWishList}
                addToCart={handleAddToCart}
                buyNow={handleBuyNow}
              />
            ))}
          </div>
        </>
      )}

      {page < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="group relative px-8 py-3 bg-gradient-to-r from-gold-500 to-rose-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <span className="relative flex items-center gap-2">
              {loading && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {loading ? "Loading More..." : "Load More Products"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
