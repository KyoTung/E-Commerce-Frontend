import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "./blogService";
import { toast } from "react-toastify";

// Async thunks
export const fetchAllBlogs = createAsyncThunk(
  "blog/fetchAll",
  async ({ category, page, limit, search } = {}, thunkAPI) => {
    try {
      const params = {};
      if (category) params.category = category;
      if (page) params.page = page;
      if (limit) params.limit = limit;
      if (search) params.search = search;
      return await blogService.getAllBlogs(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const fetchBlogById = createAsyncThunk(
  "blog/fetchById",
  async (id, thunkAPI) => {
    try {
      return await blogService.getBlog(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const likeBlog = createAsyncThunk(
  "blog/like",
  async (blogId, thunkAPI) => {
    try {
      return await blogService.likeBlog(blogId);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const dislikeBlog = createAsyncThunk(
  "blog/dislike",
  async (blogId, thunkAPI) => {
    try {
      return await blogService.dislikeBlog(blogId);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 6,
  totalPages: 1,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
 reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
    resetCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    resetBlogState: (state) => {
      state.blogs = [];
      state.page = 1;
      state.total = 0;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
     .addCase(fetchAllBlogs.pending, (state, action) => {
        // Nếu là page > 1, không set loading toàn cục để tránh ảnh hưởng UI
        if (action.meta.arg?.page === 1 || !action.meta.arg?.page) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        const { blogs, total, page, limit, totalPages } = action.payload;
        if (page === 1) {
          state.blogs = blogs;
        } else {
          // Nối thêm, tránh trùng lặp (dùng Set theo _id)
          const existingIds = new Set(state.blogs.map(b => b._id));
          const newBlogs = blogs.filter(b => !existingIds.has(b._id));
          state.blogs = [...state.blogs, ...newBlogs];
        }
        state.total = total;
        state.page = page;
        state.limit = limit;
        state.totalPages = totalPages;
        state.loading = false;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch single blog
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Like blog
      .addCase(likeBlog.fulfilled, (state, action) => {
        if (state.currentBlog && state.currentBlog._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
        // Update in list if needed
        const index = state.blogs.findIndex(
          (b) => b._id === action.payload._id,
        );
        if (index !== -1) state.blogs[index] = action.payload;
        toast.success("Đã thích bài viết");
      })
      .addCase(likeBlog.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Dislike blog
      .addCase(dislikeBlog.fulfilled, (state, action) => {
        if (state.currentBlog && state.currentBlog._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
        const index = state.blogs.findIndex(
          (b) => b._id === action.payload._id,
        );
        if (index !== -1) state.blogs[index] = action.payload;
        toast.success("Đã không thích bài viết");
      })
      .addCase(dislikeBlog.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const { clearBlogError, resetCurrentBlog, resetBlogState  } = blogSlice.actions;
export default blogSlice.reducer;
