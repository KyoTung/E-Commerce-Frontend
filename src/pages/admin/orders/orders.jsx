import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";
import { getAllOrder } from "../../../features/adminSlice/orders/orderSlice";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, totalPages, totalOrders, currentPage } = useSelector(
    (state) => state.orderAdmin,
  );
  
  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const itemsPerPage = 10;

  // Debounce tìm kiếm (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Hàm fetch dữ liệu với tất cả filter
  const fetchOrders = (page = 1) => {
    const params = {
      page,
      limit: itemsPerPage,
      search: debouncedSearch,
      orderStatus: orderStatusFilter,
      paymentStatus: paymentStatusFilter,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };
    // Loại bỏ các param undefined hoặc rỗng
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === "" || params[key] === null) {
        delete params[key];
      }
    });
    dispatch(getAllOrder(params));
  };

  // Gọi API mỗi khi filter hoặc page hoặc search thay đổi
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, debouncedSearch, orderStatusFilter, paymentStatusFilter, minPrice, maxPrice]);

  // Khi search thay đổi, reset về trang 1
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      fetchOrders(1);
    }
  }, [debouncedSearch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchOrders(newPage);
    }
  };

  // Xóa tất cả filter
  const clearFilters = () => {
    setOrderStatusFilter("");
    setPaymentStatusFilter("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      "Not Processed": "bg-gray-100 text-gray-700",
      Confirmed: "bg-blue-100 text-blue-500",
      Processing: "bg-blue-100 text-blue-700",
      Shipped: "bg-cyan-100 text-cyan-700",
      Delivered: "bg-teal-100 text-teal-700",
      Completed: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
      Returned: "bg-orange-100 text-orange-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      not_paid: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const translateOrderStatus = (status) => {
    const map = {
      "Not Processed": "Chờ xác nhận",
      Confirmed: "Đã xác nhận",
      Processing: "Đang chuẩn bị",
      Shipped: "Đã giao hàng",
      Delivered: "Đã nhận hàng",
      Completed: "Hoàn thành",
      Cancelled: "Đã hủy",
      Returned: "Hoàn trả",
    };
    return map[status] || status;
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin/create-order")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm mới
          </button>
          <button
            onClick={() => fetchOrders(1)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition"
          >
            <RefreshCw size={18} /> Tải lại
          </button>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 transition"
          >
            <X size={18} /> Xóa lọc
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Ô tìm kiếm */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm mã/Tên KH..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Lọc theo trạng thái đơn hàng */}
        <select
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Tất cả trạng thái đơn</option>
          <option value="Not Processed">Chờ xác nhận</option>
          <option value="Confirmed">Đã xác nhận</option>
          <option value="Processing">Đang chuẩn bị</option>
          <option value="Dispatched">Đang giao hàng</option>
          <option value="Delivered">Đã nhận hàng - hoàn thành</option>
          <option value="Cancelled">Đã hủy</option>
          <option value="Returned">Hoàn trả</option>
        </select>

        {/* Lọc theo trạng thái thanh toán */}
        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Tất cả thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="pending">Đang xử lý</option>
          <option value="not_paid">Chưa thanh toán</option>
        </select>

        {/* Lọc theo khoảng giá (từ - đến) */}
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Từ (VNĐ)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            min="0"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Đến (VNĐ)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            min="0"
          />
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Không tìm thấy đơn hàng nào phù hợp.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">#</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Mã đơn</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Khách hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Số điện thoại</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Tổng tiền</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Ngày đặt</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Thanh toán</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {orders.map((order, idx) => (
                      <tr
                        key={order._id}
                        onClick={() => navigate(`/admin/order-detail/${order._id}`)}
                        className="hover:bg-gray-50 transition cursor-pointer"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-gray-600">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerInfo?.name || "N/A"}
                          </div>
                          <div
                            className="text-xs text-gray-400 truncate max-w-[180px]"
                            title={order.customerInfo?.address}
                          >
                            {order.customerInfo?.address || "Chưa có địa chỉ"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {order.customerInfo?.phone || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatPrice(order.total)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(
                                order.paymentStatus,
                              )}`}
                            >
                              {order.paymentStatus === "paid"
                                ? "Đã thanh toán"
                                : order.paymentStatus === "not_paid"
                                ? "Chưa thanh toán"
                                : order.paymentStatus === "pending"
                                ? "Đang xử lý"
                                : order.paymentStatus}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                              order.orderStatus,
                            )}`}
                          >
                            {translateOrderStatus(order.orderStatus)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Phân trang */}
            {totalOrders > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalOrders)}
                    </span>{" "}
                    trên tổng số{" "}
                    <span className="font-medium">{totalOrders}</span> đơn hàng
                  </p>
                </div>
                <div className="flex flex-1 justify-between sm:justify-end gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" /> Trước
                  </button>
                  <span className="text-sm text-gray-700 py-2">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Sau <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;