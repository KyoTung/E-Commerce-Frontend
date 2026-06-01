import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
import {
  createOrder,
  deleteOrder,
  checkCouponCheckout,
  resetCheckoutReview,
} from "../../features/guestSlice/order/orderSlice";
import { getUser } from "../../features/guestSlice/user/userSlice";
import { getCart } from "../../features/guestSlice/cart/cartSlice";
import Loading from "../../components/Loading";
import orderService from "../../features/guestSlice/order/orderService";
import PaymentModal from "../../components/PaymentModal"; // Import Modal Fake

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // --- REDUX STATE ---
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);

  // Bổ sung lấy checkoutReview (dữ liệu check mã) từ state orderClient
  const { isLoading, checkoutReview } = useSelector(
    (state) => state.orderClient,
  );

  // --- LOCAL STATE ---
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingFee, setShippingFee] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Thêm State quản lý mã giảm giá
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");

  // State cho Modal Thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrderInfo, setCreatedOrderInfo] = useState(null);

  // Lấy danh sách sản phẩm được chọn từ trang Giỏ hàng truyền sang.
  const checkoutItems = location.state?.checkoutItems || cart?.products || [];

  // 1. TỰ TÍNH TIỀN TẠM TÍNH TỪ DANH SÁCH SẢN PHẨM ĐƯỢC CHỌN
  const baseTotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  // 2. TÍNH TIỀN GIẢM GIÁ VÀ TỔNG CỘNG ĐỂ HIỂN THỊ UI
  const discountAmount = checkoutReview?.discountAmount || 0;
  const finalTotal = baseTotal - discountAmount + shippingFee;

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
      setValue(
        "name",
        user.fullName || user.firstname + " " + user.lastname || "",
      );
      setValue("email", user.email || "");
      setValue("phone", user.mobile || "");
      setValue("address", user.address || "");
    }
  }, [user, cart, dispatch, setValue]);

  // Tính phí ship (Dựa trên baseTotal thay vì cartTotal)
  useEffect(() => {
    if (baseTotal > 20000000) {
      setShippingFee(0);
    } else {
      setShippingFee(30000);
    }
  }, [baseTotal]);

  // Xóa mã giảm giá nếu khách hàng load lại hoặc đổi sản phẩm thanh toán
  useEffect(() => {
    dispatch(resetCheckoutReview());
    setAppliedCouponCode("");
  }, [checkoutItems.length, dispatch]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  // --- HÀM XỬ LÝ: ÁP DỤNG MÃ GIẢM GIÁ ---
  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return toast.warning("Vui lòng nhập mã");

    // Gửi định dạng selectedItems chuẩn xác xuống API
    const selectedPayload = checkoutItems.map((item) => ({
      productId: item.product?._id || item.product,
      color: item.color,
      storage: item.storage,
    }));

    dispatch(
      checkCouponCheckout({
        couponCode: couponInput,
        selectedItems: selectedPayload,
      }),
    ).then((res) => {
      // Nếu thành công, lưu lại chữ mã giảm giá để lát gửi lúc Đặt hàng
      if (!res.error && !res.payload?.error) {
        setAppliedCouponCode(couponInput);
      }
    });
  };

  // --- HÀM XỬ LÝ: ĐẶT HÀNG ---
  const onSubmit = async (data) => {
    if (!checkoutItems || checkoutItems.length === 0) {
      toast.error("Không có sản phẩm để thanh toán!");
      return;
    }

    const fullAddress = `${data.address}, ${data.commune || ""}, ${data.city || ""}`;

    // Lọc lại dữ liệu gửi đi
    const selectedPayload = checkoutItems.map((item) => ({
      productId: item.product?._id || item.product,
      color: item.color,
      storage: item.storage,
    }));

    // PAYLOAD MỚI: Cực kỳ gọn gàng, Backend sẽ tự tính toán
    const orderData = {
      customerInfo: {
        name: data.name,
        address: fullAddress.replace(/, ,/g, "").trim(),
        phone: data.phone,
        email: data.email,
      },
      paymentMethod: paymentMethod === "ZaloPay" ? "ZaloPay" : "cod",
      shippingFee: shippingFee,
      couponCode: appliedCouponCode || null, // Chỉ ném text mã giảm giá xuống
      selectedItems: selectedPayload, // Ném danh sách sản phẩm xuống
    };

    try {
      setIsProcessingPayment(true);

      const resultAction = await dispatch(createOrder(orderData)).unwrap();
      const newOrder = resultAction.order || resultAction;

      if (paymentMethod === "ZaloPay") {
        let payUrl = "";

        try {
          const paymentResult = await orderService.createPaymentZaloPay({
            orderId: newOrder._id,
            // Với ZaloPay, truyền đúng finalTotal mà frontend đang hiển thị để khớp bill
            totalAmount: finalTotal,
          });

          if (paymentResult.return_code === 1) {
            payUrl = paymentResult.order_url;
          }
        } catch (err) {
          console.warn("Lỗi ZaloPay, chạy Modal Demo.");
        }

        setCreatedOrderInfo({
          id: newOrder._id,
          total: finalTotal,
          url: payUrl,
        });
        setShowPaymentModal(true);
        setIsProcessingPayment(false);
      } else {
        setTimeout(() => {
          navigate(`/order-confirmation/${newOrder._id}`, {
            state: { isNewOrder: true },
          });
        }, 500);
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error(error?.error || error?.message || "Đặt hàng thất bại");
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);

    navigate(`/order-confirmation/${createdOrderInfo.id}`, {
      state: { isNewOrder: true },
    });
  };

  // --- RENDER ---
  // ... (Phần UI return của bạn giữ nguyên, nhớ thêm input gọi handleApplyCoupon)

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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500 mb-6">
            Bạn chưa có sản phẩm nào để thanh toán.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-red-600 hover:underline"
          >
            <FiArrowLeft className="mr-2" /> Quay lại mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Link
            to="/cart"
            className="text-gray-500 hover:text-red-600 transition"
          >
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("name", {
                        required: "Vui lòng nhập họ tên",
                      })}
                      className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:border-red-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Nguyễn Văn A"
                    />
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        {...register("email", {
                          required: "Vui lòng nhập email",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email không hợp lệ",
                          },
                        })}
                        className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:border-red-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        placeholder="email@example.com"
                      />
                      <FiMail className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "Vui lòng nhập SĐT",
                          pattern: {
                            value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                            message: "SĐT không hợp lệ",
                          },
                        })}
                        className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:border-red-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                        placeholder="0912345678"
                      />
                      <FiPhone className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ (Số nhà, đường) *
                  </label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Vui lòng nhập địa chỉ",
                    })}
                    className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-1 focus:border-red-500 ${errors.address ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Số 123, đường ABC"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    {...register("city", { required: "Nhập Tỉnh/TP" })}
                    placeholder="Tỉnh/Thành phố *"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none"
                  />
                  <input
                    type="text"
                    {...register("commune", { required: "Nhập Phường/Xã" })}
                    placeholder="Phường/Xã *"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none"
                  />
                  {/* Bạn có thể thêm trường Quận/Huyện nếu cần */}
                </div>
              </div>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiCreditCard className="mr-2 text-red-600" /> Phương thức thanh
                toán
              </h2>
              <div className="space-y-3">
                {/* COD */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "cod" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                  />
                  <div className="ml-4">
                    <div className="flex items-center font-bold text-gray-800">
                      <FiTruck className="mr-2" /> Thanh toán khi nhận hàng
                      (COD)
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Thanh toán bằng tiền mặt cho shipper khi nhận hàng.
                    </p>
                  </div>
                </label>

                {/* ZaloPay */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "ZaloPay" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="ZaloPay"
                    checked={paymentMethod === "ZaloPay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center font-bold text-gray-800">
                        <img
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                          alt="ZaloPay"
                          className="w-6 h-6 mr-2 object-contain"
                        />{" "}
                        Ví điện tử ZaloPay
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                        KHUYÊN DÙNG
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Thanh toán nhanh chóng qua ví ZaloPay hoặc app ngân hàng.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Đơn hàng (
                {(location.state?.checkoutItems || cart?.products || []).length}{" "}
                sản phẩm)
              </h2>

              <div className="border-b border-gray-100 pb-4 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {/* SỬA VÒNG LẶP RENDER Ở ĐÂY */}
                {(location.state?.checkoutItems || cart?.products || []).map(
                  (item, idx) => (
                    <div key={idx} className="flex gap-4 mb-4 last:mb-0">
                      <div className="relative shrink-0">
                        <img
                          src={
                            item.product?.images?.[0]?.url ||
                            "https://via.placeholder.com/60"
                          }
                          alt={item.product?.title}
                          className="w-16 h-16 object-contain border rounded-md"
                        />
                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                          {item.count}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                          {item.product?.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.storage} | {item.color}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {formatPrice(item.price * item.count)}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="flex gap-2 mb-4 border-b border-gray-100 pb-4">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Mã giảm giá"
                  className="flex-1 border rounded px-3 py-2 text-sm focus:border-red-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900"
                >
                  Áp dụng
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(baseTotal)}
                  </span>
                </div>

                {checkoutReview && checkoutReview.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({appliedCouponCode})</span>
                    <span>- {formatPrice(checkoutReview.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-bold">Miễn phí</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-base font-bold text-gray-800">
                  Tổng thanh toán
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(finalTotal)}
                </span>
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
                <span>
                  Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng và Chính
                  sách bảo mật của Nest Store.
                </span>
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
