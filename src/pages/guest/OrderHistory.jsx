import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiUser, FiShoppingBag, FiLock, FiLogOut, FiBox, 
  FiClock, FiChevronRight, FiSearch, FiXCircle, FiCreditCard 
} from "react-icons/fi"; 

// Import Actions & Services
import { getUserOrders, cancelOrder } from "../../features/guestSlice/order/orderSlice"; 
import { logout } from "../../features/authSlice/authSlice";
import orderService from "../../features/guestSlice/order/orderService";
import Loading from "../../components/Loading";
import { translateOrderStatus } from "../../utils/statusHelpers";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { orders, isLoading, isError } = useSelector((state) => state.orderClient);
  const { user } = useSelector((state) => state.auth);

  // Local State cho việc xử lý Repay (loading effect)
  const [repayLoading, setRepayLoading] = useState(false);

  // Fetch Data
  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper Format
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: '2-digit', minute:'2-digit'
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // --- 1. XỬ LÝ HỦY ĐƠN HÀNG ---
  const handleCancelOrder = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      dispatch(cancelOrder(orderId));
    }
  };

  // --- 2. XỬ LÝ THANH TOÁN LẠI (ZaloPay) ---
  const handleRepay = async (orderId) => {
    try {
      setRepayLoading(true);
      const data = await orderService.repayOrder(orderId);
      if (data && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Không lấy được link thanh toán. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Repay error:", error);
      alert(error.response?.data?.message || "Lỗi khi tạo thanh toán lại.");
    } finally {
      setRepayLoading(false);
    }
  };

  const cancellableStatus = ["Not Processed", "Pending", "Chờ xử lý"]; 

  // --- RENDER ---
  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* --- LEFT SIDEBAR --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
              {/* User Info */}
              <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 mb-3">
                  {(user?.firstname?.charAt(0) || "U").toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-800">{user?.lastname} {user?.firstname}</h3>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="p-2 space-y-1">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition">
                  <FiUser size={18} /> Thông tin tài khoản
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 bg-red-50 text-[#d70018] font-medium rounded-lg transition">
                  <FiShoppingBag size={18} /> Quản lý đơn hàng
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition text-left"
                >
                  <FiLogOut size={18} /> Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* --- RIGHT CONTENT --- */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Lịch sử đơn hàng</h1>
                <div className="relative hidden sm:block">
                    <input type="text" placeholder="Tìm theo mã đơn..." className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[#d70018] outline-none" />
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400"/>
                </div>
            </div>

            {isError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-center">
                    Có lỗi xảy ra khi tải danh sách đơn hàng.
                </div>
            )}

            {!isError && (!orders || orders.length === 0) ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBox className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
                <Link to="/" className="inline-block bg-[#d70018] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition shadow-sm">
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              /* LIST ORDERS */
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusObj = translateOrderStatus(order.orderStatus);
                  // Lấy sản phẩm đầu tiên để hiển thị ảnh đại diện
                  const firstProduct = order.orderItems?.[0]?.product || order.products?.[0]?.product; // Check kỹ cấu trúc API trả về (orderItems hay products)
                  const otherItemsCount = (order.orderItems?.length || order.products?.length) - 1;

                  // Logic điều kiện hiển thị nút
                  const canCancel = cancellableStatus.includes(order.orderStatus);
                  
                  // Logic nút Thanh toán lại: Phải là ZaloPay, Chưa trả, Chưa hủy
                  const canRepay = order.paymentMethod === 'ZaloPay' && 
                                   !order.paymentStatus === 'paid' && 
                                   order.orderStatus !== 'Cancelled';

                  return (
                    <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      
                      {/* Card Header */}
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</span>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                <FiClock size={14}/> {formatDate(order.createdAt)}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusObj.color}`}>
                                {statusObj.label}
                            </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {/* Ảnh sản phẩm */}
                            <div className="relative w-20 h-20 shrink-0 border border-gray-200 rounded-lg p-1 bg-white">
                                <img 
                                    src={firstProduct?.images?.[0]?.url || "https://via.placeholder.com/80"} 
                                    alt="Product" 
                                    className="w-full h-full object-contain"
                                />
                                {otherItemsCount > 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg text-white font-bold text-xs">
                                        +{otherItemsCount}
                                    </div>
                                )}
                            </div>

                            {/* Thông tin */}
                            <div className="flex-1 text-center sm:text-left">
                                <h4 className="font-medium text-gray-800 line-clamp-1">
                                    {firstProduct?.title || "Sản phẩm"}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Phương thức: <span className="font-medium">{order.paymentMethod}</span>
                                </p>
                                <p className={`text-sm mt-1 ${order.isPaid ? "text-green-600" : "text-orange-500"}`}>
                                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                                </p>
                            </div>

                            {/* Actions & Price */}
                            <div className="text-center sm:text-right flex flex-col items-end gap-2">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
                                    <p className="text-lg font-bold text-[#d70018]">
                                        {formatPrice(order.totalPrice || order.totalAfterDiscount)}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1 flex-wrap justify-end">
                                    
                                    {/* Nút Thanh toán lại (Quan trọng) */}
                                    {canRepay && (
                                        <button
                                            onClick={() => handleRepay(order._id)}
                                            disabled={repayLoading}
                                            className="inline-flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                        >
                                            <FiCreditCard className="mr-1" /> Thanh toán ngay
                                        </button>
                                    )}

                                    {/* Nút Hủy Đơn */}
                                    {canCancel && (
                                        <button
                                            onClick={() => handleCancelOrder(order._id)}
                                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg bg-white"
                                        >
                                            <FiXCircle className="mr-1" /> Hủy đơn
                                        </button>
                                    )}

                                    {/* Nút Xem Chi Tiết */}
                                    <Link 
                                        to={`/order-detail/${order._id}`} // Sửa lại route cho đúng với app của bạn
                                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline px-2 py-1.5"
                                    >
                                        Chi tiết <FiChevronRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderHistory;