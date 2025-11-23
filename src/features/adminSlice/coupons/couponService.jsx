import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const createCoupon = async (couponData, token) => {
  const response = await axios.post(`${baseURL}/coupon`, couponData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateCoupon = async (couponId, couponData, token) => {
  const response = await axios.put(
    `${baseURL}/coupon/${couponId}`,
    couponData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


const getAllCoupon = async (token) => {
  const response = await axios.get(`${baseURL}/coupon`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getCoupon = async (couponId, token) => {
  const response = await axios.get(`${baseURL}/coupon/${couponId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteCoupon = async (couponId, token) => {
  const response = await axios.delete(`${baseURL}/coupon/${couponId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const couponService = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupon,
  getCoupon,
};
export default couponService;
