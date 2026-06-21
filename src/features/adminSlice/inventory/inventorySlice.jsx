import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryService from "./inventoryService";
import { toast } from "react-toastify";

// ---------- Async Thunks ----------
export const getTransactions = createAsyncThunk(
  "inventory/getTransactions",
  async (params, thunkAPI) => {
    try {
      return await inventoryService.getTransactions(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getTransactionById = createAsyncThunk(
  "inventory/getTransactionById",
  async (id, thunkAPI) => {
    try {
      return await inventoryService.getTransactionById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createImport = createAsyncThunk(
  "inventory/createImport",
  async (data, thunkAPI) => {
    try {
      return await inventoryService.createImportTransaction(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createExport = createAsyncThunk(
  "inventory/createExport",
  async (data, thunkAPI) => {
    try {
      return await inventoryService.createExportTransaction(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const cancelTransaction = createAsyncThunk(
  "inventory/cancelTransaction",
  async (id, thunkAPI) => {
    try {
      return await inventoryService.cancelTransaction(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getStock = createAsyncThunk(
  "inventory/getStock",
  async (params, thunkAPI) => {
    try {
      return await inventoryService.getStock(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// ---------- Initial State ----------
const initialState = {
  transactions: [],
  currentTransaction: null,
  stockItems: [],
  totalStock: 0,
  totalTransactions: 0,
  currentPage: 1,
  limit: 10,
  loading: false,
  error: null,
  importSuccess: false,
  exportSuccess: false,
};

// ---------- Slice ----------
const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    resetInventoryState: (state) => {
      state.error = null;
      state.loading = false;
      state.importSuccess = false;
      state.exportSuccess = false;
    },
    clearImportSuccess: (state) => {
      state.importSuccess = false;
    },
    clearExportSuccess: (state) => {
      state.exportSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.totalTransactions = action.payload.total;
        state.currentPage = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Lấy danh sách giao dịch thất bại");
      })
      // Get Transaction by ID
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.currentTransaction = action.payload;
      })
      // Create Import
      .addCase(createImport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createImport.fulfilled, (state, action) => {
        state.loading = false;
        state.importSuccess = true;
        toast.success("Nhập kho thành công");
      })
      .addCase(createImport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Nhập kho thất bại");
      })
      // Create Export
      .addCase(createExport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExport.fulfilled, (state, action) => {
        state.loading = false;
        state.exportSuccess = true;
        toast.success("Xuất kho thành công");
      })
      .addCase(createExport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Xuất kho thất bại");
      })
      // Cancel Transaction
      .addCase(cancelTransaction.fulfilled, (state, action) => {
        toast.success("Hủy phiếu thành công");
      })
      .addCase(cancelTransaction.rejected, (state, action) => {
        toast.error("Hủy phiếu thất bại");
      })
      // Get Stock
      .addCase(getStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStock.fulfilled, (state, action) => {
        state.loading = false;
        // Nhận dữ liệu phân trang từ API mới gửi về
        state.stockItems = action.payload.stockItems || [];
        state.totalStock = action.payload.total || 0;
        state.currentPage = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.stockItems = [];
        state.totalStock = 0;
        state.totalPages = 1;
        toast.error("Lấy danh sách tồn kho thất bại");
      });
  },
});

export const { resetInventoryState, clearImportSuccess, clearExportSuccess } =
  inventorySlice.actions;
export default inventorySlice.reducer;
