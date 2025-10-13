import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
  
const createBrand= async (brandData, token) => {
  const response = await axios.post(`${baseURL}/brand`, brandData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateBrand= async (brandId, brandData, token) => {
  const response = await axios.put(
    `${baseURL}/brand/${brandId}`,
    brandData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


const getAllBrand= async (token) => {
  const response = await axios.get(`${baseURL}/brand`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getBrand= async (brandId, token) => {
  const response = await axios.get(`${baseURL}/brand/${brandId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteBrand= async (brandId, token) => {
  const response = await axios.delete(`${baseURL}/brand/${brandId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const brandService = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrand,
  getBrand,
};
export default brandService;
