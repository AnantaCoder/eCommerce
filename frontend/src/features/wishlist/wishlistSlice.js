import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchWishlistItems = createAsyncThunk(
  'wishlist/fetchAll',
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      });
    }
    try {
      const response = await api.get('store/wishlist/', {
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
          : { status: 500, message: error.message || 'Server error fetching wishlist' }
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
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
