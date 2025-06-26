import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";



export const fetchCategories = createAsyncThunk(
    'categories',
    async ({ categoryId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const params = { page: page, pageSize: pageSize }
            if (categoryId) params.categoryId = categoryId

            const response = await api.get('store/categories/', { params: params })

            // I think this part is song it has to return an array
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
// cerate categories will be added later 

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
        page: 1,
        totalPages: 1,
    },
    // reducers:{}
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
            });
    },
})

// export const {}

export default categorySlice.reducer