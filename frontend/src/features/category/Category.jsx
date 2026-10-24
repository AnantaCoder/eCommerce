import React, { useEffect, useCallback } from "react";
import CategoryCard from "../../components/CategoryCard";
import StoreCard from "../../components/StoreCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchCategoricItems } from "./categorySlice";
import { openLoginModal } from "../auth/authSlice";
import { addToCart, deleteAllCart, fetchCartItems } from "../cart/cartSlice";
import { addToWishlist } from "../wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

// Accept optional categoryId prop
export default function CategoryGrid({ categoryId, onCategorySelect }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const categories = useSelector((state) => state.categories.categories);
  const loading = useSelector((state) => state.categories.loading);
  const errorObj = useSelector((state) => state.categories.error);

  const categoricItems = useSelector((state) => state.categories.categoricItems);
  const categoricItemsLoading = useSelector((state) => state.categories.categoricItemsLoading);
  const categoricItemsError = useSelector((state) => state.categories.categoricItemsError);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoricItems({ categoryId }));
    } else {
      dispatch(fetchCategories({ page: 1, pageSize: 12 }));
    }
  }, [dispatch, categoryId]);

  const handleAddToCart = useCallback(
    (product) => {
      if (!isAuthenticated) {
        dispatch(openLoginModal("Please sign in to add items to your shopping cart."));
        return;
      }
      dispatch(addToCart({ itemId: product.id, quantity: 1 }));
    },
    [dispatch, isAuthenticated]
  );

  const handleBuyNow = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        dispatch(openLoginModal("Please sign in to purchase this product and checkout."));
        return;
      }
      try {
        await dispatch(deleteAllCart()).unwrap();
        await dispatch(addToCart({ itemId: product.id, quantity: 1 }));
        await dispatch(fetchCartItems()).unwrap();
        navigate("/checkout");
      } catch (err) {
        toast.error("Could not start Buy Now: " + (err.message || err));
      }
    },
    [dispatch, isAuthenticated, navigate]
  );

  const handleAddToWishList = useCallback(
    (id) => {
      if (!isAuthenticated) {
        dispatch(openLoginModal("Please sign in to save items to your wishlist."));
        return;
      }
      dispatch(addToWishlist({ itemId: id }));
    },
    [dispatch, isAuthenticated]
  );

  if (categoryId) {
    if (categoricItemsLoading) return <Loader />;
    if (categoricItemsError)
      return <p className="text-red-500">Error: {categoricItemsError.message}</p>;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoricItems.map((item) =>
          item ? (
            <StoreCard
              key={item.id}
              product={item}
              addToCart={handleAddToCart}
              buyNow={handleBuyNow}
              addWishlist={handleAddToWishList}
            />
          ) : null
        )}
      </div>
    );
  }

  if (loading) return <Loader />;
  if (errorObj)
    return <p className="text-red-500">Error: {errorObj.message}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) =>
        category ? (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={onCategorySelect}
          />
        ) : null
      )}
    </div>
  );
}