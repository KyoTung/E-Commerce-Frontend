import axiosClient from '../../../api/axiosClient'; 

const createBlog = async (blogData) => {
  const response = await axiosClient.post('/blog', blogData);
  return response.data;
};

const updateBlog = async (blogId, blogData) => {
  const response = await axiosClient.put(`/blog/${blogId}`, blogData);
  return response.data;
};

const getAllBlog = async () => {
  const response = await axiosClient.get('/blog');
  return response.data;
};

const getBlog = async (blogId) => {
  const response = await axiosClient.get(`/blog/${blogId}`);
  return response.data;
};

const deleteBlog = async (blogId) => {
  const response = await axiosClient.delete(`/blog/${blogId}`);
  return response.data;
};

const blogService = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlog,
  getBlog,
};

export default blogService;