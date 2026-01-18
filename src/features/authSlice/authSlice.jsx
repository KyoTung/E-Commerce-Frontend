import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { toast } from "react-toastify";

// Lấy user từ localStorage
const getUserFromLocalStorage = () => {
  try {
    const customer = localStorage.getItem("customer");
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
  message: "",
};

// Thunk: Login
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue({ message });
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Thunk: Logout
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updatePassword = createAsyncThunk(
  "auth/update-password",
  async (passwordData, thunkAPI) => {
    try {
      return await authService.updatePassword(passwordData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const forgotPasswordToken = createAsyncThunk(
  "auth/forgot-password",
  async (email, thunkAPI) => {
    try {
      return await authService.forgotPasswordToken(email);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ token, password }, thunkAPI) => {
    try {
      return await authService.resetPassword(token, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // gọi axiosClient khi refresh token thất bại
    clearAuth: (state) => {
      state.user = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      localStorage.removeItem("customer");
    },
    resetState: (state) => {
      
      return initialState; 
      
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isSuccess = true;
      state.isError = false;
    },
  },
  
  
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("customer", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message;
        state.user = null;
      })

      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;  
        state.isSuccess = true;
        toast.success("Đăng ký tài khoản thành công!");
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload?.message || "Đăng ký tài khoản thất bại");
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        localStorage.removeItem("customer");
      })

      // --- UPDATE PASSWORD ---
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Đổi mật khẩu thành công!");
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload?.message || "Đổi mật khẩu thất bại");
      })

      // --- FORGOT PASSWORD ---
      .addCase(forgotPasswordToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPasswordToken.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Link reset mật khẩu đã được gửi vào email!");
      })
      .addCase(forgotPasswordToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload || "Không tìm thấy email");
      })

      // --- RESET PASSWORD ---
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Mật khẩu đã được đặt lại thành công!");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(
          action.payload?.message || "Token hết hạn hoặc không hợp lệ"
        );
      });
  },
});

export const { clearAuth, resetState, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
