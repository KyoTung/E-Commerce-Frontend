import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiCalendar, FiCreditCard, FiTruck, FiUser, FiPhone, FiMapPin, FiDownload, FiHome } from "react-icons/fi";

const mockOrder = {
  id: "ORD123456",
  created_at: "2025-09-18T10:30:00Z",
  payment_status: "paid",
  payment_method: "bank",
  sub_total: 15000000,
  discount: 0.1,
  shipping: 30000,
  grand_total: 13530000,
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0901234567",
  address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
  items: [
    {
      id: 1,
      qty: 2,
      unit_price: 5000000,
      product: {
        name: "iPhone 15 Pro Max 256GB",
        image_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
      },
    },
    {
      id: 2,
      qty: 1,
      unit_price: 5000000,
      product: {
        name: "Samsung Galaxy S23 Ultra",
        image_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-tim-1.png",
      },
    },
  ],
};

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    console.log("Downloading invoice for order:", order.id);
    alert(`Invoice for order ${order.id} would be downloaded`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <Link
            to="/"
            className="block w-full bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi</p>
          <p className="text-sm text-gray-500 mt-2">Mã đơn hàng: {order.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiShoppingBag className="mr-2 text-red-600" />
                Thông tin đơn hàng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FiCreditCard className="text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                    <p className="font-medium">
                      {order.payment_method === "bank" ? "Chuyển khoản ngân hàng" : "Thanh toán khi nhận hàng"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`rounded-full w-3 h-3 mr-3 ${order.payment_status === "paid" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                    <p className="font-medium">
                      {order.payment_status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FiTruck className="text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái đơn hàng</p>
                    <p className="font-medium">Chờ xác nhận</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center border-b pb-4">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-contain rounded-lg border"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">{(item.unit_price * item.qty).toLocaleString('vi-VN')}₫</p>
                        <p className="text-sm text-gray-500">{item.unit_price.toLocaleString('vi-VN')}₫/sản phẩm</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{order.sub_total.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="text-red-500">-{(order.discount * order.sub_total).toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{order.shipping.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">{order.grand_total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2 text-red-600" />
                Thông tin khách hàng
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <FiUser className="text-red-600 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-medium">{order.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiPhone className="text-red-600 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2 flex items-start">
                  <FiMapPin className="text-red-600 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                    <p className="font-medium">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiếp theo</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <FiDownload className="mr-2" />
                  Tải hóa đơn
                </button>
                
                <Link
                  to="/"
                  className="w-full flex items-center justify-center border border-red-600 text-red-600 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  <FiHome className="mr-2" />
                  Tiếp tục mua sắm
                </Link>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Hỗ trợ khách hàng</h4>
                <p className="text-sm text-gray-600 mb-4">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi</p>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Email:</span> support@example.com</p>
                  <p className="text-sm"><span className="font-medium">Hotline:</span> 1900 1234</p>
                  <p className="text-sm"><span className="font-medium">Giờ làm việc:</span> 8:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;