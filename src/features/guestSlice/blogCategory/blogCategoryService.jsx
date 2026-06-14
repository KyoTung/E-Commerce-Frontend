import axiosClient from "../../../api/axiosClient";

const getAllBlogCategories = async () => {
  const response = await axiosClient.get('/blogcategory');
  return response.data;

};

const blogCategoryService = {
  getAllBlogCategories,
};

export default blogCategoryService;