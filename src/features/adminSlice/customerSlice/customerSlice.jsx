import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./customerService";



const initialState = {
  allUsers: [],
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};



export const getUser = createAsyncThunk("user/get-user", async ({userId, token}, thunkAPI) => {
  try {
    const response = await customerService.getUser(userId, token);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const getAllUser = createAsyncThunk("user/get-all-user", async (token, thunkAPI) => {
  try {
    const response = await customerService.getAllUser(token);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
   
});

export const customerSlice = createSlice({
  name: "customer",
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
      localStorage.setItem("customer", JSON.stringify(action.payload));
    });

    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
      state.user = null;
    });


    builder.addCase(getAllUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.allUsers = action.payload;
    });
    builder.addCase(getAllUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
      state.allUsers = [];
    });
  },
});

export default customerSlice.reducer;
