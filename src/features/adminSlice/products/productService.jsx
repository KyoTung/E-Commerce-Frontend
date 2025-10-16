import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const createProduct = async (productData, token) => {
  const response = await axios.post(`${baseURL}/product`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateProduct = async (productId, productData, token) => {
  const response = await axios.put(
    `${baseURL}/product/${productId}`,
    productData ,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


const getAllProducts = async (token) => {
  const response = await axios.get(`${baseURL}/product`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getProduct = async (productId, token) => {
  const response = await axios.get(`${baseURL}/product/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteProduct = async (productId, token) => {
  const response = await axios.delete(`${baseURL}/product/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const productService = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
};
export default productService;
