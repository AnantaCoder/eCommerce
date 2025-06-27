import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCategories = createAsyncThunk(
    'categories',
    async ({ categoryId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const params = { page: page, pageSize: pageSize }
            if (categoryId) params.categoryId = categoryId

            const response = await api.get('store/categories/', { params: params })

            return {
                categories: response.data.results,
                totalItems: response.data.count,
                page,
                pageSize
            }
        } catch (error) {
            const status = error.response?.status
            const message =
                error.response?.data?.detail ||
                error.message ||
                " Failed to fetch categories from the store :( "
            return rejectWithValue({ status, message })
        }
    }
)

export const fetchCategoricItems = createAsyncThunk(
    'categories/fetchCategoricItems',
    async ({ categoryId }, { rejectWithValue }) => {
        try {
            if (!categoryId) throw new Error("No categoryId provided");
            const response = await api.get(`store/categories/${categoryId}/items/`);
            
            // Log the response to debug
            console.log('API Response:', response.data);
            
            // Return the items directly from response.data
            return {
                items: response.data, // This should be the array of items
                categoryId
            };
        } catch (error) {
            console.error('Error fetching categoric items:', error);
            const status = error.response?.status;
            const message =
                error.response?.data?.detail ||
                error.message ||
                "Failed to fetch items for this category.";
            return rejectWithValue({ status, message });
        }
    }
)

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
        page: 1,
        totalPages: 1,
        categoricItems: [],
        categoricItemsLoading: false,
        categoricItemsError: null,
    },
    extraReducers: builder => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.page = payload.page;
                state.categories = payload.categories;
                state.totalPages = Math.ceil(payload.totalItems / payload.pageSize);
            })
            .addCase(fetchCategories.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(fetchCategoricItems.pending, (state) => {
                state.categoricItemsLoading = true;
                state.categoricItemsError = null;
            })
            .addCase(fetchCategoricItems.fulfilled, (state, { payload }) => {
                state.categoricItemsLoading = false;
                state.categoricItems = Array.isArray(payload.items) ? payload.items : [];
                console.log('Items set in state:', state.categoricItems);
            })
            .addCase(fetchCategoricItems.rejected, (state, { payload }) => {
                state.categoricItemsLoading = false;
                state.categoricItemsError = payload;
            });
    },
})

export default categorySlice.reducer