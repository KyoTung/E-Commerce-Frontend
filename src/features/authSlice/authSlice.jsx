import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const userState = {
  _id: null,
  fullName: null,
  email: null,
  address: null,
  phone: null,
  token: null,
};

const initialState = {
  user: userState,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};



export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    //return authService.login(user);
    const response = await authService.login(user);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Đăng nhập thất bại";
    return thunkAPI.rejectWithValue({ message });
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message =
        action.payload?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      state.user = null;
    });
  },
});

export default authSlice.reducer;
