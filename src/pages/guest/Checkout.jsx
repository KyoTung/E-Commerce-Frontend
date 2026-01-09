import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Actions & Components
import { createOrder, deleteOrder } from "../../features/guestSlice/order/orderSlice"; // Nhớ import deleteOrder
import { getUser } from "../../features/guestSlice/user/userSlice";
import { getCart } from "../../features/guestSlice/cart/cartSlice";
import Loading from "../../components/Loading";
import orderService from "../../features/guestSlice/order/orderService";
import PaymentModal from "../../components/PaymentModal"; // Import Modal Fake

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- REDUX STATE ---
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.orderClient);

  // --- LOCAL STATE ---
  const [paymentMethod, setPaymentMethod] = useState("COD"); 
  const [shippingFee, setShippingFee] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // State cho Modal Thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrderInfo, setCreatedOrderInfo] = useState(null);

  // --- REACT HOOK FORM ---
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch dữ liệu user và cart
  useEffect(() => {
    if (authUser?._id || authUser?.id) {
      dispatch(getUser(authUser._id || authUser.id));
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    if (!cart) {
      dispatch(getCart());
    }
    if (user) {
      setValue("name", user.fullName || user.firstname + " " + user.lastname || "");
      setValue("email", user.email || "");
      setValue("phone", user.mobile || ""); 
      setValue("address", user.address || "");
    }
  }, [user, cart, dispatch, setValue]);

  // Tính phí ship
  useEffect(() => {
    if (cart?.cartTotal > 20000000) {
      setShippingFee(0);
    } else {
      setShippingFee(30000);
    }
  }, [cart]);

  // Format tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  // --- XỬ LÝ SUBMIT ---
  // --- XỬ LÝ SUBMIT (ĐÃ SỬA ĐỔI CHO DEMO MODE) ---
  const onSubmit = async (data) => {
    if (!cart || cart.products.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    // 1. Chuẩn bị dữ liệu
    const fullAddress = `${data.address}, ${data.commune || ""}, ${data.city || ""}`;
    const isCouponApplied = cart.totalAfterDiscount && cart.totalAfterDiscount < cart.cartTotal;
    const finalAmount = (cart.totalAfterDiscount || cart.cartTotal) + shippingFee;

    const orderData = {
      customerInfo: {
        name: data.name,
        address: fullAddress.replace(/, ,/g, "").trim(),
        phone: data.phone,
        email: data.email,
      },
      paymentMethod: paymentMethod === "ZaloPay" ? "ZaloPay" : "COD",
      couponApplied: !!isCouponApplied,
      shippingFee: shippingFee,
      totalPrice: finalAmount,
    };

    // 2. Logic xử lý
    try {
      setIsProcessingPayment(true);

      // BƯỚC A: Tạo đơn hàng trước
      const resultAction = await dispatch(createOrder(orderData)).unwrap();
      const newOrder = resultAction.order || resultAction;

      if (paymentMethod === "ZaloPay") {
        // BƯỚC B: Nếu là ZaloPay -> CHẾ ĐỘ DEMO
        let payUrl = "";
        
        try {
          // Cố gắng gọi API thật để lấy QR Code (nếu server cấu hình đúng)
          const paymentResult = await orderService.createPaymentZaloPay({
             orderId: newOrder._id,
             totalAmount: finalAmount,
          });

          if (paymentResult.return_code === 1) {
             payUrl = paymentResult.order_url;
          }
        } catch (err) {
          console.warn("API ZaloPay lỗi hoặc chưa config xong, nhưng vẫn hiện Modal Demo.");
        }

        // --- QUAN TRỌNG: KHÔNG REDIRECT MÀ HIỆN MODAL ---
        setCreatedOrderInfo({
            id: newOrder._id,
            total: finalAmount,
            url: payUrl // Link thật (hoặc rỗng nếu lỗi)
        });
        setShowPaymentModal(true); // <--- Kích hoạt Popup tại đây
        setIsProcessingPayment(false); // Tắt loading nút đặt hàng

      } else {
        // BƯỚC C: Nếu là COD -> Chuyển trang luôn
        setTimeout(() => {
          navigate(`/order-confirmation/${newOrder._id}`);
        }, 500);
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error(error?.message || "Đặt hàng thất bại, vui lòng thử lại");
      
      // Nếu lỗi nghiêm trọng ở bước tạo đơn (không phải lỗi payment)
      setIsProcessingPayment(false);
    }
  };

  // Callback khi bấm "Thanh toán thành công" trong Modal Fake
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    navigate(`/order-confirmation/${createdOrderInfo.id}`);
  };

  // --- RENDER ---
  if (isLoading || isProcessingPayment) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
        <Loading />
        <p className="mt-4 text-gray-600 font-medium">Đang xử lý đơn hàng...</p>
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào để thanh toán.</p>
          <Link to="/" className="inline-flex items-center text-red-600 hover:underline">
            <FiArrowLeft className="mr-2" /> Quay lại mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const finalTotal = (cart.totalAfterDiscount || cart.cartTotal) + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Link to="/cart" className="text-gray-500 hover:text-red-600 transition">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: INFO & PAYMENT METHOD */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Thông tin giao hàng */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="mr-2 text-red-600" /> Thông tin nhận hàng
              </h2>
              <div className="space-y-4">
                {/* Inputs: Name, Email, Phone, Address... (Giữ nguyên code của bạn) */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                   <div className="relative">
                     <input type="text" {...register("name", { required: "Vui lòng nhập họ tên" })} className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:border-red-500 ${errors.name ? "border-red-500" : "border-gray-300"}`} placeholder="Nguyễn Văn A" />
                     <FiUser className="absolute left-3 top-3 text-gray-400" />
                   </div>
                   {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <div className="relative">
                            <input type="email" {...register("email", { required: "Vui lòng nhập email", pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" } })} className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:border-red-500 ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="email@example.com" />
                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                        <div className="relative">
                            <input type="tel" {...register("phone", { required: "Vui lòng nhập SĐT", pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: "SĐT không hợp lệ" } })} className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:border-red-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`} placeholder="0912345678" />
                            <FiPhone className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ (Số nhà, đường) *</label>
                   <input type="text" {...register("address", { required: "Vui lòng nhập địa chỉ" })} className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-1 focus:border-red-500 ${errors.address ? "border-red-500" : "border-gray-300"}`} placeholder="Số 123, đường ABC" />
                   {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" {...register("city", { required: "Nhập Tỉnh/TP" })} placeholder="Tỉnh/Thành phố *" className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none" />
                  <input type="text" {...register("commune", { required: "Nhập Phường/Xã" })} placeholder="Phường/Xã *" className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none" />
                  {/* Bạn có thể thêm trường Quận/Huyện nếu cần */}
                </div>
              </div>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiCreditCard className="mr-2 text-red-600" /> Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {/* COD */}
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "COD" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="payment_method" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-red-600 focus:ring-red-500" />
                  <div className="ml-4">
                    <div className="flex items-center font-bold text-gray-800"><FiTruck className="mr-2" /> Thanh toán khi nhận hàng (COD)</div>
                    <p className="text-xs text-gray-500 mt-1">Thanh toán bằng tiền mặt cho shipper khi nhận hàng.</p>
                  </div>
                </label>

                {/* ZaloPay */}
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "ZaloPay" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="payment_method" value="ZaloPay" checked={paymentMethod === "ZaloPay"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center font-bold text-gray-800">
                        <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" className="w-6 h-6 mr-2 object-contain" /> Ví điện tử ZaloPay
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">KHUYÊN DÙNG</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Thanh toán nhanh chóng qua ví ZaloPay hoặc app ngân hàng.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng ({cart.products.length} sản phẩm)</h2>
              
              <div className="border-b border-gray-100 pb-4 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {cart.products.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-4 last:mb-0">
                    <div className="relative shrink-0">
                      <img src={item.product?.images?.[0]?.url || "https://via.placeholder.com/60"} alt={item.product?.title} className="w-16 h-16 object-contain border rounded-md" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{item.count}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.product?.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.storage} | {item.color}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-800">{formatPrice(item.price * item.count)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{formatPrice(cart.cartTotal)}</span>
                </div>
                {cart.totalAfterDiscount && cart.totalAfterDiscount < cart.cartTotal && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>- {formatPrice(cart.cartTotal - cart.totalAfterDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? <span className="text-green-600 font-bold">Miễn phí</span> : formatPrice(shippingFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-base font-bold text-gray-800">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-red-600">{formatPrice(finalTotal)}</span>
              </div>

              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading || isProcessingPayment}
                className="w-full bg-red-600 text-white py-3.5 rounded-lg font-bold uppercase hover:bg-red-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading || isProcessingPayment ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : paymentMethod === "ZaloPay" ? (
                  "Thanh toán ZaloPay"
                ) : (
                  "Đặt hàng ngay"
                )}
              </button>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <FiCheckCircle className="text-green-500 shrink-0 mt-0.5" />
                <span>Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Nest Store.</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* --- PAYMENT MODAL (DEMO MODE) --- */}
      {showPaymentModal && createdOrderInfo && (
        <PaymentModal
            orderId={createdOrderInfo.id}
            totalAmount={createdOrderInfo.total}
            paymentUrl={createdOrderInfo.url}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Checkout;