import React, { useState, useContext } from "react";
import { useStateContext } from "../../contexts/contextProvider";
import { useParams, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiTruck } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock CartContext since it wasn't provided
const CartContext = React.createContext();
const axiosClient = {
  post: () => Promise.resolve({ status: 200, data: { order_id: 123 } })
};

const Checkout = () => {
  const { user } = useStateContext();
  const navigate = useNavigate();
  const { cartData, subTotal, grandTotal, clearCart } = useContext(CartContext);
  const { shipping = 0, discount = 0 } = useParams();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
    city: "",
    district: "",
    commune: "",
    payment_method: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!emailRegex.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.city.trim()) newErrors.city = "Vui lòng nhập tỉnh/thành phố";
    if (!formData.district.trim()) newErrors.district = "Vui lòng nhập quận/huyện";
    if (!formData.commune.trim()) newErrors.commune = "Vui lòng nhập phường/xã";
    if (!formData.payment_method) newErrors.payment_method = "Vui lòng chọn phương thức thanh toán";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    const orderData = {
      ...formData,
      user_id: user?.id,
      sub_total: subTotal,
      grand_total: grandTotal(),
      discount: discount,
      shipping: shipping,
      payment_status: formData.payment_method === "bank" ? "paid" : "pending",
      status: "pending",
      cart: cartData,
    };

    try {
      const response = await axiosClient.post("/save-order", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Đặt hàng thành công!");
        clearCart();
        setTimeout(() => {
          navigate(`/order-confirmation/${response.data.order_id}`);
        }, 1500);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Có lỗi xảy ra khi đặt hàng";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate order summary values
  const discountValue = subTotal * discount;
  const finalTotal = grandTotal ? grandTotal() : subTotal - discountValue + Number(shipping);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Thanh toán</h1>
        <p className="text-gray-600 text-center mb-8">Hoàn tất đơn hàng của bạn</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2 text-red-600" />
                Thông tin cá nhân
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-3 pl-10 focus:outline-none focus:ring-2 ${
                        errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-600"
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border px-4 py-3 pl-10 focus:outline-none focus:ring-2 ${
                          errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-600"
                        }`}
                        placeholder="email@example.com"
                      />
                      <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border px-4 py-3 pl-10 focus:outline-none focus:ring-2 ${
                          errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-600"
                        }`}
                        placeholder="0912345678"
                      />
                      <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="mr-2 text-red-600" />
                Địa chỉ giao hàng
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                      errors.address ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-600"
                    }`}
                    placeholder="Số nhà, tên đường"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                        errors.city ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-600"
                      }`}
                      placeholder="Hà Nội"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện *</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                        errors.district ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-600"
                      }`}
                      placeholder="Cầu Giấy"
                    />
                    {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã *</label>
                    <input
                      type="text"
                      name="commune"
                      value={formData.commune}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                        errors.commune ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-600"
                      }`}
                      placeholder="Dịch Vọng"
                    />
                    {errors.commune && <p className="mt-1 text-sm text-red-500">{errors.commune}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
              
              <div className="space-y-4">
                <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.payment_method === "bank" 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setFormData({...formData, payment_method: "bank"})}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bankTransfer"
                      name="payment_method"
                      checked={formData.payment_method === "bank"}
                      onChange={() => {}}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="bankTransfer" className="ml-3 block font-medium">
                      <div className="flex items-center">
                        <FiCreditCard className="mr-2 text-red-600" />
                        Chuyển khoản ngân hàng
                      </div>
                    </label>
                  </div>
                  {formData.payment_method === "bank" && (
                    <div className="mt-3 pl-7 text-sm text-gray-600">
                      <p>Chuyển khoản đến tài khoản ngân hàng của chúng tôi.</p>
                      <p className="mt-2 font-medium">Vietinbank: 1929429924924 - P T C</p>
                      <p className="mt-1 text-xs">Vui lòng ghi mã đơn hàng trong nội dung chuyển khoản</p>
                    </div>
                  )}
                </div>

                <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.payment_method === "cod" 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setFormData({...formData, payment_method: "cod"})}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="payment_method"
                      checked={formData.payment_method === "cod"}
                      onChange={() => {}}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="cod" className="ml-3 block font-medium">
                      <div className="flex items-center">
                        <FiTruck className="mr-2 text-red-600" />
                        Thanh toán khi nhận hàng (COD)
                      </div>
                    </label>
                  </div>
                  {formData.payment_method === "cod" && (
                    <div className="mt-3 pl-7 text-sm text-gray-600">
                      <p>Bạn chỉ phải thanh toán khi nhận được hàng.</p>
                    </div>
                  )}
                </div>

                {errors.payment_method && <p className="mt-2 text-sm text-red-500">{errors.payment_method}</p>}
              </div>
            </div>
          </div>

          {/* Right column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng của bạn</h2>
              
              <div className="border-b pb-4 mb-4">
                {cartData && cartData.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                        <img 
                          src={item.image_url || "https://via.placeholder.com/50"} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.qty} × {item.price?.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">{(item.price * item.qty)?.toLocaleString('vi-VN')}₫</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{subTotal?.toLocaleString('vi-VN')}₫</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="text-red-500">-{discountValue.toLocaleString('vi-VN')}₫</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{Number(shipping).toLocaleString('vi-VN')}₫</span>
                </div>
                
                <div className="flex justify-between pt-3 border-t font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">{finalTotal.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-3">Chính sách mua hàng</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Miễn phí giao hàng cho đơn trên 500.000₫</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Đổi trả trong 7 ngày nếu sản phẩm lỗi</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Hỗ trợ kỹ thuật 24/7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;