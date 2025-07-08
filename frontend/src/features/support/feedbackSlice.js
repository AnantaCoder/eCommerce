// feedbackSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async (page = 1) => {
    const res = await api.get(`store/feedback/?page=${page}`)
    return res.data
  }
)
export const submitFeedback = createAsyncThunk(
  'feedback/submitFeedback',
  async (data) => {
    const res = await api.post(`store/feedback/`, data)
    return res.json()
  }
)

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    totalCount: 0,
    submitting: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.feedbacks;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.total_pages;
        state.hasNext = action.payload.has_next;
        state.hasPrevious = action.payload.has_previous;
        state.totalCount = action.payload.total_count;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Submit feedback
      .addCase(submitFeedback.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload.success) {
          state.feedbacks.unshift(action.payload.feedback);
          state.totalCount += 1;
        }
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, setCurrentPage } = feedbackSlice.actions;
export default feedbackSlice.reducer;