import axiosClient from "../../../api/axiosClient";

// 1. Tạo đơn hàng (Checkout)
const createOrder = async (orderData) => {
  // orderData gồm: { paymentMethod, couponApplied, customerInfo }
  // Lưu ý: customerInfo: { name, address, phone }
  const response = await axiosClient.post("/order", orderData);
  return response.data;
};

// 2. Lấy danh sách đơn hàng của User
const getUserOrders = async () => {
  const response = await axiosClient.get("/order/user-orders");
  return response.data;
};

// 3. Lấy chi tiết đơn hàng
const getOrderDetail = async (orderId) => {
  const response = await axiosClient.get(`/order/order-detail/${orderId}`);
  return response.data;
};

const cancelOrder = async (orderId) => {
  const response = await axiosClient.put(`/order/cancel-order/${orderId}`);
  return response.data;
}

const createPaymentZaloPay = async (data) => {
  // data gồm: { orderId, totalAmount }
  const response = await axiosClient.post("/order/zalopay", data);
  return response.data;
};

const simulatePaymentSuccess = async (orderId) => {
  const response = await axiosClient.put("/order/simulate-success", { orderId });
  return response.data;
};

const deleteOrder = async (orderId) => {
  const response = await axiosClient.delete(`/order/${orderId}`);
  return response.data;
} 

const orderService = {
  createOrder,
  getUserOrders,
  getOrderDetail,
  cancelOrder,
  createPaymentZaloPay,
  simulatePaymentSuccess,
  deleteOrder
};

export default orderService;