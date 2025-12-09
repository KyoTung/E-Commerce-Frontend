import axiosClient from "../../../api/axiosClient";

const updateOrder = async (id, orderData) => {
  const response = await axiosClient.put(`/order/${id}`, orderData);
  return response.data;
};

const getAllOrder = async () => {
  const response = await axiosClient.get('/order');
  return response.data;
};

const getOrder = async (id) => {
  const response = await axiosClient.get(`/order/order-detail/${id}`);
  return response.data;
};

const OrderService = {
  updateOrder,
  getAllOrder,
  getOrder,
};

export default OrderService;