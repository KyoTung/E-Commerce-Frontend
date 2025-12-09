
import axiosClient from "../../../api/axiosClient";

const createCategory = async (categoryData) => {
  const response = await axiosClient.post('/category', categoryData);
  return response.data;
};

const updateCategory = async (categoryId, categoryData) => {
  const response = await axiosClient.put(`/category/${categoryId}`, categoryData);
  return response.data;
};

const getAllCategory = async () => {
  const response = await axiosClient.get('/category');
  return response.data;
};

const getCategory = async (categoryId) => {
  const response = await axiosClient.get(`/category/${categoryId}`);
  return response.data;
};

const deleteCategory = async (categoryId) => {
  const response = await axiosClient.delete(`/category/${categoryId}`);
  return response.data;
};

const categoryService = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
};

export default categoryService;