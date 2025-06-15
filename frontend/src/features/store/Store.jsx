import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreCard from '../../components/StoreCard';
import { fetchProducts, resetProducts } from '../product/productSlice';

export default function Store({ selectedCategory, searchQuery }) {
  const dispatch = useDispatch(); //using this hook for accesing the dispatch func in the store slice 

  // selecting each contents and defining its state to match the global state
  const items      = useSelector(state => state.product.items);
  const loading    = useSelector(state => state.product.loading);
  const errorObj   = useSelector(state => state.product.error);
  const page       = useSelector(state => state.product.page);
  const totalPages = useSelector(state => state.product.totalPages);



  /**
   * alternet way
   * const { items, loading, errorObj, page, totalPages } = useSelector(state => state.product);
   */

  // use effect hook to call the api after 300 milisecond
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);



  // another use effect(fresh fetch ) hook calling methods 
  useEffect(() => {
    dispatch(resetProducts()); //clearing the prev results 
    dispatch(
      fetchProducts({
        categoryId: selectedCategory?.id,
        search: debouncedSearch,
        page: 1,
        pageSize: 10,
      })
    );
  //  called the dependancy array, rerun after debounceSearch tern changes 
  }, [dispatch, selectedCategory?.id, debouncedSearch]);



  // pagination handler function , we can use useCallback here(gemini)- less crucial but good practice 
  const loadMore = useCallback(()=>{
    if (page <totalPages && !loading){
      dispatch(
        fetchProducts({
          categoryId:selectedCategory?.id,
          search:debouncedSearch,
          page:page+1,
          pageSize:10
        })
      )
    }
  },[page,totalPages,loading,dispatch,debouncedSearch,selectedCategory])


  /**
   * original hand written code .
   */
  // const loadMore = () => {
  //   if (page < totalPages && !loading) {
  //     dispatch(
  //       fetchProducts({
  //         categoryId: selectedCategory?.id,
  //         search: debouncedSearch,
  //         page: page + 1,
  //         pageSize: 10,
  //       })
  //     );
  //   }
  // };

  // Show loading state on first page (set a timer)
  if (loading && page === 1) return <p>Loading products...</p>;

  // Render detailed error information
  if (errorObj) {
    const message = typeof errorObj === 'string' ? errorObj : errorObj.message;
    const status = errorObj.status;
    return (
      <div className="text-red-500 p-4">
        <p><strong>Error{status ? ` ${status}` : ''}:</strong> {message}</p>
      </div>
    );
  }

  return (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map(product => (
        <StoreCard key={product.id} product={product} />
      ))}
    </div>

    {/* Your existing pagination code */}
    {page < totalPages && (
      <div className="flex justify-center mt-6">
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          {loading ? 'Loading…' : 'Load More'}
        </button>
      </div>
    )}
  </div>
);
  
}
