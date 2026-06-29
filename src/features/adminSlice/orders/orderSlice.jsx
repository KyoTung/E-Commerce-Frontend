import OrderService from "./orderService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ToastContainer, toast } from "react-toastify";

const initialState = {
  orders: [], // mảng orders của trang hiện tại
  order: null,
  loading: false,
  error: null,
  totalPages: 1,
  totalOrders: 0,
  currentPage: 1,
  imeiResult: null,
};

// export const updateOrder = createAsyncThunk(
//   "admin/order/update",
//   async ({ orderId, orderData }, thunkAPI) => {
//     try {
//       const response = await OrderService.updateOrder(orderId, orderData);
//       return response;
//     } catch (error) {
//       const message = error.response?.data?.message || error.message;
//       return thunkAPI.rejectWithValue({ message });
//     }
//   },
// );

export const updateOrder = createAsyncThunk(
  "admin/order/update",
  async ({ orderId, orderData }, thunkAPI) => {
    try {
      const response = await OrderService.updateOrder(orderId, orderData);
      return response;
    } catch (error) {
      // Ưu tiên lấy error.message hoặc error (từ backend)
      const message = error.response?.data?.error 
                   || error.response?.data?.message 
                   || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  },
);

export const getAllOrder = createAsyncThunk(
  "admin/order/get-all-order",
  async (params, thunkAPI) => {
    // nhận object params
    try {
      const response = await OrderService.getAllOrder(params);
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

export const adminCreateOrderThunk = createAsyncThunk(
  "orderAdmin/createOrder",
  async (orderData, thunkAPI) => {
    try {
      return await OrderService.adminCreateOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateImei = createAsyncThunk(
  "admin/order/update-imei",
  async ({ orderId, imeiList }, thunkAPI) => {
    try {
      const response = await OrderService.updateImei(orderId, imeiList);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getOrderByImei = createAsyncThunk(
  "admin/order/get-order-by-imei",
  async (imei, thunkAPI) => {
    try {
      const response = await OrderService.getOrderByImei(imei);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
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

    resetOrderAdminState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
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
      })

      .addCase(adminCreateOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(adminCreateOrderThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Tạo đơn hàng thành công");
      })
      .addCase(adminCreateOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || "Tạo đơn hàng thất bại");
      })

      .addCase(updateImei.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImei.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order; // cập nhật order mới
        toast.success("Cập nhật IMEI thành công");
      })
      .addCase(updateImei.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Cập nhật IMEI thất bại";
        toast.error(state.error);
      })
      .addCase(getOrderByImei.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByImei.fulfilled, (state, action) => {
        state.loading = false;
        // Lưu kết quả vào state mới (có thể thêm field imeiResult)
        state.imeiResult = action.payload;
      })
      .addCase(getOrderByImei.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Tra cứu IMEI thất bại";
      });
  },
});

export const { resetOrderState, resetOrderAdminState } = orderSlice.actions;
export default orderSlice.reducer;
