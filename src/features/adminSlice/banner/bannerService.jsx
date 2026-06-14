// src/features/adminSlice/banner/bannerService.js
import axiosClient from '../../../api/axiosClient';

const getBanners = async (params) => {
  const response = await axiosClient.get('/banner/admin', { params });
  return response.data;
};

const createBanner = async (data) => {
  const response = await axiosClient.post('/banner', data);
  return response.data;
};

const updateBanner = async (id, data) => {
  const response = await axiosClient.put(`/banner/${id}`, data);
  return response.data;
};

const deleteBanner = async (id) => {
  const response = await axiosClient.delete(`/banner/${id}`);
  return response.data;
};

const uploadBannerImage = async (id, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axiosClient.put(`/banner/upload-image/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deleteBannerImage = async (id) => {
  const response = await axiosClient.delete(`/banner/delete-image/${id}`);
  return response.data;
};

const bannerService = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  deleteBannerImage,
};

export default bannerService;