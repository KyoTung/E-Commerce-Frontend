import blogCategoryService from "./blogCategoryService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const createBlogCategory = createAsyncThunk("admin/blogCategory/create-blogCategory",
  async ({ blogCategoryData, token }, thunkAPI) => {
    try {
      const response = await blogCategoryService.createBlogCategory(blogCategoryData, token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  });

export const updateBlogCategory = createAsyncThunk("admin/blogCategory/update", async ({ blogCategoryId, blogCategoryData, token }, thunkAPI) => {
  try {
    const response = await blogCategoryService.updateBlogCategory(blogCategoryId, blogCategoryData, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

 export const getAllBlogCategory = createAsyncThunk(
  "admin/blogCategory/get-all-blogCategory",
  async (token, thunkAPI) => {
    try {
      const response = await blogCategoryService.getAllBlogCategory(token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getBlogCategory = createAsyncThunk("admin/blogCategory/get-blogCategory", async ({ blogCategoryId, token }, thunkAPI) => {
  try {
    const response = await blogCategoryService.getBlogCategory(blogCategoryId, token);  
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const deleteBlogCategory = createAsyncThunk("admin/blogCategory/delete-blogCategory", async ({ blogCategoryId, token }, thunkAPI) => {
  try {
    const response = await blogCategoryService.deleteBlogCategory(blogCategoryId, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const blogCategorySlice = createSlice({
  name: "blogCategory-admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create blog category";
      })

      .addCase(updateBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update blog category";
      })
 
      .addCase(deleteBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(cat => cat.id !== action.payload.id);
      })
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete blog category";
      })


    .addCase(getBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(getBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blog category";
      })

      .addCase(getAllBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blog categories";
      });
  },
});

export default blogCategorySlice.reducer;
