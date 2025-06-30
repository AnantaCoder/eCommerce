import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { toast } from "react-toastify";

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
      })
      toast.success('Item added ++   . 💥', {
        position: "bottom-right",
        autoClose: 3000,
      })
      return response.data;
    } catch (err) {
      const status = err.response?.status ?? 500;
      const message = err.response?.data?.detail || err.message;
      return rejectWithValue({ status, message });
    }
  }
);
// put-update and delete methods 
export const deleteItems = createAsyncThunk(
  'product/deleteProduct',
  async ({ itemId }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      });
    }
    try {
      const response = await api.delete(`store/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Item Deleted  . 💥', {
        position: "bottom-right",
        autoClose: 5000,
      })
      return response.data || itemId
    } catch (error) {
      const msg = error.response?.data?.detail || error.message;
      toast.error(`Delete failed: ${msg}`,{
        position: "bottom-right",
        autoClose: 3000,
      });
      return rejectWithValue({ message: msg })
    }
  }
)
export const updateItems = createAsyncThunk(
  'product/updateProduct',
  async ({ itemId,data }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return rejectWithValue({
        status: 401,
        message: "Must be logged in to perform this action",
      });
    }
    try {
      const response = await api.put(`store/items/${itemId}/`,data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Item Updated   . 💥', {
        position: "bottom-right",
        autoClose: 3000,
      })
      return response.data
    }  catch (error) {
      const msg = error.response?.data?.detail || error.message;
      toast.error(`Update failed: ${msg}`,{
        position: "bottom-right",
        autoClose: 3000,
      });
      return rejectWithValue({ message: msg })
    }
  }
)


export const fetchSellerItems = createAsyncThunk(
  'store/fetchSellerItems',
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/store/items/?seller=${sellerId}`);
      return response.data.results;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch seller items" });
    }
  }
)



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
      })
      //for delete 
      .addCase(deleteItems.fulfilled,(state,{payload:deletedId})=>{
        state.items = state.items.filter(item=>item.id !== deletedId)
      })
      // for update 
      .addCase(updateItems.fulfilled,(state,{payload:updatedItem})=>{
        state.items = state.map(i=>i.id===updatedItem.id?updatedItem:i)
      })
      .addCase(fetchSellerItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  },
});

export const selectOrderState = state => state.order
export const selectOrderItems = state => state.order.items


export default storeSlice.reducer;