import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

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
    try {
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
      return data.results;
    } catch (error) {
      const apiError = error.response?.data;
      return rejectWithValue(
        apiError?.status
          ? { status: apiError.status, message: apiError.message }
          : { status: 500, message: error.message || 'Server error fetching cart' }
      );
    }
  }
);

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
      });
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartLoading = (state) => state.cart.loading
export const selectCartError = (state) => state.cart.error

export default cartSlice.reducer;
