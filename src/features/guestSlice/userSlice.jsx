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


export const getUser = createAsyncThunk("user/get-user", async ({userId, token}, thunkAPI) => {
  try {
    const response = await userService.getUser(userId, token);
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
  },
});

export default userSlice.reducer;
