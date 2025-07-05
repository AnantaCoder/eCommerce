import React, { useEffect } from "react";
import CategoryCard from "../../components/CategoryCard";
import StoreCard from "../../components/StoreCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchCategoricItems } from "./categorySlice";
import Loader from "../../components/Loader";

// Accept optional categoryId prop
export default function CategoryGrid({ categoryId,onCategorySelect }) {
  const dispatch = useDispatch();

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