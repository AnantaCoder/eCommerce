import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (itemId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const config = accessToken ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      } : {};

      const res = await api.get(`/store/reviews/?item=${itemId}`, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch reviews");
    }
  }
)
export const reviewStatus = createAsyncThunk(
  "reviews/Status",
  async (itemId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const config = accessToken ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      } : {};
      // store/reviews/is-reviewed?item_id=9
      const res = await api.get(`/store/reviews/is-reviewed?item_id=${itemId}`, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch review status");
    }
  }
)

export const addReview = createAsyncThunk(
  "reviews/add",
  async ({ item, rating, comment }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        return rejectWithValue("Authentication required");
      }

      const res = await api.post("/store/reviews/", { item, rating, comment }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to add review");
    }
  }
)

export const fetchUserReviews = createAsyncThunk(
  "reviews/fetchUserReviews",
  async (page = 1, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token")

    try {

      if (!accessToken) {
        return rejectWithValue("Authentication required");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      };

      const res = await api.get(`/store/reviews/?page=${page}`, config);
      return { data: res.data, page }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch user reviews");
    }
  }
)


export const fetchPendingReviews = createAsyncThunk(
  "reviews/fetchPendingReviews",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return rejectWithValue("Authentication required");

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const res = await api.get(`/store/reviews/pending-reviews/`, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch pending reviews");
    }
  }
);


const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    userReviews: [],
    userReviewsLoading: false,
    loading: false,
    error: null,
    userReviewsError: null,
    reviewed: false,
    statusLoading: false,
    statusError: null,
    currentPage: 1,
    pendingReviews: [],
    pendingReviewsLoading: false,
    pendingReviewsError: null,

  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results || action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reviewStatus.pending, (state) => {
        state.statusLoading = true;
        state.statusError = null;
      })
      .addCase(reviewStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.reviewed = action.payload.reviewed;
      })
      .addCase(reviewStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.statusError = action.payload;
        state.reviewed = false;
      })
      .addCase(fetchUserReviews.pending, (state) => {
        state.userReviewsLoading = true;
        state.userReviewsError = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        const { data, page } = action.payload;

        state.userReviewsLoading = false;
        state.userReviews = data.results;
        state.currentPage = page;
        state.nextPage = data.next ? page + 1 : null;
        state.totalPages = Math.ceil(data.count / data.results.length);
        console.log(" state.totalPages", state.totalPages)
      })

      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.userReviewsLoading = false;
        state.userReviewsError = action.payload;
      })

      .addCase(fetchPendingReviews.pending, (state) => {
        state.pendingReviewsLoading = true
        state.pendingReviewsError = null
      })
      .addCase(fetchPendingReviews.fulfilled, (state, action) => {
        state.pendingReviewsLoading = false;
        state.pendingReviews = action.payload.pending_reviews
        state.totalUniqueOrders = action.payload.total_unique_orders
        state.totalUserReviews = action.payload.total_reviews
      })
      .addCase(fetchPendingReviews.rejected, (state, action) => {
        state.pendingReviewsLoading = false
        state.pendingReviewsError = action.payload
      })

  },
});


export const selectPendingReviews = (state) => state.reviews.pendingReviews;
export const selectPendingLoading = (state) => state.reviews.pendingReviewsLoading;

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;