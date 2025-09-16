import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiShoppingCart, FiArrowLeft, FiTag, FiTruck } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock data với hình ảnh điện thoại thực tế
const mockCartAPI = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "iPhone 15 Pro Max 256GB",
          price: 28990000,
          qty: 1,
          image_url:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
          color: "Titanium tự nhiên",
          storage: "256GB",
        },
        {
          id: 2,
          name: "Samsung Galaxy S23 Ultra",
          price: 21990000,
          qty: 2,
          image_url:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-tim-1.png",
          color: "Tím",
          storage: "512GB",
        },
        {
          id: 3,
          name: "Xiaomi 13 Pro",
          price: 17990000,
          qty: 1,
          image_url:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-13-pro-1.jpg",
          color: "Đen",
          storage: "256GB",
        },
      ]);
    }, 700);
  });

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([
    {
      name: "SALE10",
      value: 0.1,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      minOrder: 10000000,
    },
    {
      name: "SALE20",
      value: 0.2,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      minOrder: 20000000,
    },
  ]);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [shipping, setShipping] = useState(30000);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Lấy dữ liệu cart từ API mô phỏng
  useEffect(() => {
    mockCartAPI().then((data) => setCartData(data));
  }, []);

  // Hàm tính tổng tiền
  const subTotal = cartData.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Hàm tính tổng sau giảm giá
  const grandTotal = Math.max(
    subTotal -
      (appliedDiscount ? subTotal * appliedDiscount.value : 0) +
      shipping,
    0
  );

  // Handle discount codes
  const applyDiscount = () => {
    const today = new Date();
    const found = discountCodes.find((dc) => {
      const start = new Date(dc.start_date);
      const end = new Date(dc.end_date);
      return (
        dc.name === discountCode &&
        today >= start &&
        today <= end &&
        subTotal >= dc.minOrder
      );
    });

    if (found) {
      setAppliedDiscount(found);
      setErrorMessage("");
      toast.success(`Áp dụng mã giảm giá ${found.name} thành công!`);
    } else {
      setAppliedDiscount(null);
      setErrorMessage(
        "Mã giảm giá không hợp lệ, đã hết hạn hoặc không đủ điều kiện"
      );
    }
  };

  // Update quantity
  const updateQuantity = (cartItemId, newQty) => {
    setCartData((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, qty: newQty } : item
      )
    );
    toast.info("Đã cập nhật số lượng");
  };

  // Remove product
  const removeFromCart = (cartItemId) => {
    setCartData((prev) => prev.filter((item) => item.id !== cartItemId));
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  // Increase quantity
  const handleIncrease = (cartItemId) => {
    const currentItem = cartData.find((item) => item.id === cartItemId);
    if (currentItem) {
      updateQuantity(cartItemId, currentItem.qty + 1);
    }
  };

  // Decrease quantity
  const handleDecrease = (cartItemId) => {
    const currentItem = cartData.find((item) => item.id === cartItemId);
    if (currentItem && currentItem.qty > 1) {
      updateQuantity(cartItemId, currentItem.qty - 1);
    }
    if (currentItem && currentItem.qty == 1) {
      const confirmDelete = window.confirm("Bạn có muốn xóa sản phẩm này")
      if(confirmDelete){
setCartData((prev) => prev.filter((item) => item.id !== cartItemId));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      } else{
         toast.info("Sản phẩm vẫn được giữ lại trong giỏ hàng");
      }
      
    }
  };

  // Manual quantity update
  const handleQuantityChange = (cartItemId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity);
    if (!isNaN(parsedQuantity) && parsedQuantity >= 1) {
      updateQuantity(cartItemId, parsedQuantity);
    }
  };

  // Remove product
  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  // Checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <ToastContainer />

      {/* Header */}
      <div className="mb-8 flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Giỏ hàng của bạn
        </h1>
        <span className="ml-3 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
          {cartData.length} sản phẩm
        </span>
      </div>

      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FiShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
          <h2 className="mb-2 text-xl font-semibold text-gray-700">
            Giỏ hàng trống
          </h2>
          <p className="mb-6 text-gray-500">
            Hãy thêm các sản phẩm bạn yêu thích vào giỏ hàng
          </p>
          <Link
            to="/"
            className="flex items-center rounded-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700"
          >
            <FiArrowLeft className="mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Product list */}
          <div className="flex-1">
            <div className="rounded-lg bg-white shadow-md">
              {cartData.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col border-b p-4 last:border-b-0 sm:flex-row sm:items-center"
                >
                  {/* Product image */}
                  <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-24 w-24 rounded-lg object-contain sm:h-32 sm:w-32"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span>{item.color}</span>
                      <span className="mx-1">•</span>
                      <span>{item.storage}</span>
                    </div>
                    <div className="mt-2 text-lg font-bold text-red-600">
                      {item.price.toLocaleString("vi-VN")}₫
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-4 flex items-center">
                      <span className="mr-3 text-sm font-medium">
                        Số lượng:
                      </span>
                      <div className="flex items-center rounded-lg border">
                        <button
                          onClick={() => handleDecrease(item.id)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.qty <= 0}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          className="w-12 border-x py-1 text-center focus:outline-none"
                          min="1"
                        />
                        <button
                          onClick={() => handleIncrease(item.id)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="ml-4 flex items-center text-sm text-red-600 hover:text-red-700"
                      >
                        <RiDeleteBinLine className="mr-1" />
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Total price */}
                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {(item.price * item.qty).toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue shopping */}
            <div className="mt-6">
              <Link
                to="/"
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <FiArrowLeft className="mr-2" />
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Checkout section */}
          <div className="lg:w-96">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Tóm tắt đơn hàng
              </h2>

              {/* Discount code */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <FiTag className="mr-2 text-gray-600" />
                  <label className="font-medium">Mã giảm giá</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 rounded-lg border px-4 py-2 focus:border-red-500 focus:outline-none"
                    placeholder="Nhập mã giảm giá"
                  />
                  <button
                    onClick={applyDiscount}
                    className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
                  >
                    Áp dụng
                  </button>
                </div>
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
                )}
                {appliedDiscount && (
                  <p className="mt-2 text-sm text-green-600">
                    Đã áp dụng mã {appliedDiscount.name} giảm{" "}
                    {appliedDiscount.value * 100}%
                  </p>
                )}
              </div>

              {/* Order summary */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{subTotal.toLocaleString("vi-VN")}₫</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({appliedDiscount.name}):</span>
                    <span>
                      -{" "}
                      {(subTotal * appliedDiscount.value).toLocaleString(
                        "vi-VN"
                      )}
                      ₫
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <div className="flex items-center">
                    <FiTruck className="mr-2 text-gray-600" />
                    <span>Phí vận chuyển:</span>
                  </div>
                  <span>{shipping.toLocaleString("vi-VN")}₫</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">
                    {grandTotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="mt-6 w-full rounded-lg bg-red-600 py-3 text-lg font-medium text-white transition-colors hover:bg-red-700"
              >
                Thanh toán
              </button>

              {/* Security badges */}
              <div className="mt-6 flex justify-center space-x-6">
                <div className="flex flex-col items-center text-center">
                  <img
                    src="../../../public/assets/mone.png"
                    alt="Secure payment"
                    className="h-8 w-8"
                  />
                  <span className="mt-1 text-xs text-gray-600">
                    Thanh toán an toàn
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <img
                    src="../../../public/assets/delivery.png"
                    alt="Free shipping"
                    className="h-8 w-8"
                  />
                  <span className="mt-1 text-xs text-gray-600">
                    Giao hàng miễn phí
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <img
                    src="../../../public/assets/return.png"
                    alt="Return policy"
                    className="h-8 w-8"
                  />
                  <span className="mt-1 text-xs text-gray-600">
                    Đổi trả trong 7 ngày
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
