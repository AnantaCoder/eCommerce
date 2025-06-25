import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import IndividualProductCard from "../../components/IndivisualProductCard";
import { fetchProducts } from "./productSlice";
import { addToWishlist } from "../wishlist/wishlistSlice";
import { addToCart } from "../cart/cartSlice";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.product.items);
  const loading = useSelector((state) => state.product.loading);
  const handleAddToWishList = (id) => {
    dispatch(addToWishlist({ itemId: id }));
  };

  const handleAddToCart = (mapped) => {
    dispatch(addToCart({ itemId: mapped.id, quantity: 1 }));
  };

  const product = items.find((item) => String(item.id) === String(id));

  useEffect(() => {
    if (!product) {
      dispatch(fetchProducts({ page: 1, pageSize: 10 }));
    }
  }, [dispatch, product]);

  if (loading && !product) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return <IndividualProductCard product={product} addWishlist={handleAddToWishList} addToCart={handleAddToCart} />;
}

export default ProductDetail;
