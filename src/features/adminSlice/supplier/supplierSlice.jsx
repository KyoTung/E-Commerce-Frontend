import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supplierService from "./supplierService";
import { toast } from "react-toastify";

// Async thunks
export const getSuppliers = createAsyncThunk(
  "supplier/getAll",
  async (params, thunkAPI) => {
    try {
      return await supplierService.getSuppliers(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  "supplier/create",
  async (supplierData, thunkAPI) => {
    try {
      return await supplierService.createSupplier(supplierData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "supplier/update",
  async ({ id, supplierData }, thunkAPI) => {
    try {
      return await supplierService.updateSupplier(id, supplierData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "supplier/delete",
  async (id, thunkAPI) => {
    try {
      return await supplierService.deleteSupplier(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  suppliers: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    resetSupplierState: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all
      .addCase(getSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.suppliers;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Create
      .addCase(createSupplier.fulfilled, (state, action) => {
        toast.success("Thêm nhà cung cấp thành công");
        // Không cần push vì sẽ reload lại danh sách (hoặc có thể push nếu muốn)
      })
      .addCase(createSupplier.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Update
      .addCase(updateSupplier.fulfilled, (state, action) => {
        toast.success("Cập nhật thành công");
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Delete
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        toast.success("Xóa nhà cung cấp thành công");
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const { resetSupplierState } = supplierSlice.actions;
export default supplierSlice.reducer;