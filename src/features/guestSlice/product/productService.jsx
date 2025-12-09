import axiosClient from "../../../api/axiosClient";

const getAllProducts = async () => {
  const response = await axiosClient.get("/product");
  return response.data;
};

const getProduct = async (productId) => {
  const response = await axiosClient.get(`/product/${productId}`);
  return response.data;
};

const addwishList = async (productId) => {
  const response = await axiosClient.put(`/product/wishlist`, { productId });
  return response.data;
}

const commentProduct = async (data) => {
  const response = await axiosClient.put(`/product/rating`, data);
  return response.data;
}

const productService = {
  getAllProducts,
  getProduct,
  addwishList,
  commentProduct,
};

export default productService;
