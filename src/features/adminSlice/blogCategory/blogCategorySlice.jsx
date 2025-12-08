import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogCategoryService from "./blogCategoryService";

const initialState = {
  brands: [],
  loading: false,
  error: null,
};

export const createBlogCategory = createAsyncThunk("admin/blogCategory/create-blogCategory",
  async ({ blogCategoryData }, thunkAPI) => {
    try {
      const response = await blogCategoryService.createBlogCategory(blogCategoryData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  });

export const updateBlogCategory = createAsyncThunk("admin/blogCategory/update", async ({ blogCategoryId, blogCategoryData }, thunkAPI) => {
  try {
    const response = await blogCategoryService.updateBlogCategory(blogCategoryId, blogCategoryData);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

 export const getAllBlogCategory = createAsyncThunk(
  "admin/blogCategory/get-all-blogCategory",
  async (thunkAPI) => {
    try {
      const response = await blogCategoryService.getAllBlogCategory();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getBlogCategory = createAsyncThunk("admin/blogCategory/get-blogCategory", async ({ blogCategoryId }, thunkAPI) => {
  try {
    const response = await blogCategoryService.getBlogCategory(blogCategoryId);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const deleteBlogCategory = createAsyncThunk("admin/blogCategory/delete-blogCategory", async (blogCategoryId, thunkAPI) => {
  try {
    const response = await blogCategoryService.deleteBlogCategory(blogCategoryId);
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
        state.blogCategories.push(action.payload);
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
        const index = state.blogCategories.findIndex(blogCategory => blogCategory.id === action.payload.id);
        if (index !== -1) {
          state.blogCategories[index] = action.payload;
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
        state.blogCategories = state.blogCategories.filter(blogCategory => blogCategory.id !== action.payload.id);
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
        state.blogCategories = state.blogCategories.filter(blogCategory => blogCategory.id !== action.payload.id);
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
        state.blogCategories = action.payload;
      })
      .addCase(getAllBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blog categories";
      });
  },
});



export const { resetState } = blogCategorySlice.actions;
export default blogCategorySlice.reducer;