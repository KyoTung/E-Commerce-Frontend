import categoryService from "./categoryService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

 export const getAllCategory = createAsyncThunk(
  "admin/category/get-all-category",
  async (token, thunkAPI) => {
    try {
      const response = await categoryService.getAllCategory(token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);


export const categorySlice = createSlice({
  name: "category-admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      });
  },
});

export default categorySlice.reducer;
