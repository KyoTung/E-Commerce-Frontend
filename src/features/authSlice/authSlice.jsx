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

//const tokenExpiryTime = Date.now() + 30*60*1000;
const tokenExpiryTime = Date.now() + 1000;

const getUserFromLocalstorage = (() => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  const user = JSON.parse(storedUser);
  const now = Date.now();

  if (user.expiresAt && now > user.expiresAt) {
    localStorage.removeItem("user");
    return null;
  }

  return user;
})();

const initialState = {
  user: getUserFromLocalstorage,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
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
