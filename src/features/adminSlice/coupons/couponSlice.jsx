import couponService from "./couponService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  coupons: [],
  coupon: null,
  loading: false,
  error: null,
};

export const createCoupon = createAsyncThunk("admin/coupon/create-coupon",
  async ({ couponData, token }, thunkAPI) => {
    try {
      const response = await couponService.createCoupon(couponData, token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  });

export const updateCoupon = createAsyncThunk("admin/coupon/update", async ({ couponId, couponData, token }, thunkAPI) => {
  try {
    const response = await couponService.updateCoupon(couponId, couponData, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

 export const getAllCoupon = createAsyncThunk(
  "admin/coupon/get-all-coupon",
  async (token, thunkAPI) => {
    try {
      const response = await couponService.getAllCoupon(token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getCoupon = createAsyncThunk("admin/coupon/get-coupon", async ({ couponId, token }, thunkAPI) => {
  try {
    const response = await couponService.getCoupon(couponId, token);  
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const deleteCoupon = createAsyncThunk("admin/coupon/delete-coupon", async ({ couponId, token }, thunkAPI) => {
  try {
    const response = await couponService.deleteCoupon(couponId, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const couponSlice = createSlice({
  name: "coupon-admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon .rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create category";
      })

      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(coupon => coupon.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update category";
      })

      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(coupon => coupon.id !== action.payload.id);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete coupon";
      })


    .addCase(getCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(coupon => coupon.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(getCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch coupon";
      })

      .addCase(getAllCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getAllCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch coupons";
      });
  },
});

export default couponSlice.reducer;
