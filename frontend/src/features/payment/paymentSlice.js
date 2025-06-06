import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payment: 0,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    fetchPaymentStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPaymentSuccess(state, action) {
      state.loading = false;
      state.payment = action.payload;
    },
    fetchPaymentFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPaymentStart,
  fetchPaymentSuccess,
  fetchPaymentFailure,
} = paymentSlice.actions;

export default paymentSlice.reducer;
