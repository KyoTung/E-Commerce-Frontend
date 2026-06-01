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

  useEffect(() => {
    if (id && currentUser) {
      dispatch(getOrder(id));
    }
  }, [id, currentUser?.token, dispatch]);

  useEffect(() => {
    if (order?.trackingNumber) {
      setTrackingNumberInput(order.trackingNumber);
    }
  }, [order]);

  const handleUpdate = async (field, value) => {
    try {
      const updatePayload = {
        orderId: id,
        orderData: {
          status: field === "status" ? value : order.orderStatus,
          paymentStatus: field === "paymentStatus" ? value : order.paymentStatus,
        },
      };

      await dispatch(updateOrder(updatePayload)).unwrap();
      
      toast.success("Cập nhật thành công");
      dispatch(getOrder(id));
      
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Cập nhật thất bại");
    }
  };

  // --- LOGIC FRONTEND CHO STATE MACHINE ---
  const statusTransitions = {
    "Not Processed": ["Not Processed", "Confirmed", "Cancelled"],
    "Confirmed": ["Confirmed", "Processing", "Cancelled"],
    "Processing": ["Processing", "Dispatched", "Cancelled"],
    "Dispatched": ["Dispatched", "Delivered", "Cancelled", "Returned"],
    "Delivered": ["Delivered", "Returned"],
    "Cancelled": ["Cancelled"],
    "Returned": ["Returned"],
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Not Processed": return "Chưa xử lý";
      case "Confirmed": return "Đã xác nhận";
      case "Processing": return "Đang xử lý";
      case "Dispatched": return "Đang giao hàng";
      case "Delivered": return "Đã giao hàng";
      case "Cancelled": return "Đã hủy";
      case "Returned": return "Đã trả hàng";
      default: return status;
    }
  };

  const availableStatuses = order ? (statusTransitions[order.orderStatus] || [order.orderStatus]) : [];
  const isOrderClosed = order?.orderStatus === "Cancelled" || order?.orderStatus === "Returned";

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
      case "ZaloPay": return "ZaloPay";
      default: return method;
    }
  };

  const orderSummary = useMemo(() => {
    if (!order?.products) return { totalItems: 0, totalQuantity: 0, subtotal: 0 };
    
    const totalItems = order.products.length;
    const totalQuantity = order.products.reduce((sum, item) => sum + (item.count || 0), 0);
    const subtotal = order.products.reduce((sum, item) => sum + ((item.price || 0) * (item.count || 0)), 0);
    
    return { totalItems, totalQuantity, subtotal };
  }, [order]);

  if (orderLoading || !order) return <Loading />;

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
      {/* Các nút thao tác */}
      <div className="mb-6 flex justify-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300 font-medium"
        >
          ← Quay lại
        </button>
        <button
          onClick={() => dispatch(getOrder(id))}
          className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 font-medium"
          disabled={orderLoading}
        >
          {orderLoading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>
      
      <ToastContainer />
      
      <div className="mx-auto max-w-7xl">
        
        {/* --- KHU VỰC HEADER: ĐƠN HÀNG VÀ KHÁCH HÀNG --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Box 1: Thông tin đơn hàng */}
          <div className="rounded-xl border p-5 bg-white shadow-sm">
            <h1 className="mb-3 text-xl font-bold text-gray-900">
              Đơn hàng #{order._id?.substring(0, 8).toUpperCase()}...
            </h1>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Ngày đặt:</span> {formatDate(order.createdAt)}</p>
              <p><span className="font-medium text-gray-800">Cập nhật lần cuối:</span> {formatDate(order.updatedAt)}</p>
              <p><span className="font-medium text-gray-800">Mã đầy đủ:</span> {order._id}</p>
            </div>
          </div>

          {/* Box 2: Thông tin khách hàng */}
          <div className="rounded-xl border p-5 bg-white shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Thông tin khách hàng</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Họ tên:</span> {order.customerInfo?.name}</p>
              <p><span className="font-medium text-gray-800">Số điện thoại:</span> {order.customerInfo?.phone}</p>
              <p><span className="font-medium text-gray-800">Địa chỉ:</span> {order.customerInfo?.address}</p>
            </div>
          </div>
        </div>

        {/* --- KHU VỰC NỘI DUNG CHÍNH --- */}
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM & TỔNG TIỀN */}
          <div className="space-y-6 md:col-span-1 lg:col-span-2">
            <div className="rounded-xl border p-6 bg-white shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Danh sách sản phẩm</h2>
              <div className="space-y-6">
                {order.products?.length > 0 ? (
                  order.products.map((item, index) => {
                    const productImage = item.product?.images?.[0]?.url;
                    
                    // return (
                    //   <div
                    //     key={`${item.product?._id || item._id}-${index}`}
                    //     className="flex items-start gap-4 border-b pb-6 last:border-0 last:pb-0"
                    //   >
                    //     <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50 relative p-1">
                    //       {productImage ? (
                    //         <img
                    //           src={productImage}
                    //           alt={item.product?.title || "Sản phẩm"}
                    //           className="h-full w-full object-contain"
                    //           onError={(e) => {
                    //             e.target.onerror = null;
                    //             e.target.src = "https://via.placeholder.com/80";
                    //           }}
                    //         />
                    //       ) : (
                    //         <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                    //           Không có ảnh
                    //         </div>
                    //       )}
                    //     </div>
                    //     <div className="flex-1">
                    //       <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                    //         {item.product?.title || `Sản phẩm ${item.product?._id?.substring(0, 8)}...`}
                    //       </h3>
                          
                    //       <div className="mt-2 text-sm text-gray-600">
                    //         <div className="flex flex-wrap items-center gap-3">
                    //           {item.storage && (
                    //             <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{item.storage}</span>
                    //           )}
                    //           {item.color && (
                    //             <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{item.color}</span>
                    //           )}
                    //           {/* HIỂN THỊ SỐ LƯỢNG RÕ RÀNG */}
                    //           <span className="font-medium text-gray-800 bg-blue-50 px-2 py-0.5 rounded text-blue-700">
                    //             SL: {item.count}
                    //           </span>
                    //           <span>Đơn giá: <span className="font-medium text-gray-900">{formatPrice(item.price)}</span></span>
                    //         </div>
                    //       </div>
                          
                    //       <div className="mt-4 flex items-center justify-between border-t pt-3">
                    //         <span className="text-gray-500 font-medium">Thành tiền:</span>
                    //         <span className="font-bold text-lg text-gray-900">
                    //           {formatPrice(item.price * item.count)}
                    //         </span>
                    //       </div>
                    //     </div>
                    //   </div>
                    // );

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
                            {item.storage && (
                              <p>Dung lượng: <span className="font-medium">{item.storage}</span></p>
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
            </div>
            
            {/* Tổng kết đơn hàng */}
            <div className="rounded-xl border p-6 bg-gray-50 shadow-sm mt-6">
              <h3 className="font-bold text-gray-900 mb-5 text-lg border-b pb-3">Tổng kết đơn hàng</h3>
              <div className="space-y-3 text-sm">
                
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({orderSummary.totalQuantity} sản phẩm):</span>
                  <span className="font-medium text-gray-900">{formatPrice(orderSummary.subtotal)}</span>
                </div>
                
                {/* Giảm giá */}
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá (Coupon):</span>
                    <span className="font-medium">- {formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                
                {/* Phí vận chuyển */}
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className={order.shippingFee === 0 ? "text-green-600 font-medium" : "font-medium text-gray-900"}>
                    {order.shippingFee === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}
                  </span>
                </div>
                
                {/* Tổng cộng */}
                <div className="flex justify-between border-t border-gray-200 pt-4 mt-3 items-end">
                  <span className="font-bold text-gray-900 text-base">Tổng thu khách:</span>
                  <span className="text-2xl font-bold text-[#d70018]">{formatPrice(order.total)}</span>
                </div>

              </div>
            </div>
          </div>

          {/* CỘT PHẢI: QUẢN LÝ TRẠNG THÁI */}
          <div className="space-y-6 md:col-span-1">
            
            {/* Box Trạng thái & Phương thức thanh toán */}
            <div className="rounded-xl border p-5 bg-white shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">Trạng thái hệ thống</h2>
              <div className="space-y-5 ">
               <div className="flex justify-around items-start gap-6">
                 <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-500">Trạng thái đơn hàng:</span>
                  <span className={`inline-block w-fit rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm ${getStatusColor(order.orderStatus)}`}>
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-500">Trạng thái thanh toán:</span>
                  <span className={`inline-block w-fit rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus === "paid" ? "Đã thanh toán" : 
                     order.paymentStatus === "not_paid" ? "Chưa thanh toán" : 
                     order.paymentStatus === "failed" ? "Thất bại" :
                     order.paymentStatus === "refunded" ? "Đã hoàn tiền" :
                     order.paymentStatus === "authorized" ? "Đã ủy quyền" : order.paymentStatus}
                  </span>
                </div>
               </div>

                <div className="flex flex-col gap-1 pt-4 border-t">
                  <span className="text-sm font-medium text-gray-500">Phương thức thanh toán:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {getPaymentMethodText(order.paymentMethod)}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Cập nhật */}
            <div className="rounded-xl border p-5 bg-gray-50 shadow-sm">
              <h3 className="mb-4 font-bold text-gray-900 text-lg">Cập nhật đơn</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Trạng thái đơn hàng</label>
                  <select
                    className={`w-full rounded-lg border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none ${isOrderClosed ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border'}`}
                    value={order.orderStatus || ""}
                    onChange={(e) => handleUpdate("status", e.target.value)}
                    disabled={orderLoading || isOrderClosed}
                  >
                    {availableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                  {isOrderClosed && (
                    <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                      <span className="text-lg leading-none">•</span> Đơn hàng đã đóng, không thể thay đổi.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Trạng thái thanh toán</label>
                  <select
                    className={`w-full rounded-lg border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none ${isOrderClosed ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border'}`}
                    value={order.paymentStatus || ""}
                    onChange={(e) => handleUpdate("paymentStatus", e.target.value)}
                    disabled={orderLoading || isOrderClosed}
                  >
                    <option value="not_paid">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thất bại</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;