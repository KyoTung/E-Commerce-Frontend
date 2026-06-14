
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bannerService from './bannerService';
import { toast } from 'react-toastify';

export const fetchBanners = createAsyncThunk(
  'banner/fetchAll',
  async (params, thunkAPI) => {
    try {
      return await bannerService.getBanners(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBannerThunk = createAsyncThunk(
  'banner/create',
  async (data, thunkAPI) => {
    try {
      return await bannerService.createBanner(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBannerThunk = createAsyncThunk(
  'banner/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await bannerService.updateBanner(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBannerThunk = createAsyncThunk(
  'banner/delete',
  async (id, thunkAPI) => {
    try {
      return await bannerService.deleteBanner(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const uploadBannerImageThunk = createAsyncThunk(
  'banner/uploadImage',
  async ({ id, file }, thunkAPI) => {
    try {
      return await bannerService.uploadBannerImage(id, file);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBannerImageThunk = createAsyncThunk(
  'banner/deleteImage',
  async (id, thunkAPI) => {
    try {
      return await bannerService.deleteBannerImage(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  banners: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => { state.loading = true; })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.banners;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(createBannerThunk.fulfilled, (state, action) => {
        toast.success('Tạo banner thành công');
      })
      .addCase(updateBannerThunk.fulfilled, (state, action) => {
        toast.success('Cập nhật banner thành công');
      })
      .addCase(deleteBannerThunk.fulfilled, (state, action) => {
        toast.success('Xóa banner thành công');
      })
      .addCase(uploadBannerImageThunk.fulfilled, (state, action) => {
        const index = state.banners.findIndex(b => b._id === action.payload._id);
        if (index !== -1) state.banners[index] = action.payload;
        toast.success('Upload ảnh thành công');
      })
      .addCase(deleteBannerImageThunk.fulfilled, (state, action) => {
        const index = state.banners.findIndex(b => b._id === action.payload.banner._id);
        if (index !== -1) state.banners[index] = action.payload.banner;
        toast.success('Xóa ảnh thành công');
      });
  },
});

export default bannerSlice.reducer;