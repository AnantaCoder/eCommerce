import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';


// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    const toastId = toast.loading('Logging you in ⌛...', {
      position: 'bottom-right',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    })
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { access, refresh, user } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      // to save user’s type (e.g. seller)
      localStorage.setItem('user', JSON.stringify(user));

      toast.update(toastId,{
        render:"Login Successful 🥳",
        type:'success',
        isLoading:false,
        autoClose:5000
      })

      return { access, refresh, user };
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data.detail  || 'Login failed 🥺',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// for users to register 
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, first_name, last_name, is_seller }, { rejectWithValue }) => {
    const toastId = toast.loading('Creating your account...', {
      position: 'bottom-right',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });
    try {
      const response = await api.post('/auth/signup/', {
        email,
        first_name,
        last_name,
        password,
        password2: password,
        is_seller: is_seller || false,
      });
      toast.update(toastId, {
        render: 'Verification email sent! 📧',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
      return response.data;
    } catch (err) {
      // Update toast to error on failure
      toast.update(toastId, {
        render: err.response?.data.detail || err.message || 'Registration failed',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// for sellers to register 
export const sellerRegistration = createAsyncThunk(
  'auth/sellerRegistration',
  async ({ password, shop_name, gst_number, address }, { getState, rejectWithValue }) => {
    try {
      // 1. Pull current auth info from Redux
      const { accessToken, user } = getState().auth;
      if (!user?.email) {
        return rejectWithValue('User must be logged in to register as seller');
      }

      // 2. Call your seller‐registration endpoint
      const response = await api.post(
        '/auth/seller/',
        { email: user.email, password, shop_name, gst_number, address },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );

      // 3. If the endpoint returns new tokens, store them
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }

      // 4. Return whatever data you need in the fulfilled action
      return response.data;

    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const subscribeNewsletter = createAsyncThunk(
  'auth/subscribeNewsletter',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/newsletter/', { email });
      toast.success(response.data.detail, {
        position: 'bottom-right',
        autoClose: 4000,
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data.detail || 'Subscription failed.';
      toast.error(msg, {
        position: 'bottom-right',
        autoClose: 4000,
      });
      return rejectWithValue(msg);
    }
  }
)


export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await api.post('/auth/token/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      // since refresh token return user data , so loginstate= initial state
      return { access };
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return rejectWithValue('Token refresh failed', error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await api.post('/auth/logout/', { refresh: refreshToken });
    } catch (error) {
      // Continue with logout even if API call fails
      console.log("logout section error :- ", error)
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    return {};
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password/', payload)
      toast.success('Password reset successful!', {
        position: "bottom-right"
      })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Unexpected error occurred'
      toast.error(errorMessage, {
        position: "bottom-right"
      })
      return rejectWithValue(
        error.response?.data || { detail: 'Unexpected error occurred' }
      )
    }
  }
)

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/request-otp/', { email })
      toast.success('OTP sent successfully!', {
        position: "bottom-right"
      })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Could not send OTP'
      toast.error(errorMessage, {
        position: "bottom-right"
      })
      return rejectWithValue(
        error.response?.data || { detail: 'Could not send OTP' }
      )
    }
  }
)

// helper to get initial state from LS
const getInitialState = () => {
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null;

  } catch (err) {
    console.error("failed to user parsing from local storage", err)
    return null
  }
}



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialState(), // initialisation of user from local storage 
    // getting all the things from LS
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null,
    newsletterLoading: false,
    newsletterError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false; // this is important 
      // removing the data from ls
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    },
    setTokensAndLogin: (state, action) => {
      const { access, refresh, user } = action.payload;

      state.accessToken = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;

      if (user) {
        state.user = user;
      }
    }
  },
  extraReducers: (builder) => {


    // all logic is pending , fulfilled or rejected 
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; 
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // sellerRegistration cases
      .addCase(sellerRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellerRegistration.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sellerRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.access;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      //news letter 
      .addCase(subscribeNewsletter.pending, (state) => { state.newsletterLoading = true; state.newsletterError = null; })
      .addCase(subscribeNewsletter.fulfilled, (state) => { state.newsletterLoading = false; state.newsletterError = null; })
      .addCase(subscribeNewsletter.rejected, (state, action) => { state.newsletterLoading = false; state.newsletterError = action.payload; })
      // forget password
       .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.loading = false;
      })
      // otps cases 
       .addCase(sendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state) => {
        state.loading = false;
      });

  },
});

export const { clearError, clearAuth, setTokensAndLogin } = authSlice.actions;
export default authSlice.reducer;

/**
 * More on create async thunk-
 * https://medium.com/@bremarotta/redux-toolkit-createasyncthunk-829e139ea623
 */