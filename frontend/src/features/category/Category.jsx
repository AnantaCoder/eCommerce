import React, { useEffect, useState } from "react";
import dataService from "../../components/dataService";
import CategoryCard from "../../components/CategoryCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./categorySlice";



export default function CategoryGrid({ onCategorySelect }) {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.categories.categories);
  const loading = useSelector((state) => state.categories.loading);
  const errorObj = useSelector((state) => state.categories.error);
  const page = useSelector((state) => state.categories.page);
  const totalPages = useSelector((state) => state.categories.totalPages);

  useEffect(() => {
    dispatch(
      fetchCategories({
        page: 1,
        pageSize: 12,
      })
    );
  }, [dispatch]);

  if (loading) return <p className="text-white">Loading categories...</p>;
  if (errorObj)
    return <p className="text-red-500">Error: {errorObj.message}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) =>
        category ? (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => onCategorySelect?.(category)}
          />
        ) : null
      )}
    </div>
  );
}
