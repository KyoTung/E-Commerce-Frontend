import blogService from "./blogService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
  loading: false,
  error: null,
};

export const createBlog = createAsyncThunk("admin/blog/create-blog",
  async ({ blogData, token }, thunkAPI) => {
    try {
      const response = await blogService.createBlog(blogData, token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  });

export const updateBlog = createAsyncThunk("admin/blog/update", async ({ blogId, blogData, token }, thunkAPI) => {
  try {
    const response = await blogService.updateBlog(blogId, blogData, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

 export const getAllBlog = createAsyncThunk(
  "admin/blog/get-all-blog",
  async (token, thunkAPI) => {
    try {
      const response = await blogService.getAllBlog(token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getBlog = createAsyncThunk("admin/blog/get-blog", async ({ blogId, token }, thunkAPI) => {
  try {
    const response = await blogService.getBlog(blogId, token);  
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const deleteBlog = createAsyncThunk("admin/blog/delete-blog", async ({ blogId, token }, thunkAPI) => {
  try {
    const response = await blogService.deleteBlog(blogId, token);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const blogSlice = createSlice({
  name: "blog-admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create blog ";
      })

      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update blog ";
      })
 
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter(cat => cat.id !== action.payload.id);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete blog ";
      })


    .addCase(getBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blog ";
      })

      .addCase(getAllBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getAllBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blog blogs";
      });
  },
});

export default blogSlice.reducer;
