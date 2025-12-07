import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Lấy user từ localStorage (chỉ thông tin profile, ko có token)
const getUserFromLocalStorage = () => {
  try {
    const customer = localStorage.getItem('customer');
    return customer ? JSON.parse(customer) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: getUserFromLocalStorage(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Thunk: Login
export const login = createAsyncThunk(
  'auth/login',
  async (user, thunkAPI) => {
    try {
      return await authService.login(user);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk: Logout (Chủ động bấm nút đăng xuất)
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      return await authService.logout();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action này được gọi từ axiosClient khi refresh token thất bại
    clearAuth: (state) => {
      state.user = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
      localStorage.removeItem('customer');
    },
  },
  extraReducers: (builder) => {
    builder
      // --- XỬ LÝ LOGIN ---
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // Payload này KHÔNG chứa token
        localStorage.setItem('customer', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.user = null;
      })
      
      // --- XỬ LÝ LOGOUT ---
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false; // Reset trạng thái để tránh trigger linh tinh
        localStorage.removeItem('customer');
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;