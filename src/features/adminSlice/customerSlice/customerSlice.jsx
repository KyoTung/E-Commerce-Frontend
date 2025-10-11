import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./customerService";


const initialState = {
  allUsers: [],
  userSelector: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createUser = createAsyncThunk("user/create-user", async ( userData , thunkAPI) => {
  try {
    const response = await customerService.createUser(userData);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
}); 

export const updateUser = createAsyncThunk("admin/user/update-user", async ({userId, userData, token }, thunkAPI) => {
  try {
    const response = await customerService.updateUser(userId, userData, token); 
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const getUserInfo = createAsyncThunk("/admin/user/get-user", async ({userId, token}, thunkAPI) => {
  try {
    const response = await customerService.getUserDetail(userId, token);
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

export const deleteUser = createAsyncThunk("user/delete-user", async ({userId, token}, thunkAPI) => {
  try {
    const response = await customerService.deleteUser(userId, token);   
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
    builder.addCase(createUser.pending, (state) =>{
      state.isLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => { 
      state.isLoading = false;
      state.isSuccess = true;
      state.allUsers.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
    });

    builder.addCase(updateUser.pending, (state) => { 
      state.isLoading = true;
     })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true; 
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
    });

    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.userSelector = action.payload;
    });
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
      state.userSelector = null;
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

    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.allUsers = state.allUsers.filter(user => user._id !== action.payload.id);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
    });  
  },
});

export default customerSlice.reducer;
