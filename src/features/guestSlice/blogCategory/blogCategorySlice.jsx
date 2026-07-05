import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogCategoryService from "./blogCategoryService";
import { toast } from "react-toastify";

 export const fetchAllBlogCategories = createAsyncThunk(
  "admin/blogCategory/get-all-blogCategory",
  async (thunkAPI) => {
    try {
      const response = await blogCategoryService.getAllBlogCategories();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const blogCategorySlice = createSlice({
  name: "blogCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;

      })
      .addCase(fetchAllBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export default blogCategorySlice.reducer;