import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";
import { toast } from "react-toastify";
import { resetCartState } from "../cart/cartSlice"; 

const initialState = {
  orders: [],        
  currentOrder: null, 
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// --- THUNKS ---

// 1. Create Order
export const createOrder = createAsyncThunk(
  "order/create-order",
  async (orderData, thunkAPI) => {
    try {
      const response = await orderService.createOrder(orderData);
      
      // Sau khi tạo đơn hàng thành công, ta cần xóa giỏ hàng ở Client State
      // (Backend đã xóa trong DB rồi, nhưng Redux state vẫn còn lưu)
      thunkAPI.dispatch(resetCartState()); 
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. Get User Orders
export const getUserOrders = createAsyncThunk(
  "order/get-user-orders",
  async (_, thunkAPI) => {
    try {
      return await orderService.getUserOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. Get Order Detail
export const getOrderDetail = createAsyncThunk(
  "order/get-order-detail",
  async (id, thunkAPI) => {
    try {
      return await orderService.getOrderDetail(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancel-order",
  async (id, thunkAPI) => {
    try {
      return await orderService.cancelOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.currentOrder = null; // Reset đơn hàng vừa tạo để chuẩn bị cho đơn mới
    },
  },
  extraReducers: (builder) => {
    builder
      // --- CREATE ORDER ---
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.currentOrder = action.payload.order;
        toast.success("Đặt hàng thành công!");
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.error || "Đặt hàng thất bại";
        toast.error(state.message);
      })

      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.orders = action.payload; 
       
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      })

      // --- GET ORDER DETAIL ---
      .addCase(getOrderDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      })

      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        const updatedOrder = action.payload.cancelledOrder;
        // 1. Cập nhật trong danh sách orders
        if (state.orders && state.orders.length > 0) {
           const index = state.orders.findIndex((o) => o._id === updatedOrder._id);
           if (index !== -1) {
             state.orders[index] = updatedOrder;
           }
        }
        // 2. Cập nhật currentOrder (nếu đang xem chi tiết đơn hàng đó)
        if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }

        toast.success("Hủy đơn hàng thành công!");
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Hủy đơn thất bại";
        toast.error(state.message);
      });

  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;