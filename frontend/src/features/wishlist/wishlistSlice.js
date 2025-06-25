import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { toast } from "react-toastify";

// Fetch Wishlist
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

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async ({ itemId }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      });
    }
    try {
      const params = {
        item_id: itemId
      }
      const response = await api.post(
        'store/wishlist/',
        params,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
       toast.success('Added to wishlist! ❤️', {
        position: "bottom-right",
        autoClose: 2000,
      })
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to add to wishlist';
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
      return rejectWithValue(message);
    }
  }
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/delete',
  async ({ itemId }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      });
    }
    try {
      const response = await api.delete(`store/wishlist/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to remove from wishlist" }
      );
    }
  }
);

// Initial State
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Wishlist main Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // all cases 
      // Fetch
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
        state.error = action.payload?.message || "Failed to fetch wishlist";
      })

      // Add
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add item to wishlist";
      })

      // Remove
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload?.id ?? action.meta.arg.itemId;
        state.items = state.items.filter(item => item.id !== removedId);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item from wishlist";
      });
  },
});

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
