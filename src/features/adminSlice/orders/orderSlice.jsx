import OrderService from "./orderService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};


export const updateOrder = createAsyncThunk("admin/order/update", async ({ orderId, orderData, token }, thunkAPI) => {
  try {
    const response = await OrderService.updateOrder(orderId, orderData, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

 export const getAllOrder = createAsyncThunk(
  "admin/order/get-all-order",
  async (token, thunkAPI) => {
    try {
      const response = await OrderService.getAllOrder(token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getOrder = createAsyncThunk("admin/order/get-order", async ({ orderId, token }, thunkAPI) => {
  try {
    const response = await OrderService.getOrder(orderId, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});


export const orderSlice = createSlice({
  name: "order-admin",
  initialState,
  reducers: {},
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
        state.error = action.payload?.message || "Failed to update order";
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
        state.error = action.payload?.message || "Failed to fetch order";
      })

      .addCase(getAllOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      });
  },
});

export default orderSlice.reducer;
