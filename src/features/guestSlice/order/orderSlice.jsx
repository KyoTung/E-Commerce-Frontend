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
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;