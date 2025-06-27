import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ categoryId, search, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const params = { page, page_size: pageSize };
      if (categoryId) params.categoryId = categoryId;
      if (search) params.search = search;

      const response = await api.get('/store/items/', { params });

      return {
        items: response.data.results,
        totalItems: response.data.count,
        totalPages: Math.ceil(response.data.count / pageSize),
        page,
        pageSize
      };
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.detail ||
        err.message ||
        'Failed to fetch products from the store :(';
      toast.error(`Error ${status ? `${status}: ` : ''}${message}`, {
        position: "top-center",
        autoClose: 5000,
      });
      return rejectWithValue({ status, message });
    }
  }
)

export const fetchIndividualProduct = createAsyncThunk(
  'product/fetchIndividualProduct',
  async ({ itemId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/store/items/${itemId}/`);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.detail ||
        error.message ||
        "Failed to fetch product details";
      toast.error(`Error ${status ? `${status}: ` : ''}${message}`, {
        position: "top-center",
        autoClose: 3000,
      });
      return rejectWithValue({ status, message });
    }
  }
)

const slice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalItems: 0,
    individualProduct: null,
    individualLoading: false,
    individualError: null,
  },
  reducers: {
    resetProducts(state) {
      state.items = [];
      state.page = 1;
      state.totalPages = 1;
      state.totalItems = 0;
      state.error = null;
    },
    clearIndividualProduct(state) {
      state.individualProduct = null;
      state.individualLoading = false;
      state.individualError = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { items, totalItems, totalPages, page } = action.payload;
        
        if (page > 1) {
          state.items = [...state.items, ...items];
        } else {
          state.items = items;
        }
        
        state.totalItems = totalItems;
        state.totalPages = totalPages;
        state.page = page;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      
      .addCase(fetchIndividualProduct.pending, (state) => {
        state.individualLoading = true;
        state.individualError = null;
      })
      .addCase(fetchIndividualProduct.fulfilled, (state, { payload }) => {
        state.individualLoading = false;
        state.individualError = null;
        state.individualProduct = payload;
      })
      .addCase(fetchIndividualProduct.rejected, (state, { payload }) => {
        state.individualLoading = false;
        state.individualError = payload;
        state.individualProduct = null;
      })
  },
});

export const { resetProducts, clearIndividualProduct } = slice.actions;
export default slice.reducer;