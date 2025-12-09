import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { 
  getOrder, 
  updateOrder,
} from "../../../features/adminSlice/orders/orderSlice";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { order, loading: orderLoading, error: orderError } = useSelector((state) => state.orderAdmin);
  const currentUser = useSelector((state) => state.auth.user);
  
  const [trackingNumberInput, setTrackingNumberInput] = useState("");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { 
      style: "currency", 
      currency: "VND" 
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Fetch order details
  useEffect(() => {
    if (id && currentUser?.token) {
      dispatch(getOrder(id));
    }
  }, [id, currentUser?.token, dispatch]);

  // Cập nhật tracking number khi order thay đổi
  useEffect(() => {
    if (order?.trackingNumber) {
      setTrackingNumberInput(order.trackingNumber);
    }
  }, [order]);

const handleUpdate = async (field, value) => {
    try {
      // Chuẩn bị payload động
      const updatePayload = {
        orderId: id,
        orderData: {
          status: field === "status" ? value : order.orderStatus,
          paymentStatus: field === "paymentStatus" ? value : order.paymentStatus,
        },
      };

      const result = await dispatch(updateOrder(updatePayload)).unwrap();
      
      toast.success("Updated successfully");
      // Tự động refresh data mới nhất sau khi update
      dispatch(getOrder(id));
      
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Update failed");
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "Not Processed": return "bg-gray-600";
      case "Confirmed": return "bg-blue-600";
      case "Processing": return "bg-yellow-600";
      case "Dispatched": return "bg-cyan-600";
      case "Delivered": return "bg-teal-600";
      case "Cancelled": return "bg-red-600";
      case "Returned": return "bg-orange-600";
      default: return "bg-gray-600";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-600";
      case "not_paid": return "bg-red-600";
      case "failed": return "bg-red-700";
      case "refunded": return "bg-orange-600";
      case "authorized": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod": return "Thanh toán khi nhận hàng (COD)";
      case "bank_transfer": return "Chuyển khoản ngân hàng";
      case "momo": return "Ví MoMo";
      case "vnpay": return "VNPay";
      case "paypal": return "PayPal";
      default: return method;
    }
  };

  // Tính tổng tiền và tổng số lượng
  const orderSummary = useMemo(() => {
    if (!order?.products) return { totalItems: 0, totalQuantity: 0, subtotal: 0 };
    
    const totalItems = order.products.length;
    const totalQuantity = order.products.reduce((sum, item) => sum + (item.count || 0), 0);
    const subtotal = order.products.reduce((sum, item) => sum + ((item.price || 0) * (item.count || 0)), 0);
    
    return { totalItems, totalQuantity, subtotal };
  }, [order]);

  // Loading state
  if (orderLoading || !order) {
    return <Loading />;
  }

  // Error handling
  if (orderError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Lỗi khi tải đơn hàng: {orderError}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white px-4 py-8">
      <div className="mb-6 flex justify-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
        >
          ← Quay lại
        </button>
        <button
          onClick={() => dispatch(getOrder({ orderId: id, token: currentUser.token }))}
          className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          disabled={orderLoading}
        >
          {orderLoading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>
      
      <ToastContainer />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Đơn hàng #{order._id?.substring(0, 8)}...
          </h1>
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <span>Ngày đặt: {formatDate(order.createdAt)}</span>
            <span>Cập nhật lần cuối: {formatDate(order.updatedAt)}</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Product List */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
            <div className="space-y-4">
              {order.products?.length > 0 ? (
                order.products.map((item, index) => {
                  const productImage = item.product?.images?.[0]?.url;
                  
                  return (
                    <div
                      key={`${item.product?._id || item._id}-${index}`}
                      className="flex items-start gap-4 border-b pb-4"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.product?.title || "Sản phẩm"}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/80";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            Không có ảnh
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.product?.title || `Sản phẩm ${item.product?._id?.substring(0, 8)}...`}
                        </h3>
                        
                        {item.product?.brand && (
                          <p className="text-sm text-gray-500 mt-1">
                            Thương hiệu: {item.product.brand}
                          </p>
                        )}
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex flex-wrap gap-4">
                            <p>Số lượng: <span className="font-medium">{item.count}</span></p>
                            {item.color && (
                              <p>Màu sắc: <span className="font-medium">{item.color}</span></p>
                            )}
                            <p>Đơn giá: <span className="font-medium">{formatPrice(item.price)}</span></p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between border-t pt-3">
                          <span className="text-gray-600">Thành tiền:</span>
                          <span className="font-medium text-lg text-gray-900">
                            {formatPrice(item.price * item.count)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-4">Không có sản phẩm</p>
              )}
            </div>
            
            {/* Tổng kết sản phẩm */}
            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="font-medium mb-3">Tổng kết sản phẩm</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số loại sản phẩm:</span>
                  <span>{orderSummary.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số lượng:</span>
                  <span>{orderSummary.totalQuantity}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Tổng tiền hàng:</span>
                  <span className="font-medium">{formatPrice(orderSummary.subtotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-6 border-l-2 pl-6">
            <h2 className="text-lg font-semibold">Thông tin khách hàng</h2>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Thông tin liên hệ</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex">
                    <span className="w-28 text-gray-500">Họ tên:</span>
                    <span className="font-medium">{order.customerInfo?.name || "Không có"}</span>
                  </p>
                  <p className="flex">
                    <span className="w-28 text-gray-500">Số điện thoại:</span>
                    <span className="font-medium">{order.customerInfo?.phone || "Không có"}</span>
                  </p>
                  <p className="flex">
                    <span className="w-28 text-gray-500">Mã người dùng:</span>
                    <span className="font-mono">{order.orderby?.substring(0, 8) || "Không có"}</span>
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Địa chỉ giao hàng</h3>
                <div className="text-sm text-gray-600">
                  <p>{order.customerInfo?.address || "Không có địa chỉ"}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Phương thức thanh toán</h3>
                <div className="text-sm">
                  <p className="font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Tổng thanh toán</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền hàng:</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Management */}
          <div className="space-y-6 border-l-2 pl-6">
            <h2 className="text-lg font-semibold">Quản lý đơn hàng</h2>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Trạng thái đơn hàng:</span>
                    <span className={`rounded-md px-3 py-1 text-white ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus === "Not Processed" ? "Chưa xử lý" :
                       order.orderStatus === "Confirmed" ? "Đã xác nhận" :
                       order.orderStatus === "Processing" ? "Đang xử lý" :
                       order.orderStatus === "Dispatched" ? "Đang giao hàng" :
                       order.orderStatus === "Delivered" ? "Đã giao hàng" :
                       order.orderStatus === "Cancelled" ? "Đã hủy" :
                       order.orderStatus === "Returned" ? "Đã trả hàng" : order.orderStatus}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Trạng thái thanh toán:</span>
                    <span className={`rounded-md px-3 py-1 text-white ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus === "paid" ? "Đã thanh toán" : 
                       order.paymentStatus === "not_paid" ? "Chưa thanh toán" : 
                       order.paymentStatus === "failed" ? "Thất bại" :
                       order.paymentStatus === "refunded" ? "Đã hoàn tiền" :
                       order.paymentStatus === "authorized" ? "Đã ủy quyền" : order.paymentStatus}
                    </span>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Mã vận đơn:</span>
                      <span className="font-mono">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Cập nhật trạng thái đơn hàng</h3>
                <select
                  className="w-full rounded border p-2"
                  value={order.orderStatus || ""}
                  onChange={(e) => handleUpdate("status", e.target.value)}
                  disabled={orderLoading}
                >
                  <option value="Not Processed">Chưa xử lý</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Processing">Đang xử lý</option>
                  <option value="Dispatched">Đang giao hàng</option>
                  <option value="Delivered">Đã giao hàng</option>
                  <option value="Cancelled">Đã hủy</option>
                  <option value="Returned">Đã trả hàng</option>
                </select>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Cập nhật trạng thái thanh toán</h3>
                <select
                  className="w-full rounded border p-2"
                  value={order.paymentStatus || ""}
                  onChange={(e) => handleUpdate("paymentStatus", e.target.value)}
                  disabled={orderLoading}
                >
                  <option value="not_paid">Chưa thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="failed">Thất bại</option>
                  <option value="refunded">Đã hoàn tiền</option>
                  <option value="authorized">Đã ủy quyền</option>
                </select>
              </div>

           

              {order.paymentIntent && (
                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Thông tin thanh toán</h3>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span>{formatPrice(order.paymentIntent?.amount || order.total)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Tiền tệ:</span>
                      <span>{order.paymentIntent?.currency || "VND"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span>{order.paymentIntent?.status || "N/A"}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;