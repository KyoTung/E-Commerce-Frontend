import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  FiCheckCircle, FiShoppingBag, FiCalendar, FiCreditCard, 
  FiTruck, FiUser, FiPhone, FiMapPin, FiDownload, FiHome 
} from "react-icons/fi";


import { getOrderDetail } from "../../features/guestSlice/order/orderSlice";
import Loading from "../../components/Loading";

import { 
  translateOrderStatus, 
  translatePaymentStatus, 
  translatePaymentMethod 
} from "../../utils/statusHelpers";

const OrderConfirmation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentOrder, isLoading, isError } = useSelector((state) => state.orderClient);


  useEffect(() => {
    if (id) {
      dispatch(getOrderDetail(id));
    }
  }, [id, dispatch]);


  const formatPrice = (price) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };


  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;

  if (isError || !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-600 mb-6">Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.</p>
          <Link to="/" className="block w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }


  const customer = currentOrder.customerInfo || {
    name: currentOrder.orderby?.firstname + " " + currentOrder.orderby?.lastname,
    phone: currentOrder.orderby?.mobile,
    address: currentOrder.orderby?.address
  };

  const orderStatusObj = translateOrderStatus(currentOrder.orderStatus);
  const paymentStatusObj = translatePaymentStatus(currentOrder.paymentStatus);
  const paymentMethodLabel = translatePaymentMethod(currentOrder.paymentMethod);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-4 shadow-sm">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã mua hàng tại Nest Store.</p>
          <p className="text-sm text-gray-500 mt-2">
            Mã đơn hàng: <span className="font-mono font-bold text-black bg-gray-200 px-2 py-1 rounded">#{currentOrder._id}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FiShoppingBag className="mr-2 text-[#d70018]" /> Thông tin đơn hàng
              </h2>

              {/* Grid Info Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Ngày đặt */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <FiCalendar className="text-gray-500 mr-3 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Ngày đặt hàng</p>
                    <p className="font-medium text-gray-800">{formatDate(currentOrder.createdAt)}</p>
                  </div>
                </div>
                
                {/* Phương thức thanh toán */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <FiCreditCard className="text-gray-500 mr-3 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Phương thức</p>
                    <p className="font-medium text-gray-800">{paymentMethodLabel}</p>
                  </div>
                </div>
                
                {/* Trạng thái Thanh toán (Có màu) */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className={`w-3 h-3 rounded-full mr-3 ${currentOrder.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Thanh toán</p>
                    <span className={`text-sm font-bold ${paymentStatusObj.color.replace('bg-', 'text-').replace('text-', 'text-opacity-100 ')}`}>
                        {paymentStatusObj.label}
                    </span>
                  </div>
                </div>
                
                {/* Trạng thái Vận chuyển (Có màu badge) */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <FiTruck className="text-gray-500 mr-3 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Trạng thái</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${orderStatusObj.color}`}>
                        {orderStatusObj.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product List */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Sản phẩm đã mua</h3>
                <div className="space-y-4">
                  {currentOrder.products?.map((item, idx) => (
                    <div key={idx} className="flex items-center border-b border-dashed border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="relative shrink-0 border border-gray-200 rounded-lg p-1">
                        <img
                          src={item.product?.images?.[0]?.url || "https://via.placeholder.com/80"}
                          alt={item.product?.title}
                          className="w-16 h-16 object-contain"
                        />
                        <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                            {item.count}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <Link to={`/product/${item.product?._id}`} className="font-medium text-gray-800 line-clamp-2 hover:text-[#d70018] transition">
                            {item.product?.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            {item.storage && <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{item.storage}</span>}
                            {item.color && <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{item.color}</span>}
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-bold text-[#d70018]">{formatPrice(item.price * item.count)}</p>
                        <p className="text-xs text-gray-400">{formatPrice(item.price)}/sp</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 mt-6 space-y-2">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tạm tính:</span>
                  <span className="font-medium text-gray-900">
                  
                    {formatPrice(currentOrder.products?.reduce((acc, item) => acc + item.price * item.count, 0))}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                
                <div className="flex justify-between pt-3 border-t border-dashed border-gray-200 items-end">
                  <span className="font-bold text-gray-800">Tổng thanh toán:</span>
                  <span className="text-2xl font-bold text-[#d70018]">
                    {formatPrice(currentOrder.totalAfterDiscount || currentOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

         
          <div className="space-y-6">
            
            {/* Customer Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2 text-[#d70018]" /> Người nhận hàng
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start">
                    <FiUser className="text-gray-400 mt-0.5 mr-3 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Họ và tên</p>
                        <p className="font-medium text-gray-800">{customer.name || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <FiPhone className="text-gray-400 mt-0.5 mr-3 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Số điện thoại</p>
                        <p className="font-medium text-gray-800">{customer.phone || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <FiMapPin className="text-gray-400 mt-0.5 mr-3 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Địa chỉ</p>
                        <p className="font-medium text-gray-800 leading-relaxed">{customer.address || "N/A"}</p>
                    </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác</h3>
                <div className="space-y-3">
                    {/* <button 
                        onClick={() => alert("Đang tải hóa đơn...")} 
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                        <FiDownload /> Tải hóa đơn PDF
                    </button> */}
                    <Link 
                        to="/" 
                        className="w-full flex items-center justify-center gap-2 bg-[#d70018] text-white py-3 rounded-lg hover:bg-[#b00117] transition font-medium shadow-md"
                    >
                        <FiHome /> Tiếp tục mua sắm
                    </Link>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
                    <p>Cần hỗ trợ đơn hàng?</p>
                    <p className="mt-1">Hotline: <span className="text-[#d70018] font-bold">1800.2097</span></p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;