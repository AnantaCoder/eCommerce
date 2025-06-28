import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const fetchOrders = createAsyncThunk(
  'order/fetchAll',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return rejectWithValue({ status: 401, message: 'Not authenticated' });
    }
    try {
      const response = await api.get('/store/orders/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.results; 
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to fetch orders';
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
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});



export default orderSlice.reducer;
