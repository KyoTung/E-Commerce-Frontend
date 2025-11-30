import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const createBlog = async (blogData, token) => {
  const response = await axios.post(`${baseURL}/blog`, blogData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateBlog = async (blogId, blogData, token) => {
  const response = await axios.put(
    `${baseURL}/blog/${blogId}`,
    blogData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


const getAllBlog = async (token) => {
  const response = await axios.get(`${baseURL}/blog`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getBlog = async (blogId, token) => {
  const response = await axios.get(`${baseURL}/blog/${blogId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteBlog = async (blogId, token) => {
  const response = await axios.delete(`${baseURL}/blog/${blogId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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