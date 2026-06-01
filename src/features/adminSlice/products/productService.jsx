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

const getAllProductsAdmin = async (page = 1, limit = 10, search = "") => {
  const response = await axiosClient.get("/product/admin", {
    params: { page, limit, search }
  });
  return response.data;  // { products, total, totalPages, currentPage }
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