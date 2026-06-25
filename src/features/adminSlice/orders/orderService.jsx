import axiosClient from "../../../api/axiosClient";

const updateOrder = async (id, orderData) => {
  const response = await axiosClient.put(`/order/${id}`, orderData);
  return response.data;
};

// const getAllOrder = async (page = 1, limit = 10, search = "") => {
//   const response = await axiosClient.get(`/order?page=${page}&limit=${limit}&search=${search}`);
//   return response.data;
// };

const getAllOrder = async (params = {}) => {
  const { page = 1, limit = 10, search = '', orderStatus, paymentStatus, minPrice, maxPrice } = params;
  let query = `page=${page}&limit=${limit}`;
  if (search) query += `&search=${encodeURIComponent(search)}`;
  if (orderStatus) query += `&orderStatus=${encodeURIComponent(orderStatus)}`;
  if (paymentStatus) query += `&paymentStatus=${encodeURIComponent(paymentStatus)}`;
  if (minPrice !== undefined && minPrice !== '') query += `&minPrice=${minPrice}`;
  if (maxPrice !== undefined && maxPrice !== '') query += `&maxPrice=${maxPrice}`;
  const response = await axiosClient.get(`/order?${query}`);
  return response.data;
};

const getOrder = async (orderId) => {
  const response = await axiosClient.get(`/order/order-detail/${orderId}`);
  return response.data;
};

const adminCreateOrder = async (orderData) => {
  const response = await axiosClient.post("/order/admin-create", orderData);
  return response.data;
};


const OrderService = {
  updateOrder,
  getAllOrder,
  getOrder,
  adminCreateOrder
};

export default OrderService;