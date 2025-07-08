import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import productReducer from '../features/product/productSlice'
import reviewReducer from '../features/product/reviewSlice'
import categoriesReducer from '../features/category/categorySlice'
import storeReducer from '../features/store/storeSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import cartReducer from '../features/cart/cartSlice'
import supportReducer from '../features/support/supportSlice'
import orderReducer from '../features/order/orderSlice'
import analyzeReducer from '../features/analyze/analyzeSlice' 
import feedbackReducer from '../features/support/feedbackSlice' 


const rootReducer = combineReducers({
  auth: authReducer,
  product:productReducer,
  categories:categoriesReducer,
  store:storeReducer,
  wishlist:wishlistReducer,
  cart:cartReducer,
  support:supportReducer,
  order:orderReducer,
  reviews:reviewReducer,
  analyze:analyzeReducer,
  feedback:feedbackReducer,


})

export default rootReducer
