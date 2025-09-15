import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { useStateContext } from "../../contexts/contextProvider";
import { ToastContainer, toast } from "react-toastify";
// import Axios from "../../Axios"; // Nếu muốn dùng thật thì mở lại

const mockCartAPI = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Camera Canon EOS",
          price: 12000000,
          qty: 2,
          image_url: "https://via.placeholder.com/80",
        },
        {
          id: 2,
          name: "Lens 24-70mm",
          price: 5200000,
          qty: 1,
          image_url: "https://via.placeholder.com/80",
        },
      ]);
    }, 700);
  });

const Cart = () => {
  const { user } = useStateContext();

  const [cartData, setCartData] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([
    { name: "SALE20", value: 0.2, start_date: "2025-01-01", end_date: "2025-12-31" },
    { name: "FALL10", value: 0.1, start_date: "2025-09-01", end_date: "2025-10-01" },
  ]);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(40000);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Lấy dữ liệu cart từ API mô phỏng
  useEffect(() => {
    mockCartAPI().then((data) => setCartData(data));
    // Nếu dùng thật thì dùng Axios hoặc axiosClient.get("/cart")...
  }, []);

  // Hàm tính tổng tiền
  const subTotal = cartData.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Hàm tính tổng sau giảm giá
  const grandTotal = (discount) => Math.max(subTotal - subTotal * discount + shipping, 0);

  // Handle discount codes
  const applyDiscount = () => {
    const today = new Date();
    const found = discountCodes.find((dc) => {
      const start = new Date(dc.start_date);
      const end = new Date(dc.end_date);
      return dc.name === discountCode && today >= start && today <= end;
    });
    if (found) {
      setDiscount(found.value);
      setErrorMessage("");
      toast.success("Discount code applied successfully!");
    } else {
      setDiscount(0);
      setErrorMessage("Invalid or expired discount code");
    }
  };

  // Update quantity
  const updateQuantity = (cartItemId, newQty) => {
    setCartData((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, qty: newQty } : item
      )
    );
    toast.info("Updated quantity");
  };

  // Remove product
  const removeFromCart = (cartItemId) => {
    setCartData((prev) => prev.filter((item) => item.id !== cartItemId));
    toast.success("Removed from cart");
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
    if (user) {
      navigate(`/checkout/${shipping}/${discount}`);
    } else {
      const shouldLogin = window.confirm("Please login to continue");
      if (shouldLogin) {
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <div className="container mx-auto min-h-screen px-2 py-4 sm:px-4 sm:py-8">
      <ToastContainer />
      <h1 className="mb-4 text-center text-2xl font-bold sm:mb-8 sm:text-3xl">
        Shopping Cart
      </h1>

      {cartData.length === 0 ? (
        <div className="text-center">
          <p className="mb-2 text-sm text-gray-600 sm:mb-4 sm:text-base">
            Your cart is empty
          </p>
          <img
            className="mx-auto w-[140px] sm:w-[200px]"
            src="../../asssets/cart_null.jpg"
            alt="Empty cart"
          />
          <Link
            to="/"
            className="mt-2 block text-blue-500 hover:underline sm:mt-4"
          >
            Back to shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Product list */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            {cartData.map((item) => (
              <div
                key={item.id}
                className="xs:flex-row flex flex-row flex-col items-start gap-3 rounded-lg border p-2 sm:p-4 lg:flex-row"
              >
                {/* Ảnh bên trái */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-14 w-14 rounded-lg object-cover sm:h-20 sm:w-20"
                />

                {/* Thông tin sản phẩm và điều khiển số lượng */}
                <div className="flex w-full flex-1 flex-col">
                  {/* Tên + xóa */}
                  <div className="flex flex-row items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold sm:text-lg">{item.name}</h3>
                      <p className="hidden text-xs text-gray-600 sm:text-base lg:block">
                        {item.price.toLocaleString()}₫
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="ml-2 text-xs text-red-600 hover:text-red-700 sm:text-sm"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  </div>

                  {/* Số lượng và giá */}
                  <div className="xs:flex-row mt-2 flex flex-col items-center justify-between gap-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleDecrease(item.id)}
                        className="rounded border px-2 py-1 hover:bg-gray-100 sm:px-3"
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="w-10 rounded border py-1 text-center sm:w-16"
                        min="1"
                      />
                      <button
                        onClick={() => handleIncrease(item.id)}
                        className="rounded border px-2 py-1 hover:bg-gray-100 sm:px-3"
                      >
                        +
                      </button>
                    </div>
                    {/* Giá ở mobile */}
                    <div className="min-w-[60px] text-right text-sm font-semibold sm:text-base lg:hidden">
                      {(item.price * item.qty).toLocaleString()}₫
                    </div>
                  </div>
                  {/* Giá ở màn hình lớn */}
                  <div className="mt-2 hidden min-w-[120px] text-right lg:block">
                    <p className="font-semibold">{(item.price * item.qty).toLocaleString()}₫</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout section */}
          <div className="sticky top-8 mt-4 h-fit rounded-lg border-2 bg-gray-50 p-3 sm:p-6 lg:mt-0">
            <div className="mb-5 sm:mb-6">
              <h2 className="mb-2 text-lg font-bold sm:mb-4 sm:text-xl">Order Summary</h2>
              <div className="mb-3 sm:mb-4">
                <label className="mb-1 block text-xs font-medium sm:mb-2 sm:text-sm">
                  Discount code (if any)
                </label>
                <div className="flex gap-1 sm:gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 rounded border px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-base"
                    placeholder="Enter discount code"
                  />
                  <button
                    onClick={applyDiscount}
                    className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 sm:px-4 sm:py-2 sm:text-base"
                  >
                    Apply
                  </button>
                </div>
                {errorMessage && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">{errorMessage}</p>
                )}
              </div>

              <div className="space-y-1 text-xs sm:space-y-3 sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{subTotal.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>{(subTotal * discount).toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping fee:</span>
                  <span>{shipping.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold sm:pt-3">
                  <span>Total:</span>
                  <span className="text-base text-red-500 sm:text-xl">
                    {grandTotal(discount).toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full rounded-lg bg-red-700 py-2 text-base text-white transition-colors hover:bg-red-800 sm:py-3"
            >
              Checkout
            </button>

            <Link
              to="/"
              className="mt-3 block text-center text-xs text-blue-500 hover:underline sm:mt-4 sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;