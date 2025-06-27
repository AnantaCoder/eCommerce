// src/features/product/productSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';





// an asynchronous action to 
// page-1 so first page and pagesize = 10 so 10 product cards 
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ categoryId, search, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const params = { page, page_size: pageSize };
      if (categoryId) params.categoryId = categoryId;
      if (search) params.search = search;

      const response = await api.get('/store/items/', { params });  
     

      //   console.log(response)
      return {
        items: response.data.results,
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
    individualProduct: null, // for single product details
    individualLoading: false,
    individualError: null,
  },
  reducers: {
    resetProducts(state) {
      state.items = [];
      state.page = 1;
      state.totalPages = 1;
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

      // async action is dispatched and promise in pending
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //async action successfully resolves
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.page = payload.page;
        if (payload.page === 1) {
          state.items = payload.items;
        } else {
          state.items = [...state.items, ...payload.items];
        }
        state.totalPages = Math.ceil(payload.totalItems / payload.pageSize);
      })
      // async action didnt work out successfully 
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // for individual items 
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

export const { resetProducts ,clearIndividualProduct} = slice.actions;
export default slice.reducer;
