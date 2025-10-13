import brandService from "./brandService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
  loading: false,
  error: null,
};

export const createBrand = createAsyncThunk("admin/brand/create-brand",
  async ({ brandData, token }, thunkAPI) => {
    try {
      const response = await brandService.createBrand(brandData, token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  });

export const updateBrand = createAsyncThunk("admin/brand/update", async ({ brandId, brandData, token }, thunkAPI) => {
  try {
    const response = await brandService.updateBrand(brandId, brandData, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

 export const getAllBrand = createAsyncThunk(
  "admin/brand/get-all-brand",
  async (token, thunkAPI) => {
    try {
      const response = await brandService.getAllBrand(token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getBrand = createAsyncThunk("admin/brand/get-brand", async ({ brandId, token }, thunkAPI) => {
  try {
    const response = await brandService.getBrand(brandId, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const deleteBrand = createAsyncThunk("admin/brand/delete-brand", async ({ brandId, token }, thunkAPI) => {
  try {
    const response = await brandService.deleteBrand(brandId, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const brandSlice = createSlice({
  name: "brand-admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create brand";
      })

      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex(brand => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update brand";
      })

      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter(brand => brand.id !== action.payload.id);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete brand";
      })


    .addCase(getBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter(brand => brand.id !== action.payload.id);
      })
      .addCase(getBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch brand";
      })

      .addCase(getAllBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(getAllBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch brands";
      });
  },
});

export default brandSlice.reducer;
