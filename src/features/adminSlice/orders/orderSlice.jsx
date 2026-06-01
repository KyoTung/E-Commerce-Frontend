import OrderService from "./orderService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  orders: [], // mảng orders của trang hiện tại
  order: null,
  loading: false,
  error: null,
  totalPages: 1,
  totalOrders: 0,
  currentPage: 1,
};

export const updateOrder = createAsyncThunk(
  "admin/order/update",
  async ({ orderId, orderData }, thunkAPI) => {
    try {
      const response = await OrderService.updateOrder(orderId, orderData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const getAllOrder = createAsyncThunk(
  "admin/order/get-all-order",
  async ({ page, limit, search } = {}, thunkAPI) => {
    try {
      const response = await OrderService.getAllOrder(page, limit, search);
      return response; // { orders, totalPages, totalOrders, currentPage }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);
export const getOrder = createAsyncThunk(
  "admin/order/get-order",
  async (orderId, thunkAPI) => {
    try {
      const response = await OrderService.getOrder(orderId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const orderSlice = createSlice({
  name: "order-admin",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Cập nhật đơn hàng thất bại";
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Lấy chi tiết đơn hàng thất bại";
      })
      .addCase(getAllOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalPages = action.payload.totalPages;
        state.totalOrders = action.payload.totalOrders;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getAllOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Lấy danh sách đơn hàng thất bại";
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
