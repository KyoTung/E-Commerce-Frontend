import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Actions
import {
  getCart,
  deleteCartItem,
  updateCartItem,
} from "../../features/guestSlice/cart/cartSlice";
import Loading from "../../components/Loading";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const { cart, isLoading } = useSelector((state) => state.cart);
  const [coupon, setCoupon] = useState("");
  
  // Lưu các sản phẩm được chọn (Dùng key kết hợp ID, màu, dung lượng)
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [couponDetails, setCouponDetails] = useState(null);

  // Fetch Cart on Mount
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    if (location.state?.autoSelectKey && cart?.products) {
      const keyToSelect = location.state.autoSelectKey;
      
      // Kiểm tra xem sản phẩm đó đã render trong giỏ hàng chưa
      const isItemInCart = cart.products.some(
        item => `${item.product?._id}-${item.color}-${item.storage}` === keyToSelect
      );

      // Nếu có, tự động đưa vào danh sách tích chọn và xóa state để tránh lặp lại khi refresh
      if (isItemInCart && !selectedKeys.includes(keyToSelect)) {
        setSelectedKeys(prev => [...prev, keyToSelect]);
        
        // Xóa state của location để khi người dùng reload trang không bị auto-select lại
        window.history.replaceState({}, document.title); 
      }
    }
  }, [location.state, cart, selectedKeys]);

  useEffect(() => {
    // Chỉ reset nếu đang có mã giảm giá được áp dụng
    if (couponDetails) {
      setCouponDetails(null);
      setCoupon("");
      toast.info("Đã thay đổi lựa chọn, mã giảm giá đã được reset");
    }
  }, [selectedKeys]);

  // Helper Format Tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  // Tạo Unique Key cho mỗi sản phẩm trong giỏ để phân biệt
  const getItemKey = (item) => `${item.product?._id}-${item.color}-${item.storage}`;

  // --- HANDLERS DÀNH CHO CHECKBOX ---

const handleToggleSelect = (item) => {
  const key = getItemKey(item);
  setSelectedKeys((prev) =>
    // Nếu danh sách (prev) ĐÃ CHỨA key này -> dùng .filter để LOẠI BỎ (Bỏ tích)
    // Nếu danh sách CHƯA CHỨA key này -> dùng [...] để THÊM VÀO (Tích chọn)
    prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
  );
};

  const handleSelectAll = () => {
    if (!cart?.products) return;
    if (selectedKeys.length === cart.products.length) {
      setSelectedKeys([]); // Bỏ chọn tất cả
    } else {
      setSelectedKeys(cart.products.map(getItemKey)); // Chọn tất cả
    }
  };

  // --- TÍNH TOÁN LẠI TỔNG TIỀN DỰA TRÊN SẢN PHẨM ĐƯỢC CHỌN ---
  
  const selectedProducts = cart?.products?.filter((item) =>
    selectedKeys.includes(getItemKey(item))
  ) || [];

  const selectedTotal = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  // --- HANDLERS CŨ ---

  const handleUpdateQuantity = async (item, type) => {
    if (type === "decrement" && item.count === 1) {
      handleRemoveItem(item);
      return;
    }

    const payload = {
      productId: item.product._id,
      color: item.color,
      storage: item.storage,
      count: 1,
      action: type,
    };

    await dispatch(updateCartItem(payload));
    dispatch(getCart());
  };

  const handleRemoveItem = async (item) => {
    if (window.confirm(`Bạn muốn xóa ${item.product.title}?`)) {
      const payload = {
        productId: item.product._id,
        color: item.color,
        storage: item.storage,
      };
      await dispatch(deleteCartItem(payload));
      
      // Nếu xóa sản phẩm, loại bỏ nó khỏi danh sách đang chọn
      const key = getItemKey(item);
      setSelectedKeys((prev) => prev.filter((k) => k !== key));
      
      dispatch(getCart());
    }
  };


  // NÚT THANH TOÁN
const handleCheckout = () => {
    if (selectedKeys.length === 0) {
      return toast.warning("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
    }
    
    navigate("/checkout", {
      state: {
        checkoutItems: selectedProducts,
        // SỬA DÒNG NÀY: Truyền giá đã giảm (nếu có)
        checkoutTotal: cart.totalAfterDiscount || selectedTotal, 
        discountAmount: cart.discountAmount || 0 
      },
    });
  };

  // --- RENDER ---

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;

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

  const isAllSelected = cart.products.length > 0 && selectedKeys.length === cart.products.length;

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 max-w-[1200px]">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        Giỏ hàng <span className="text-sm font-normal text-gray-500">({cart.products.length} sản phẩm)</span>
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        
        {/* LEFT: CART ITEMS */}
        <div className="flex-1">
          {/* Header chọn tất cả */}
          <div className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="w-5 h-5 text-[#d70018] cursor-pointer rounded border-gray-300 focus:ring-[#d70018]"
            />
            <span className="ml-3 font-medium text-gray-700 cursor-pointer" onClick={handleSelectAll}>
              Chọn tất cả ({cart.products.length} sản phẩm)
            </span>
          </div>

          <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
            {cart.products.map((item, index) => {
              const isSelected = selectedKeys.includes(getItemKey(item));

              return (
                <div key={index} className="flex flex-col border-b p-4 last:border-b-0 sm:flex-row sm:items-center hover:bg-gray-50 transition">
                  
                  {/* Checkbox */}
                  <div className="mb-4 sm:mb-0 sm:mr-4 shrink-0 flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(item)}
                      className="w-5 h-5 text-[#d70018] cursor-pointer rounded border-gray-300 focus:ring-[#d70018]"
                    />
                  </div>

                  {/* Image */}
                  <div className="mb-4 sm:mb-0 sm:mr-6 shrink-0 cursor-pointer" onClick={() => handleToggleSelect(item)}>
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
                      <button onClick={() => handleRemoveItem(item)} className="text-gray-400 hover:text-red-600 p-1 ml-2">
                        <RiDeleteBinLine size={20} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 cursor-pointer" onClick={() => handleToggleSelect(item)}>
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
            
          
            {/* Totals */}
            <div className="space-y-3 text-sm border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({selectedProducts.length} sản phẩm):</span>
                <span className="font-medium text-gray-900">{formatPrice(selectedTotal)}</span>
              </div>
              
              {/* Chỉ hiển thị khi có couponDetails */}
              {couponDetails && (
                <div className="flex justify-between text-green-600">
                    <span>Giảm giá (Coupon):</span>
                    <span>- {formatPrice(couponDetails.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Tổng cộng:</span>
                <span className="text-[#d70018]">
                  {/* Nếu không có tích chọn sản phẩm nào, chắc chắn là 0 */}
                  {selectedKeys.length === 0 
                    ? formatPrice(0) 
                    : formatPrice(couponDetails ? couponDetails.totalAfterDiscount : selectedTotal)
                  }
                </span>
              </div>
              <p className="text-right text-xs text-gray-500">(Đã bao gồm VAT)</p>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={selectedKeys.length === 0}
              className={`w-full py-3 rounded-lg font-bold uppercase mt-6 transition shadow-lg ${
                selectedKeys.length === 0 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-[#d70018] text-white hover:bg-red-700"
              }`}
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