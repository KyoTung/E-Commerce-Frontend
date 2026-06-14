import axiosClient from "../../../api/axiosClient";


const getAllBlogs = async (data) => {
  const response = await axiosClient.get("/blog", { params: data }); 
  return response.data;
};

const getBlog = async (id) => {
  const response = await axiosClient.get(`/blog/${id}`);
  return response.data;
};

const likeBlog = async (blogId) => {
  const response = await axiosClient.put("/blog/likes", { blogId });
  return response.data;
};

const dislikeBlog = async (blogId) => {
  const response = await axiosClient.put("/blog/dislikes", { blogId });
  return response.data;
};

const blogService = {
  getAllBlogs,
  getBlog,
  likeBlog,
  dislikeBlog,
};

export default blogService;