import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "./blogService";

const initialState = {
  blogs: [],
  blog: null,
  loading: false,
  error: null,
};


export const createBlog = createAsyncThunk(
  "admin/blog/create-blog",
  async (blogData, thunkAPI) => {
    try {
      const response = await blogService.createBlog(blogData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);


export const updateBlog = createAsyncThunk(
  "admin/blog/update",
  async ({ blogId, blogData }, thunkAPI) => {
    try {
      const response = await blogService.updateBlog(blogId, blogData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const getAllBlog = createAsyncThunk(
  "admin/blog/get-all-blog",
  async (_, thunkAPI) => {
    try {
      const response = await blogService.getAllBlog();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);


export const getBlog = createAsyncThunk(
  "admin/blog/get-blog",
  async (blogId, thunkAPI) => {
    try {
      const response = await blogService.getBlog(blogId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);


export const deleteBlog = createAsyncThunk(
  "admin/blog/delete-blog",
  async (blogId, thunkAPI) => {
    try {
      const response = await blogService.deleteBlog(blogId);
      return response; 
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const blogSlice = createSlice({
  name: "blog-admin",
  initialState,
  reducers: {
    
    resetBlogState: (state) => {
      state.error = null;
      state.loading = false;
      state.message = "";
    }
  },
  extraReducers: (builder) => {
    builder
      // --- CREATE ---
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        
        state.blogs.unshift(action.payload); 
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create blog";
      })

      // --- UPDATE ---
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
       
        const updatedBlog = action.payload;
        const index = state.blogs.findIndex((blog) => blog._id === updatedBlog._id || blog.id === updatedBlog.id);
        
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        }
       
        if (state.blog && (state.blog._id === updatedBlog._id)) {
            state.blog = updatedBlog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update blog";
      })

      // --- DELETE ---
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        
        const idToDelete = action.payload.deletedId; 
        
        state.blogs = state.blogs.filter(
          (blog) => blog._id !== idToDelete && blog.id !== idToDelete
        );
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete blog";
      })

      // --- GET SINGLE ---
      .addCase(getBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blog";
      })

      // --- GET ALL ---
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
        state.error = action.payload?.message || "Failed to fetch blogs";
      });
  },
});

export const { resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;