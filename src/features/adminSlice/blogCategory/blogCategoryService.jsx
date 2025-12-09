import axiosClient from '../../../api/axiosClient';

const createBlogCategory = async (blogCategoryData) => {
  const response = await axiosClient.post('/blogcategory', blogCategoryData);
  return response.data;
};

const updateBlogCategory = async (id, blogCategoryData) => {
  const response = await axiosClient.put(`/blogcategory/${id}`, blogCategoryData);
  return response.data;
};

const deleteBlogCategory = async (id) => {
  const response = await axiosClient.delete(`/blogcategory/${id}`);
  return response.data;
};

const getBlogCategory = async (id) => {
  const response = await axiosClient.get(`/blogcategory/${id}`);
  return response.data;
};

const getAllBlogCategory = async () => {
  const response = await axiosClient.get('/blogcategory');
  return response.data;
};

const blogCategoryService = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogCategory,
  getAllBlogCategory,
};

export default blogCategoryService;