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
    return authService.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
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
      state.message = action.payload?.message || "Đăng nhập thất bại";
      state.user = null;
    });
  },
});

export default authSlice.reducer;