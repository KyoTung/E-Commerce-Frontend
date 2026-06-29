import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";
import {
  getOrder,
  updateOrder,
  updateImei,
} from "../../../features/adminSlice/orders/orderSlice";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.orderAdmin);

  // State cho IMEI của từng sản phẩm
  const [imeiValues, setImeiValues] = useState({});

  // Format helpers
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Lấy dữ liệu đơn hàng
  useEffect(() => {
    if (id) {
      dispatch(getOrder(id));
    }
  }, [id, dispatch]);

  // Khởi tạo IMEI từ order
  useEffect(() => {
    if (order?.products) {
      const initial = {};
      order.products.forEach((item, index) => {
        initial[index] = item.imeiOrSerial || "";
      });
      setImeiValues(initial);
    }
  }, [order]);

  // Cập nhật IMEI cho sản phẩm
  const handleUpdateImei = async (productIndex) => {
    const imei = imeiValues[productIndex]?.trim();
    if (!imei) {
      toast.warning("Vui lòng nhập IMEI");
      return;
    }

    try {
      await dispatch(
        updateImei({
          orderId: id,
          imeiList: [{ productIndex, imei }],
        })
      ).unwrap();
      toast.success("Cập nhật IMEI thành công");
      dispatch(getOrder(id)); // refresh
    } catch (err) {
      toast.error(err?.message || "Cập nhật IMEI thất bại");
    }
  };

  // Cập nhật trạng thái
  const handleUpdate = async (field, value) => {
    try {
      const updatePayload = {
        orderId: id,
        orderData: {
          status: field === "status" ? value : order.orderStatus,
          paymentStatus:
            field === "paymentStatus" ? value : order.paymentStatus,
        },
      };

      await dispatch(updateOrder(updatePayload)).unwrap();
      toast.success("Cập nhật thành công");
      dispatch(getOrder(id));
    } catch (err) {
      toast.error(err?.message || "Cập nhật thất bại");
    }
  };

  // Kiểm tra trạng thái cho phép sửa IMEI
  const isImeiEditable = () => {
    if (!order) return false;
    const editableStatuses = ["Not Processed", "Confirmed", "Processing"];
    return editableStatuses.includes(order.orderStatus);
  };

  const isOrderClosed = () => {
    if (!order) return false;
    return order.orderStatus === "Cancelled" || order.orderStatus === "Returned";
  };

  // State machine cho trạng thái đơn hàng
  const statusTransitions = {
    "Not Processed": ["Not Processed", "Confirmed", "Cancelled"],
    Confirmed: ["Confirmed", "Processing", "Cancelled"],
    Processing: ["Processing", "Dispatched", "Cancelled"],
    Dispatched: ["Dispatched", "Delivered"],
    Delivered: ["Delivered", "Returned"],
    Cancelled: ["Cancelled"],
    Returned: ["Returned"],
  };

  const getStatusText = (status) => {
    const map = {
      "Not Processed": "Chờ xác nhận",
      Confirmed: "Đã xác nhận",
      Processing: "Đang chuẩn bị",
      Dispatched: "Đang giao hàng",
      Delivered: "Đã giao hàng",
      Cancelled: "Đã hủy",
      Returned: "Đã trả hàng",
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      "Not Processed": "bg-gray-600",
      Confirmed: "bg-blue-600",
      Processing: "bg-yellow-600",
      Dispatched: "bg-cyan-600",
      Delivered: "bg-teal-600",
      Cancelled: "bg-red-600",
      Returned: "bg-orange-600",
    };
    return map[status] || "bg-gray-600";
  };

  const getPaymentStatusColor = (status) => {
    const map = {
      paid: "bg-green-600",
      not_paid: "bg-red-600",
      failed: "bg-red-700",
      refunded: "bg-orange-600",
      authorized: "bg-blue-600",
    };
    return map[status] || "bg-gray-600";
  };

  const getPaymentMethodText = (method) => {
    const map = {
      cod: "Thanh toán khi nhận hàng (COD)",
      bank_transfer: "Chuyển khoản ngân hàng",
      momo: "Ví MoMo",
      vnpay: "VNPay",
      paypal: "PayPal",
      ZaloPay: "ZaloPay",
      "ZaloPay (Simulated)": "ZaloPay (Demo)",
    };
    return map[method] || method;
  };

  // Tính tổng kết
  const orderSummary = {
    totalItems: order?.products?.length || 0,
    totalQuantity: order?.products?.reduce((sum, item) => sum + (item.count || 0), 0) || 0,
    subtotal: order?.products?.reduce((sum, item) => sum + (item.price || 0) * (item.count || 0), 0) || 0,
  };

  if (loading || !order) {
    return <Loading />;
  }


  const availableStatuses = statusTransitions[order.orderStatus] || [order.orderStatus];

  return (
    <div className="container mx-auto bg-white px-4 py-8">
      <ToastContainer />

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300"
        >
          ← Quay lại
        </button>
        <button
          onClick={() => dispatch(getOrder(id))}
          className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Thông tin đơn hàng & khách hàng */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border p-5 shadow-sm">
            <h1 className="mb-3 text-xl font-bold text-gray-900">
              Đơn hàng #{order._id?.substring(0, 8).toUpperCase()}...
            </h1>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Ngày đặt:</span>{" "}
                {formatDate(order.createdAt)}
              </p>
              <p>
                <span className="font-medium text-gray-800">Cập nhật:</span>{" "}
                {formatDate(order.updatedAt)}
              </p>
              <p>
                <span className="font-medium text-gray-800">Mã đầy đủ:</span>{" "}
                {order._id}
              </p>
            </div>
          </div>

          <div className="rounded-xl border p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-gray-900">
              Thông tin khách hàng
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Họ tên:</span>{" "}
                {order.customerInfo?.name}
              </p>
              <p>
                <span className="font-medium text-gray-800">Số điện thoại:</span>{" "}
                {order.customerInfo?.phone}
              </p>
              <p>
                <span className="font-medium text-gray-800">Địa chỉ:</span>{" "}
                {order.customerInfo?.address}
              </p>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Cột trái: Danh sách sản phẩm & tổng tiền */}
          <div className="space-y-6 md:col-span-2">
            <div className="rounded-xl border p-6 shadow-sm">
              <h2 className="mb-6 border-b pb-4 text-lg font-bold text-gray-900">
                Danh sách sản phẩm
              </h2>

              {order.products?.length > 0 ? (
                <div className="space-y-6">
                  {order.products.map((item, index) => {
                    const productImage = item.product?.images?.[0]?.url;
                    const isEditable = isImeiEditable();

                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-4 border-b pb-6 last:border-0 last:pb-0 md:flex-row"
                      >
                        {/* Ảnh sản phẩm */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={item.product?.title || "Sản phẩm"}
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/80";
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              Không có ảnh
                            </div>
                          )}
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.product?.title ||
                              `Sản phẩm ${item.product?._id?.substring(0, 8)}...`}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            {item.storage && (
                              <span className="rounded border bg-gray-100 px-2 py-0.5">
                                {item.storage}
                              </span>
                            )}
                            {item.color && (
                              <span className="rounded border bg-gray-100 px-2 py-0.5">
                                {item.color}
                              </span>
                            )}
                            <span>SL: {item.count}</span>
                            <span>Đơn giá: {formatPrice(item.price)}</span>
                          </div>

                          {/* IMEI */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <label className="text-sm font-medium text-gray-600">
                              IMEI/Serial:
                            </label>
                            <input
                              type="text"
                              value={imeiValues[index] || ""}
                              onChange={(e) =>
                                setImeiValues({
                                  ...imeiValues,
                                  [index]: e.target.value,
                                })
                              }
                              disabled={!isEditable}
                              className="flex-1 rounded border px-2 py-1 text-sm disabled:bg-gray-100 min-w-[140px] max-w-[220px]"
                              placeholder={isEditable ? "Nhập IMEI" : "Không thể sửa"}
                            />
                            <button
                              onClick={() => handleUpdateImei(index)}
                              disabled={!isEditable || !imeiValues[index]?.trim()}
                              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                              Cập nhật
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t pt-3">
                            <span className="font-medium text-gray-600">
                              Thành tiền:
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price * item.count)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">
                  Không có sản phẩm
                </p>
              )}
            </div>

            {/* Tổng kết đơn hàng */}
            <div className="rounded-xl border bg-gray-50 p-6 shadow-sm">
              <h3 className="mb-5 border-b pb-3 text-lg font-bold text-gray-900">
                Tổng kết đơn hàng
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({orderSummary.totalQuantity} sản phẩm):</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(orderSummary.subtotal)}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá (Coupon):</span>
                    <span className="font-medium">
                      - {formatPrice(order.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span
                    className={
                      order.shippingFee === 0
                        ? "font-medium text-green-600"
                        : "font-medium text-gray-900"
                    }
                  >
                    {order.shippingFee === 0
                      ? "Miễn phí"
                      : formatPrice(order.shippingFee)}
                  </span>
                </div>

                <div className="mt-3 flex items-end justify-between border-t border-gray-200 pt-4">
                  <span className="text-base font-bold text-gray-900">
                    Tổng thu khách:
                  </span>
                  <span className="text-2xl font-bold text-[#d70018]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Quản lý trạng thái */}
          <div className="space-y-6 md:col-span-1">
            {/* Trạng thái hiện tại */}
            <div className="rounded-xl border p-5 shadow-sm">
              <h2 className="mb-4 border-b pb-3 text-lg font-bold text-gray-900">
                Trạng thái hệ thống
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Trạng thái đơn hàng:
                  </span>
                  <span
                    className={`ml-2 inline-block rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm ${getStatusColor(order.orderStatus)}`}
                  >
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Trạng thái thanh toán:
                  </span>
                  <span
                    className={`ml-2 inline-block rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm ${getPaymentStatusColor(order.paymentStatus)}`}
                  >
                    {order.paymentStatus === "paid"
                      ? "Đã thanh toán"
                      : order.paymentStatus === "not_paid"
                      ? "Chưa thanh toán"
                      : order.paymentStatus === "failed"
                      ? "Thất bại"
                      : order.paymentStatus === "refunded"
                      ? "Đã hoàn tiền"
                      : order.paymentStatus === "authorized"
                      ? "Đã ủy quyền"
                      : order.paymentStatus}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <span className="text-sm font-medium text-gray-500">
                    Phương thức thanh toán:
                  </span>
                  <p className="text-sm font-bold text-gray-900">
                    {getPaymentMethodText(order.paymentMethod)}
                  </p>
                </div>
              </div>
            </div>

            {/* Form cập nhật */}
            <div className="rounded-xl border bg-gray-50 p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Cập nhật đơn hàng
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Trạng thái đơn hàng
                  </label>
                  <select
                    className={`w-full rounded-lg border p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none ${
                      isOrderClosed()
                        ? "cursor-not-allowed bg-gray-200"
                        : "bg-white"
                    }`}
                    value={order.orderStatus || ""}
                    onChange={(e) => handleUpdate("status", e.target.value)}
                    disabled={loading || isOrderClosed()}
                  >
                    {availableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                  {isOrderClosed() && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      Đơn hàng đã đóng, không thể thay đổi.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Trạng thái thanh toán
                  </label>
                  <select
                    className={`w-full rounded-lg border p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none ${
                      isOrderClosed()
                        ? "cursor-not-allowed bg-gray-200"
                        : "bg-white"
                    }`}
                    value={order.paymentStatus || ""}
                    onChange={(e) => handleUpdate("paymentStatus", e.target.value)}
                    disabled={loading || isOrderClosed()}
                  >
                    <option value="not_paid">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thất bại</option>
                    <option value="refunded">Đã hoàn tiền</option>
                    <option value="authorized">Đã ủy quyền</option>
                  </select>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  * Thay đổi sẽ được cập nhật ngay lập tức.
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