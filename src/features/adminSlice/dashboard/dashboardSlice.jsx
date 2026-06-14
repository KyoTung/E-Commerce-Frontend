import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "./dashboardService";


export const fetchOverview = createAsyncThunk(
  "dashboard/fetchOverview",
  async ({ period, startDate, endDate } = {}, thunkAPI) => {
    try {
      const params = {};
      if (period) params.period = period;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      return await dashboardService.getOverview(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRevenueChart = createAsyncThunk(
  "dashboard/fetchRevenueChart",
  async ({ period, range, startDate, endDate } = {}, thunkAPI) => {
    try {
      const params = {};
      if (period) params.period = period;
      if (range) params.range = range;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      return await dashboardService.getRevenueChart(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  "dashboard/fetchTopProducts",
  async ({ limit = 5, by = "quantity", period = "month", startDate, endDate } = {}, thunkAPI) => {
    try {
      const params = { limit, by, period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      return await dashboardService.getTopProducts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchLowStock = createAsyncThunk(
  "dashboard/fetchLowStock",
  async (threshold = 5, thunkAPI) => {
    try {
      return await dashboardService.getLowStock(threshold);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRevenueByBrand = createAsyncThunk(
  'dashboard/fetchRevenueByBrand',
  async ({ startDate, endDate } = {}, thunkAPI) => {
    try {
      const response = await dashboardService.getRevenueByBrand({ startDate, endDate });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRevenueByCategory = createAsyncThunk(
  'dashboard/fetchRevenueByCategory',
  async ({ startDate, endDate } = {}, thunkAPI) => {
    try {
      const response = await dashboardService.getRevenueByCategory({ startDate, endDate });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  overview: {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    newCustomers: 0,
    lowStockCount: 0,
    period: {},
  },
  revenueChart: { data: [], period: "day", dateFormat: "YYYY-MM-DD" },
  topProducts: [],
  lowStockItems: [],
   brandData: [],      
  categoryData: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Revenue Chart
      .addCase(fetchRevenueChart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenueChart.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueChart = action.payload;
      })
      .addCase(fetchRevenueChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Top Products
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Low Stock
      .addCase(fetchLowStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.loading = false;
        state.lowStockItems = action.payload;
      })
      .addCase(fetchLowStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRevenueByBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenueByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brandData = action.payload;
      })
      .addCase(fetchRevenueByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRevenueByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenueByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryData = action.payload;
      })
      .addCase(fetchRevenueByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;