import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiShoppingCart, FiArrowLeft, FiTag, FiTruck } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Actions
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

  const { cart, isLoading } = useSelector((state) => state.cart);
  const [coupon, setCoupon] = useState("");

  // Fetch Cart on Mount
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);
  
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper Format Tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  // --- HANDLERS ---

  // 1. Cập nhật số lượng
  const handleUpdateQuantity = async (item, type) => {
    // Nếu giảm và số lượng đang là 1 -> Hỏi xóa
    if (type === "decrement" && item.count === 1) {
        handleRemoveItem(item);
        return;
    }

    const payload = {
        productId: item.product._id,
        color: item.color,
        storage: item.storage,
        count: 1, // Mỗi lần bấm nút là tăng/giảm 1 đơn vị
        action: type // "increment" hoặc "decrement"
    };

    await dispatch(updateCartItem(payload));
    dispatch(getCart()); 
  };

  // 2. Xóa sản phẩm
  const handleRemoveItem = async (item) => {
    if (window.confirm(`Bạn muốn xóa ${item.product.title}?`)) {
      const payload = {
        productId: item.product._id,
        color: item.color,
        storage: item.storage
      };
      await dispatch(deleteCartItem(payload));
      dispatch(getCart());
    }
  };

  // 3. Áp dụng Coupon
  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return toast.warning("Vui lòng nhập mã giảm giá");
    const result = await dispatch(applyCoupon({ coupon }));
    if (applyCoupon.fulfilled.match(result)) {
        setCoupon("");
        dispatch(getCart());
    }
  };

  // --- RENDER ---

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;

  // Giỏ hàng trống
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <FiShoppingCart className="mb-4 h-20 w-20 text-gray-300" />
        <h2 className="text-2xl font-semibold text-gray-700">Giỏ hàng trống</h2>
        <Link to="/" className="mt-6 flex items-center rounded-lg bg-[#d70018] px-8 py-3 text-white hover:bg-red-700">
          <FiArrowLeft className="mr-2" /> Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 max-w-[1200px]">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        Giỏ hàng <span className="text-sm font-normal text-gray-500">({cart.products.length} sản phẩm)</span>
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        
        {/* LEFT: CART ITEMS */}
        <div className="flex-1">
          <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
            {cart.products.map((item, index) => {
              // Vì backend populate "product", nên item.product là object chứa title, images...
              // item.price là giá variant đã lưu trong giỏ
              return (
                <div key={index} className="flex flex-col border-b p-4 last:border-b-0 sm:flex-row sm:items-center hover:bg-gray-50 transition">
                  {/* Image */}
                  <div className="mb-4 sm:mb-0 sm:mr-6 shrink-0">
                    <img
                      src={item.product?.images?.[0]?.url || "https://via.placeholder.com/100"}
                      alt={item.product?.title}
                      className="h-24 w-24 object-contain rounded-md border bg-white p-1"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <Link to={`/product/${item.product?._id}`} className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-[#d70018] transition">
                            {item.product?.title}
                        </Link>
                        <button onClick={() => handleRemoveItem(item)} className="text-gray-400 hover:text-red-600 p-1">
                            <RiDeleteBinLine size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{item.storage}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{item.color}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-4">
                        <div className="text-lg font-bold text-[#d70018]">
                            {formatPrice(item.price)}
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center border rounded bg-white">
                            <button 
                                onClick={() => handleUpdateQuantity(item, "decrement")}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >-</button>
                            <input 
                                type="text" 
                                value={item.count} 
                                readOnly 
                                className="w-10 text-center text-sm font-medium border-x py-1 focus:outline-none"
                            />
                            <button 
                                onClick={() => handleUpdateQuantity(item, "increment")}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >+</button>
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:w-96">
          <div className="sticky top-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cộng giỏ hàng</h2>
            
            {/* Coupon */}
            <div className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Mã giảm giá"
                    className="flex-1 border rounded px-3 py-2 text-sm focus:border-[#d70018] outline-none"
                />
                <button 
                    onClick={handleApplyCoupon}
                    className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 transition"
                >
                    Áp dụng
                </button>
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-medium text-gray-900">{formatPrice(cart.cartTotal)}</span>
                </div>
                
                {/* Hiển thị giảm giá nếu có */}
                {cart.totalAfterDiscount && cart.totalAfterDiscount < cart.cartTotal && (
                    <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>- {formatPrice(cart.cartTotal - cart.totalAfterDiscount)}</span>
                    </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-[#d70018]">
                        {formatPrice(cart.totalAfterDiscount || cart.cartTotal)}
                    </span>
                </div>
                <p className="text-right text-xs text-gray-500">(Đã bao gồm VAT)</p>
            </div>

            <button 
                onClick={() => navigate("/checkout")}
                className="w-full bg-[#d70018] text-white py-3 rounded-lg font-bold uppercase mt-6 hover:bg-red-700 transition shadow-lg"
            >
                Tiến hành đặt hàng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;