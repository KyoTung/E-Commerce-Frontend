import axiosClient from "../../../api/axiosClient";

const createProduct = async (productData) => {
  // axiosClient tự động xử lý Content-Type và Token
  const response = await axiosClient.post('/product', productData);
  return response.data;
};

const updateProduct = async (productId, productData) => {
  const response = await axiosClient.put(`/product/${productId}`, productData);
  return response.data;
};

const getAllProducts = async () => {
  const response = await axiosClient.get('/product');
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
  getAllProducts,
  getProduct,
  deleteProduct,
};

export default productService;