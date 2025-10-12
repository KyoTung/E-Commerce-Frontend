import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const createCategory = async (categoryData, token) => {
  const response = await axios.post(`${baseURL}/category`, categoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateCategory = async (categoryId, categoryData, token) => {
  const response = await axios.put(
    `${baseURL}/category/${categoryId}`,
    categoryData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const deleteCategory = async (categoryId, token) => {
  const response = await axios.delete(`${baseURL}/category/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
const getAllCategory = async (token) => {
  const response = await axios.get(`${baseURL}/category`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getCategory = async (categoryId, token) => {
  const response = await axios.get(`${baseURL}/category/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
