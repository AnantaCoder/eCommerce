import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import IndividualProductCard from "../../components/IndivisualProductCard";
import { fetchProducts } from "./productSlice";
import { addToWishlist } from "../wishlist/wishlistSlice";
import { addToCart } from "../cart/cartSlice";
import { openLoginModal } from "../auth/authSlice";
import ReviewSection from "./ReviewSection";
import Loader from "../../components/Loader";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.product.items);
  const loading = useSelector((state) => state.product.loading);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleAddToWishList = (id) => {
    if (!isAuthenticated) {
      dispatch(openLoginModal("Please sign in to save items to your wishlist."));
      return;
    }
    dispatch(addToWishlist({ itemId: id }));
  };

  const handleAddToCart = (mapped) => {
    if (!isAuthenticated) {
      dispatch(openLoginModal("Please sign in to add items to your shopping cart."));
      return;
    }
    dispatch(addToCart({ itemId: mapped.id, quantity: 1 }));
  };

  const product = items.find((item) => String(item.id) === String(id));

  useEffect(() => {
    if (!product) {
      dispatch(fetchProducts({ page: 1, pageSize: 10 }));
    }
  }, [dispatch, product]);

  if (loading && !product) return <div><Loader/></div>;
  if (!product) return <div>Product not found.</div>;
  const canReview = user 
  return (
  <>
  <IndividualProductCard product={product} addWishlist={handleAddToWishList} addToCart={handleAddToCart} />;
  <ReviewSection itemId={product.id} canReview={canReview}/>
  </>
  )
}

export default ProductDetail;
