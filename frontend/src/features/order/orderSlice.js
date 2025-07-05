import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const fetchOrders = createAsyncThunk(
  'order/fetchAll',
  async (page = 1, { rejectWithValue }) => {
    const limit = 10;
    const token = localStorage.getItem('access_token');
    if (!token) {
      return rejectWithValue({ status: 401, message: 'Not authenticated' });
    }
    try {
      const response = await api.get(`/store/orders/?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        items: response.data.results,
        totalItems: response.data.count,
        currentPage: page,
        totalPages: Math.ceil(response.data.count / limit),
      };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to fetch orders';
      toast.error(msg, { position: 'top-center', autoClose: 3000 });
      return rejectWithValue(msg);
    }
  }
);

export const addOrderAddress = createAsyncThunk(
  'order/addAddress',
  async ({ user, phone_number, shipping_address, country, city }, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    const params = { user, phone_number, shipping_address, country, city };
    try {
      const response = await api.post('/store/order_address/', params, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add order address';
      toast.error(msg, { position: 'top-center', autoClose: 3000 });
      return rejectWithValue(msg);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    addressStatus: 'idle',
    addressError: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addOrderAddress.pending, state => {
        state.addressStatus = 'loading';
        state.addressError = null;
      })
      .addCase(addOrderAddress.fulfilled, state => {
        state.addressStatus = 'succeeded';
      })
      .addCase(addOrderAddress.rejected, (state, action) => {
        state.addressStatus = 'failed';
        state.addressError = action.payload;
      });
  },
});

export default orderSlice.reducer;