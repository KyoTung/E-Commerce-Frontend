import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./customerService";

const initialState = {
  allUsers: [],
  userSelector: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export const createUser = createAsyncThunk(
  "user/create-user",
  async (userData, thunkAPI) => {
    try {
      const response = await customerService.createUser(userData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const updateUser = createAsyncThunk(
  "admin/user/update-user",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await customerService.updateUser(userId, userData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const updateUserRole  = createAsyncThunk(
  "admin/user/update-role",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await customerService.updateUserRole(userId, userData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const getUserInfo = createAsyncThunk(
  "/admin/user/get-user",
  async (userId, thunkAPI) => {
    try {
      const response = await customerService.getUserDetail(userId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const getAllUser = createAsyncThunk(
  "user/get-all-user",
  async ({ page, limit, search, role, status } = {}, thunkAPI) => {
    try {
      const params = {};
      if (page) params.page = page;
      if (limit) params.limit = limit;
      if (search) params.search = search;
      if (role) params.role = role;
      if (status) params.status = status;
      const response = await customerService.getAllUser(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/delete-user",
  async (userId, thunkAPI) => {
    try {
      const response = await customerService.deleteUser(userId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const blockUser = createAsyncThunk(
  "user/block-user",
  async (userId, thunkAPI) => {
    try {
      const response = await customerService.blockUser(userId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const unBlockUser = createAsyncThunk(
  "user/unblock-user",
  async (userId, thunkAPI) => {
    try {
      const response = await customerService.unBlockUser(userId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state) => {
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
    });
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

    builder.addCase(updateUserRole.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(updateUserRole.rejected, (state, action) => {
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
    builder
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message;
        state.userSelector = null;
      })

      builder.addCase(getAllUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      });
    
      builder.addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allUsers = action.payload.users;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      builder.addCase(getAllUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message;
        state.allUsers = [];
        state.total = 0;
        state.totalPages = 0;
      });

    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.allUsers = state.allUsers.filter(
        (user) => user._id !== action.payload.id,
      );
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
    });
    builder.addCase(blockUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(blockUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      const blockedUser = action.payload.data;
      if (blockedUser && blockedUser._id) {
        const index = state.allUsers.findIndex(
          (user) => user._id === blockedUser._id,
        );
        if (index !== -1) {
          state.allUsers[index] = blockedUser;
        }
      }
    });
    builder.addCase(blockUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
    });
    builder.addCase(unBlockUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(unBlockUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      const unblockedUser = action.payload.data;
      if (unblockedUser && unblockedUser._id) {
        const index = state.allUsers.findIndex(
          (user) => user._id === unblockedUser._id,
        );
        if (index !== -1) {
          state.allUsers[index] = unblockedUser;
        }
      }
    });
    builder.addCase(unBlockUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload?.message;
    });
  },
});

export default customerSlice.reducer;
