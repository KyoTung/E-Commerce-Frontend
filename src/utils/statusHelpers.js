// 1. Dịch trạng thái đơn hàng (Order Status)
export const translateOrderStatus = (status) => {
  switch (status) {
    case "Not Processed":
      return { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" };
    case "Processing":
      return { label: "Đang xử lý", color: "bg-blue-100 text-blue-700" };
    case "Dispatched":
    case "Shipped":
      return { label: "Đang giao hàng", color: "bg-purple-100 text-purple-700" };
    case "Cancelled":
      return { label: "Đã hủy", color: "bg-red-100 text-red-700" };
    case "Delivered":
      return { label: "Giao thành công", color: "bg-green-100 text-green-700" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-700" };
  }
};

// 2. Dịch trạng thái thanh toán (Payment Status)
export const translatePaymentStatus = (status) => {
  // Backend có thể trả về: "not_paid", "paid", "refunded"
  // Chuyển về lowercase để so sánh cho chuẩn
  const normalizedStatus = status ? status.toLowerCase() : "";

  switch (normalizedStatus) {
    case "paid":
    case "succeeded":
      return { label: "Đã thanh toán", color: "text-green-600 bg-green-50" };
    case "pending":
    case "not_paid":
      return { label: "Chưa thanh toán", color: "text-yellow-600 bg-yellow-50" };
    case "refunded":
      return { label: "Đã hoàn tiền", color: "text-purple-600 bg-purple-50" };
    case "failed":
      return { label: "Thanh toán lỗi", color: "text-red-600 bg-red-50" };
    default:
      return { label: "Chưa thanh toán", color: "text-gray-600 bg-gray-50" };
  }
};

// 3. Dịch phương thức thanh toán (Payment Method)
export const translatePaymentMethod = (method) => {
  const normalizedMethod = method ? method.toLowerCase() : "";

  switch (normalizedMethod) {
    case "cod":
      return "Thanh toán khi nhận hàng (COD)";
    case "bank":
    case "bank_transfer":
      return "Chuyển khoản ngân hàng";
    case "momo":
      return "Ví MoMo";
    case "vnpay":
      return "VNPay";
    case "paypal":
      return "PayPal";
    case "card":
      return "Thẻ tín dụng/Ghi nợ";
    default:
      return method || "Không xác định";
  }
};