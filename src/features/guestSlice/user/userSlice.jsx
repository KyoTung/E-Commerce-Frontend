import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const getUserFromLocalstorage = () => {
  const user = localStorage.getItem("user_info");
  return user ? JSON.parse(user) : null;
}

const initialState = {
  user: getUserFromLocalstorage(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};


export const getUser = createAsyncThunk("user/get-user", async (userId, thunkAPI) => {
  try {
    const response = await userService.getUser(userId);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const updateInfor = createAsyncThunk("user/update-infor", async ({ userData, id }, thunkAPI) => {
  try {
    const response = await userService.updateUser(userData, id);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});



export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
      localStorage.setItem("user_info", JSON.stringify(action.payload));
    });

    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message =
        action.payload?.message;
      state.user = null;
    });

    builder.addCase(updateInfor.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateInfor.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
      localStorage.setItem("user_info", JSON.stringify(action.payload));
    });
    builder.addCase(updateInfor.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message =
        action.payload?.message;
    });
  },
});

export default userSlice.reducer;
