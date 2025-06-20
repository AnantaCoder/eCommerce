import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const addItems = createAsyncThunk(
  'store/add-items',
  async (
    { item_name, item_type, manufacturer, quantity, price, sku, description, category, imageFiles = [] },
    { rejectWithValue, getState }
  ) => {
    const accessToken = localStorage.getItem("access_token");
    const state = getState();
    const user = state.auth.user;

    if (!user?.id || !accessToken) {
      return rejectWithValue({ status: 401, message: 'Must be logged in as seller.' });
    }
    if (!category) {
      return rejectWithValue({ status: 400, message: 'Category is required.' });
    }

    try {
      const form = new FormData();
      form.append('item_name', item_name);
      form.append('item_type', item_type);
      form.append('manufacturer', manufacturer);
      form.append('seller_name', user.id);
      form.append('quantity', quantity);
      form.append('price', price);
      form.append('sku', sku);
      form.append('description', description);
      form.append('category', category);
      imageFiles.forEach((file) => form.append('image_files', file));

      const response = await api.post('store/items/', form, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      const status = err.response?.status ?? 500;
      const message = err.response?.data?.detail || err.message;
      return rejectWithValue({ status, message });
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  success: false,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItems.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addItems.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addItems.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || { message: 'Failed to add item.' };
      });
  },
});

// export const { } = storeSlice.actions; 
export default storeSlice.reducer;