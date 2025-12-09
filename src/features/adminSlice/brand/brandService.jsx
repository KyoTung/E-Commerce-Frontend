import axiosClient from "../../../api/axiosClient";

const createBrand = async (brandData, token) => {
  const response = await axiosClient.post(`/brand`, brandData, {});
  return response.data;
};

const updateBrand = async (brandId, brandData, token) => {
  const response = await axiosClient.put(`/brand/${brandId}`, brandData, {});
  return response.data;
};

const getAllBrand = async (token) => {
  const response = await axiosClient.get(`/brand`, {});
  return response.data;
};

const getBrand = async (brandId, token) => {
  const response = await axiosClient.get(`/brand/${brandId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteBrand = async (brandId) => {
  const response = await axiosClient.delete(`/brand/${brandId}`, {});
  return response.data;
};

const brandService = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrand,
  getBrand,
};
export default brandService;
