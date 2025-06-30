import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { toast } from "react-toastify";

export const fetchCartItems = createAsyncThunk(
  'cart/fetchAll',
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      });
    }

    let toastId;
    try {
      toastId = toast.loading("Fetching cart...", {
        position: "bottom-right"
      });

      const response = await api.get('store/cart/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (!Array.isArray(data.results)) {
        throw new Error("Invalid response format: expected array of items in 'results'");
      }

      toast.update(toastId, {
        render: "Cart loaded ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true
      });

      return data.results;
    } catch (error) {
      if (toastId) {
        toast.update(toastId, {
          render: "Error loading cart ❌",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true
        });
      }

      const apiError = error.response?.data;
      return rejectWithValue(
        apiError?.status
          ? { status: apiError.status, message: apiError.message }
          : { status: 500, message: error.message || 'Server error fetching cart' }
      );
    }
  }
);


export const  addToCart = createAsyncThunk(
  'cart/add',
  async({itemId, quantity},{rejectWithValue}) =>{
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      });
    }
    try {
      const params = {
        item_id : itemId,
        quantity :quantity
      }
      const response = await api.post('store/cart/',params ,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
       toast.success('Item added to cart! 🛒', {
        position: "bottom-right",
        autoClose: 2000,
      });
      return response.data
    } catch (error) {
      
      const message = error.response?.data?.detail || 'Failed to add item to cart';
      toast.error(message, {
        position: "top-center",
        autoClose: 4000,
      });
      return rejectWithValue(message);
    }

  }
)
export const  removeFromCart = createAsyncThunk(
  'cart/delete',
  async({itemId},{rejectWithValue}) =>{
    const accessToken = localStorage.getItem("access_token")
    toast.info("loading>>>")
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      });
    }
    try {
      const params = itemId
      const response = await api.delete(`store/cart/${params}/`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      toast.success('Item removed from cart! 🗑️', {
        position: "bottom-right",
        autoClose: 2000,
      })
      return response.data
    } catch  (error) {
      const message = error.response?.data?.detail || 'Failed to update cart';
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
      return rejectWithValue(message);
    }

  }
)

export const deleteAllCart = createAsyncThunk(
  'cart/deleteAll',
  async (_, { rejectWithValue }) => { 
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      })
    }
    try {
      const response = await api.delete('store/cart/delete-all/',{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete all cart items');
    }
  }
)

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Wishlist slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // fetch
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add 
      .addCase(addToCart.pending,(state)=>{
        state.loading= true
        state.error= null
      })
      .addCase(addToCart.fulfilled,(state,action)=>{
        state.loading= false
        state.items.push(action.payload)
      })
      .addCase(addToCart.rejected,(state,action)=>{
        state.loading= false
        state.error= action.payload?.message || "cant add"
      })
      //remove
       .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload?.id ?? action.meta.arg.itemId;
        state.items = state.items.filter((item) => item.id !== removedId);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item";
      })
      //delete all
      .addCase(deleteAllCart.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(deleteAllCart.fulfilled, (state) => {
        state.items = []
        state.error = null;
      })
      .addCase(deleteAllCart.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete cart items'
        state.message = null;
      });
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartLoading = (state) => state.cart.loading
export const selectCartError = (state) => state.cart.error

export default cartSlice.reducer;
