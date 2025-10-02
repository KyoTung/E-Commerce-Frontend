import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";


const initialState = {
  user: {},
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
    });

    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message =
        action.payload?.message;
      state.user = null;
    });
  },
});

export default userSlice.reducer;
