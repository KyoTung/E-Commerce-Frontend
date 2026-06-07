import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryService from "./inventoryService";
import { toast } from "react-toastify";

// Async thunks
export const getTransactions = createAsyncThunk(
  "inventory/getTransactions",
  async (params, thunkAPI) => {
    try {
      return await inventoryService.getTransactions(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createImport = createAsyncThunk(
  "inventory/createImport",
  async (data, thunkAPI) => {
    try {
      return await inventoryService.createImport(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createExport = createAsyncThunk(
  "inventory/createExport",
  async (data, thunkAPI) => {
    try {
      return await inventoryService.createExport(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const cancelTransaction = createAsyncThunk(
  "inventory/cancelTransaction",
  async (id, thunkAPI) => {
    try {
      return await inventoryService.cancelTransaction(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getStock = createAsyncThunk(
  "inventory/getStock",
  async (params, thunkAPI) => {
    try {
      return await inventoryService.getStock(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTransactionDetail = createAsyncThunk(
  "inventory/getTransactionDetail",
  async (id, thunkAPI) => {
    try {
      return await inventoryService.getTransactionDetail(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  transactions: [],
  currentTransaction: null,
  stockList: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    resetInventoryState: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Create import
      .addCase(createImport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createImport.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Nhập kho thành công");
        // Có thể thêm giao dịch mới vào đầu danh sách nếu muốn
      })
      .addCase(createImport.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      // Create export
      .addCase(createExport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExport.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Xuất kho thành công");
      })
      .addCase(createExport.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      // Cancel transaction
      .addCase(cancelTransaction.fulfilled, (state, action) => {
        toast.success("Đã hủy phiếu và hoàn trả số lượng");
      })
      .addCase(cancelTransaction.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Get stock
      .addCase(getStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stockList = action.payload.stock;
      })
      .addCase(getStock.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      // Get transaction detail
      .addCase(getTransactionDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(getTransactionDetail.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      });
  },
});

export const { resetInventoryState } = inventorySlice.actions;
export default inventorySlice.reducer;