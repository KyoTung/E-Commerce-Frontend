import axiosClient from "../../../api/axiosClient";

const createProduct = async (productData) => {
  // axiosClient tự động xử lý Content-Type và Token
  const response = await axiosClient.post("/product", productData);
  return response.data;
};

const updateProduct = async (productId, productData) => {
  const response = await axiosClient.put(`/product/${productId}`, productData);
  return response.data;
};

const getAllProductsAdmin = async (params) => {
  const response = await axiosClient.get("/product/admin", {
    params: params, 
  });
  return response.data; 
};

const getProduct = async (productId) => {
  const response = await axiosClient.get(`/product/${productId}`);
  return response.data;
};

const deleteProduct = async (productId) => {
  const response = await axiosClient.delete(`/product/${productId}`);
  return response.data;
};

const productService = {
  createProduct,
  updateProduct,
  getAllProductsAdmin,
  getProduct,
  deleteProduct,
};

export default productService;
