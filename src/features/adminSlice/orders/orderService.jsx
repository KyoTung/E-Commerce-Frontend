import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
  

const updateOrder= async (id, orderData, token) => {
  const response = await axios.put(
    `${baseURL}/order/${id}`,
    orderData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


const getAllOrder= async (token) => {
  const response = await axios.get(`${baseURL}/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getOrder= async (id, token) => {
  const response = await axios.get(`${baseURL}/order/order-detail/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const OrderService = {
  updateOrder,
  getAllOrder,
  getOrder,
};
export default OrderService;
