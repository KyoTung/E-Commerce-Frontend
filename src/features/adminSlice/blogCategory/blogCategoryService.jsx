import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const createBlogCategory = async (blogCategoryData, token) => {
  const response = await axios.post(`${baseURL}/blogcategory`, blogCategoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateBlogCategory = async (blogCategoryId, blogCategoryData, token) => {
  const response = await axios.put(
    `${baseURL}/blogcategory/${blogCategoryId}`,
    blogCategoryData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


const getAllBlogCategory = async (token) => {
  const response = await axios.get(`${baseURL}/blogcategory`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getBlogCategory = async (blogCategoryId, token) => {
  const response = await axios.get(`${baseURL}/blogcategory/${blogCategoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteBlogCategory = async (blogCategoryId, token) => {
  const response = await axios.delete(`${baseURL}/blogcategory/${blogCategoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const blogCategoryService = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getAllBlogCategory,
  getBlogCategory,
};
export default blogCategoryService;