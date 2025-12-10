import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice/authSlice";
import { getCart } from "../../features/guestSlice/cart/cartSlice";

// Icons
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiLogOut,
  FiPhoneCall,
  FiMapPin,
  FiPackage,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSettings,
  FiHeart,
  FiFilter,
  FiSmartphone,
  FiDollarSign,
  FiBattery,
  FiCamera,
  FiCpu,
  FiChevronRight,
} from "react-icons/fi";

import { FaMicrochip } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { MdFlipCameraAndroid } from "react-icons/md";
import { ImBlogger } from "react-icons/im";

const phoneMenuData = [
  {
    title: "Thương hiệu",
    icon: <FiSmartphone />,
    items: [
      { name: "iPhone", link: "/products?brand=apple" },
      { name: "Samsung", link: "/products?brand=samsung" },
      { name: "Xiaomi", link: "/products?brand=xiaomi" },
      { name: "OPPO", link: "/products?brand=oppo" },
      { name: "Realme", link: "/products?brand=realme" },
    ],
  },
  {
    title: "Mức giá",
    icon: <FiDollarSign />,
    items: [
      { name: "Dưới 5 triệu", link: "/products?price_lte=5000000" },
      {
        name: "Từ 5 - 7 triệu",
        link: "/products?price_gte=5000000&price_lte=7000000",
      },
      {
        name: "Từ 7 - 10 triệu",
        link: "/products?price_gte=7000000&price_lte=10000000",
      },
      {
        name: "Từ 10 - 15 triệu",
        link: "/products?price_gte=10000000&price_lte=15000000",
      },
      { name: "Trên 15 triệu", link: "/products?price_gte=15000000" },
    ],
  },
  {
    title: "Nhu cầu",
    icon: <FiFilter />,
    items: [
      { name: "Chơi game", icon: <FiCpu />, link: "/products?tag=gaming" },
      { name: "Pin khủng", icon: <FiBattery />, link: "/products?tag=battery" },
      {
        name: "Chụp ảnh đẹp",
        icon: <FiCamera />,
        link: "/products?tag=camera",
      },
      {
        name: "Gập / Trượt",
        icon: <MdFlipCameraAndroid />,
        link: "/products?tag=foldable",
      },
      { name: "Cấu hình AI", icon: <FaMicrochip />, link: "/products?tag=ai" },
    ],
  },
];
  
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loaction = useLocation();
  const menuRef = useRef();

  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  const {cart} = useSelector((state) => state.cart);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScroll, setIsScroll] = useState(false);

   // Fetch Cart on Mount
    useEffect(() => {
      dispatch(getCart());
    }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const val = query.trim();
    if (!val) return;
    setQuery("");
    navigate(`/product-search?q=${encodeURIComponent(val)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const HeaderItem = ({
    icon: Icon,
    label,
    subLabel,
    to,
    badge,
    onClick,
    className,
  }) => (
    <Link
      to={to || "#"}
      onClick={onClick}
      className={`flex flex-col items-center justify-center text-white hover:bg-white/10 p-2 rounded-lg transition-colors min-w-[60px] ${className}`}
    >
      <div className="relative">
        <Icon className="h-6 w-6 mb-1" />
        {badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-red-600">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium leading-tight text-center">
        {label} <br /> {subLabel}
      </span>
    </Link>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <>
      <ToastContainer />
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScroll ? "shadow-lg py-1" : "py-2"
        } bg-[#d70018]`}
      >
        <div className="max-w-[1200px] mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Link to="/" className="flex-shrink-0 mr-2">
              <div className="text-white font-black text-2xl tracking-tighter italic">
                Nest
                <span className="text-sm not-italic font-normal">Store</span>
              </div>
            </Link>

            <div ref={categoryRef} className="relative group">
              <div
                className={`hidden lg:flex items-center bg-[#ffffff33] hover:bg-[#ffffff4d] rounded-lg px-2 py-2 cursor-pointer transition-colors text-white gap-2 flex-shrink-0 ${
                  isCategoryOpen ? "bg-[#ffffff4d]" : ""
                }`}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <LuClipboardList className="h-6 w-6" />
                <div className="text-xs font-medium leading-tight">
                  Danh mục
                </div>
              </div>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-3 p-4 gap-6">
                    {phoneMenuData.map((section, idx) => (
                      <div key={idx}>
                        {/* Tiêu đề cột */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                          <span className="text-[#d70018]">{section.icon}</span>
                          <h4 className="font-bold text-gray-800 text-sm uppercase">
                            {section.title}
                          </h4>
                        </div>

                        {/* List items */}
                        <ul className="space-y-2">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link
                                to={item.link}
                                className="block text-sm text-gray-600 hover:text-[#d70018] hover:translate-x-1 transition-all"
                                onClick={() => setIsCategoryOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                    <Link
                      to="/products"
                      className="text-xs font-medium text-blue-600 hover:underline flex items-center justify-center gap-1"
                    >
                      Xem tất cả điện thoại <FiChevronRight />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden xl:flex items-center gap-2 text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer flex-shrink-0">
              <FiMapPin className="h-5 w-5" />
              <div className="text-[11px] leading-tight">
                Xem giá tại <br />{" "}
                <span className="font-bold text-yellow-300">Hà Nội</span>{" "}
                <FiChevronDown className="inline h-3 w-3" />
              </div>
            </div>

            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bạn cần tìm gì?"
                  className="w-full h-10 pl-4 pr-10 rounded-lg text-sm text-gray-700 outline-none shadow-sm focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500 hover:text-[#d70018]"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden xl:block">
                <HeaderItem
                  icon={FiPhoneCall}
                  label="Gọi mua hàng"
                  subLabel="1800.2097"
                />
              </div>

              <div className="hidden lg:block">
                <HeaderItem icon={ImBlogger} label="Blogs" to="/blogs" />
              </div>

              <div className="hidden md:block">
                <HeaderItem
                  icon={FiPackage}
                  label="Tra cứu"
                  subLabel="đơn hàng"
                  to="/orders"
                />
              </div>

              <HeaderItem
                icon={FiShoppingCart}
                label="Giỏ"
                subLabel="hàng"
                to="/cart"
                badge={cart?.products?.length || 0}
              />

              {/* User / Login */}
              {user ? (
                <div className="relative" ref={menuRef}>
                  <div
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex flex-col items-center justify-center text-white hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer min-w-[60px]"
                  >
                    <FiUser className="h-6 w-6 mb-1" />
                    <span className="text-[10px] sm:text-[11px] font-medium text-center truncate max-w-[70px]">
                      {user.lastname || user.fullName || "Member"}
                    </span>
                  </div>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden text-gray-800 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <p className="font-bold text-[#d70018] truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-100"
                          >
                            <FiSettings className="mr-3 text-gray-500" /> Quản
                            trị website
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-100"
                        >
                          <FiUser className="mr-3 text-gray-500" /> Thông tin
                          tài khoản
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-100"
                        >
                          <FiHeart className="mr-3 text-gray-500" /> Sản phẩm
                          yêu thích
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-100"
                        >
                          <FiPackage className="mr-3 text-gray-500" /> Lịch sử
                          đơn hàng
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          <FiLogOut /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <HeaderItem
                  icon={FiUser}
                  label="Đăng"
                  subLabel="nhập"
                  to="/login"
                />
              )}
            </div>
          </div>
        </div>

        {/* <div className="lg:hidden overflow-x-auto whitespace-nowrap px-4 py-2 bg-[#b80015] text-white text-xs scrollbar-hide flex gap-4">
          <Link
            to="/products"
            className="opacity-90 hover:opacity-100 hover:underline"
          >
            Điện thoại
          </Link>
          <Link
            to="/products"
            className="opacity-90 hover:opacity-100 hover:underline"
          >
            Laptop
          </Link>
          <Link
            to="/products"
            className="opacity-90 hover:opacity-100 hover:underline"
          >
            Tai nghe
          </Link>
          <Link
            to="/products"
            className="opacity-90 hover:opacity-100 hover:underline"
          >
            Đồng hồ
          </Link>
          <Link
            to="/products"
            className="opacity-90 hover:opacity-100 hover:underline"
          >
            Phụ kiện
          </Link>
        </div> */}
      </header>
    </>
  );
};

export default Header;
