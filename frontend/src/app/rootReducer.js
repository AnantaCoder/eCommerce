import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import productReducer from '../features/product/productSlice'
import categoriesReducer from '../features/category/categorySlice'
import storeReducer from '../features/store/storeSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import cartReducer from '../features/cart/cartSlice'


const rootReducer = combineReducers({
  auth: authReducer,
  product:productReducer,
  categories:categoriesReducer,
  store:storeReducer,
  wishlist:wishlistReducer,
  cart:cartReducer,
})

export default rootReducer
