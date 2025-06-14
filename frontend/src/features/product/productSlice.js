// src/features/product/productSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';





// an asynchronous action to 
// page-1 so first page and pagesize = 10 so 10 product cards 
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ categoryId, search, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const params = { page, page_size: pageSize };
      if (categoryId) params.categoryId = categoryId;
      if (search)     params.search     = search;

      const response = await api.get('/store/items/', { params });
    //   console.log(response)
      return { 
        items: response.data.items,
        totalItems: response.data.total_items,
        page,
        pageSize
      };
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.detail ||
        err.message ||
        'Failed to fetch products from the store :(';
      return rejectWithValue({ status, message });
    }
  }
);


/**
 * slice struct:
 * initial slice - all initial features 
 * then all reducers + extra reducers (builder ob provides extra methods )
 */

const slice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    loading: false, //boolean flag 
    error: null,
    page: 1,
    totalPages: 1,
  },
  reducers: {
    resetProducts(state) {
      state.items = [];
      state.page = 1;
      state.totalPages = 1;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder

    // async action is dispatched and promise in pending
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //async action successfully resolves
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        // update page the number 
        state.page = payload.page;
        // pagination logic 
        state.items = payload.page === 1
          ? payload.items
          : [...state.items, ...payload.items];
        state.totalPages = Math.ceil(payload.totalItems / payload.pageSize);
      })
      // async action didnt work out successfully 
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { resetProducts } = slice.actions;
export default slice.reducer;
