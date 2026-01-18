import axiosClient from "../../../api/axiosClient";

// 1. Tạo đơn hàng (Checkout)
const createOrder = async (orderData) => {
  // orderData gồm: { paymentMethod, couponApplied, customerInfo, ... }
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

// 4. Hủy đơn hàng (User tự hủy)
const cancelOrder = async (orderId) => {
  const response = await axiosClient.put(`/order/cancel-order/${orderId}`);
  return response.data;
};

// 5. Tạo thanh toán ZaloPay (Thường dùng lúc tạo đơn mới)
const createPaymentZaloPay = async (data) => {
  // data gồm: { orderId, totalAmount }
  const response = await axiosClient.post("/order/zalopay", data);
  return response.data;
};


// 6. Thanh toán lại (Repay): Gọi lại API ZaloPay cho đơn hàng ĐÃ TỒN TẠI
const repayOrder = async (orderId) => {
  // Backend cần có route: router.post('/repay/:id', orderController.repayOrder)
  const response = await axiosClient.post(`/order/repay/${orderId}`);
  return response.data; // Trả về { paymentUrl: "..." }
};

// 7. Đổi sang COD: Khi khách chán thanh toán online muốn trả sau
const switchToCOD = async (orderId) => {
  // Backend cần có route: router.put('/switch-cod/:id', orderController.switchToCOD)
  const response = await axiosClient.put(`/order/switch-cod/${orderId}`);
  return response.data;
};


// 8. Giả lập thanh toán thành công (dùng cho Test/Dev)
const simulatePaymentSuccess = async (orderId) => {
  const response = await axiosClient.put("/order/simulate-success", { orderId });
  return response.data;
};

// 9. Xóa đơn hàng (Admin hoặc dọn rác)
const deleteOrder = async (orderId) => {
  const response = await axiosClient.delete(`/order/${orderId}`);
  return response.data;
};

const orderService = {
  createOrder,
  getUserOrders,
  getOrderDetail,
  cancelOrder,
  createPaymentZaloPay,
  repayOrder,
  switchToCOD,   
  simulatePaymentSuccess,
  deleteOrder
};

export default orderService;