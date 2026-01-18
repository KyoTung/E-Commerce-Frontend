import axiosClient from "../../../api/axiosClient";

const updateOrder = async (id, orderData) => {
  const response = await axiosClient.put(`/order/${id}`, orderData);
  return response.data;
};

const getAllOrder = async () => {
  const response = await axiosClient.get('/order');
  return response.data;
};

const getOrder = async (orderId) => {
  const response = await axiosClient.get(`/order/order-detail/${orderId}`);
  return response.data;
};

const OrderService = {
  updateOrder,
  getAllOrder,
  getOrder,
};

export default OrderService;