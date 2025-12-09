import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiShoppingCart, FiArrowLeft, FiTag, FiTruck } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Actions & Components
import {
  getCart,
  deleteCartItem,
  updateCartItem,
  applyCoupon,
} from "../../features/guestSlice/cart/cartSlice";
import Loading from "../../components/Loading";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Lấy dữ liệu từ Redux Store
  const { cart, isLoading } = useSelector((state) => state.cart);
  
  // State cho mã giảm giá
  const [coupon, setCoupon] = useState("");

  // 2. Fetch dữ liệu khi vào trang
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Helper format tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  // --- HANDLERS ---

  // Xóa sản phẩm
  const handleRemoveItem = async (cartItemId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await dispatch(deleteCartItem(cartItemId));
      dispatch(getCart()); // Refresh lại giỏ sau khi xóa
    }
  };

  // Cập nhật số lượng (Tăng/Giảm)
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Gọi API update
    await dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
    dispatch(getCart()); // Refresh để tính lại tổng tiền
  };

  // Áp dụng mã giảm giá
  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }
    const result = await dispatch(applyCoupon({ coupon }));
    if (applyCoupon.fulfilled.match(result)) {
      setCoupon(""); // Reset ô nhập
      dispatch(getCart()); // Refresh để lấy giá sau giảm
    }
  };

  // Chuyển sang thanh toán
  const handleCheckout = () => {
    navigate("/checkout");
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Kiểm tra giỏ hàng rỗng
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <FiShoppingCart className="mb-4 h-20 w-20 text-gray-300" />
        <h2 className="mb-2 text-2xl font-semibold text-gray-700">
          Giỏ hàng trống
        </h2>
        <p className="mb-8 text-gray-500">
          Hãy thêm các sản phẩm bạn yêu thích vào giỏ hàng
        </p>
        <Link
          to="/"
          className="flex items-center rounded-lg bg-[#d70018] px-8 py-3 text-white transition-colors hover:bg-red-700 font-medium"
        >
          <FiArrowLeft className="mr-2" />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 max-w-[1200px]">
      <ToastContainer />

      {/* Header */}
      <div className="mb-8 flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Giỏ hàng của bạn
        </h1>
        <span className="ml-3 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
          {cart.products.length} sản phẩm
        </span>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        
        {/* --- LEFT: PRODUCT LIST --- */}
        <div className="flex-1">
          <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
            {cart.products.map((item) => {
              // item.product chứa thông tin chi tiết (title, images...)
              // item chứa thông tin trong giỏ (count, color, price...)
              const productInfo = item.product || {};
              const imageUrl = productInfo.images?.[0]?.url || "https://via.placeholder.com/100";

              return (
                <div
                  key={item._id} // ID của item trong giỏ hàng (Cart Item ID)
                  className="flex flex-col border-b p-4 last:border-b-0 sm:flex-row sm:items-center hover:bg-gray-50 transition-colors"
                >
                  {/* Product image */}
                  <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-6">
                    <img
                      src={imageUrl}
                      alt={productInfo.title}
                      className="h-24 w-24 rounded-lg object-contain border bg-white p-1"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-4">
                        {productInfo.title}
                        </h3>
                        <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Xóa"
                        >
                            <RiDeleteBinLine size={20} />
                        </button>
                    </div>
                    
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      {item.color && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Màu: {item.color}</span>
                      )}
                      {item.storage && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Dung lượng: {item.storage}</span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                        {/* Price */}
                        <div className="text-lg font-bold text-[#d70018]">
                            {formatPrice(item.price)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-lg border bg-white">
                            <button
                                onClick={() => handleUpdateQuantity(item._id, item.count - 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                disabled={item.count <= 1}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={item.count}
                                readOnly // Để tránh lỗi input, chỉ cho sửa bằng nút +/-
                                className="w-10 border-x py-1 text-center focus:outline-none text-sm font-medium"
                            />
                            <button
                                onClick={() => handleUpdateQuantity(item._id, item.count + 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    
                    {/* Subtotal per item (Optional) */}
                    {/* <div className="mt-2 text-right text-sm text-gray-500">
                        Thành tiền: {formatPrice(item.price * item.count)}
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-[#d70018] font-medium"
            >
              <FiArrowLeft className="mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* --- RIGHT: CHECKOUT SUMMARY --- */}
        <div className="lg:w-96">
          <div className="sticky top-24 rounded-lg bg-white p-6 shadow-md border border-gray-200">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Cộng giỏ hàng
            </h2>

            {/* Discount Code Input */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FiTag className="mr-2 text-gray-600" />
                <label className="font-medium text-sm">Mã giảm giá</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 rounded-lg border px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Nhập mã ưu đãi"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">{formatPrice(cart.cartTotal)}</span>
              </div>

              {/* Nếu có giảm giá (totalAfterDiscount < cartTotal) */}
              {cart.totalAfterDiscount && cart.totalAfterDiscount < cart.cartTotal && (
                 <div className="flex justify-between text-green-600">
                    <span>Đã giảm:</span>
                    <span>- {formatPrice(cart.cartTotal - cart.totalAfterDiscount)}</span>
                 </div>
              )}

              <div className="flex justify-between">
                <div className="flex items-center">
                  <FiTruck className="mr-2 text-gray-600" />
                  <span className="text-gray-600">Phí vận chuyển:</span>
                </div>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>

              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-[#d70018]">
                  {formatPrice(cart.totalAfterDiscount || cart.cartTotal)}
                </span>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">(Đã bao gồm VAT)</p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-lg bg-[#d70018] py-3 text-lg font-bold text-white transition-colors hover:bg-red-700 shadow-md uppercase"
            >
              Tiến hành đặt hàng
            </button>

            {/* Security Badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
               <div className="flex flex-col items-center gap-1">
                  <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/2bcf834c40468ebcb90b.svg" alt="" className="h-6 w-6"/>
                  <span className="text-[10px] text-gray-500">Đổi trả 30 ngày</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                  <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/511aca04cc3ba9234ab0.png" alt="" className="h-6 w-6"/>
                  <span className="text-[10px] text-gray-500">Chính hãng 100%</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                  <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/1653fb193b0a7268d0e7.svg" alt="" className="h-6 w-6"/>
                  <span className="text-[10px] text-gray-500">Freeship</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;