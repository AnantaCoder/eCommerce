import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import api from '../../services/api'

export const fetchItemFeedback = createAsyncThunk(
  'analyze/fetchItemFeedback',
  async (itemId, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await api.get(`analyzer/item/${itemId}/recommendation/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data.detail || JSON.stringify(error.response.data)
          : error.message
      toast.error(`Failed to fetch feedback: ${message}`)
      return thunkAPI.rejectWithValue(message)
    }
  }
)

const analyzeSlice = createSlice({
  name: 'analyze',
  initialState: {
    feedback: null,
    details: [],
    summary: '',
    finalRecommendation: '',
    error: null,
    loading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchItemFeedback.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItemFeedback.fulfilled, (state, { payload }) => {
        state.loading = false
        state.error = null
         state.finalRecommendation = payload.final_recommendation
         state.summary  = payload.summary
        state.details = (payload.details || []).slice(0,5).map(d => ({
          text: d.reviews,
          label: d.label,
          confidence: d.confidence
        }))
        state.feedback = payload
      })
      .addCase(fetchItemFeedback.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
  }
})

export default analyzeSlice.reducer