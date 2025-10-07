import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiX,
  FiLogOut,
  FiHeart,
  FiPackage,
  FiSettings,
} from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { useSelector, useDispatch } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { logout } from "../../features/authSlice/authSlice"

const Header = () => {
  const dispatch = useDispatch();
  const { user, isError,isLoading, isSuccess, message } = useSelector(state => state.auth);
  const getUserFromUserSlice = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => !!state.auth.user?.token);
  const [userInfo, setUserInfor] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
  });
  const [query, setQuery] = useState("");
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const inputRef = useRef();
  const menuRef = useRef();
  const modalRef = useRef();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const val = query.trim();
    if (!val) return;
    setQuery("");
    navigate(`/product-search?q=${encodeURIComponent(val)}`);
  };

  const handleClearInput = () => {
    setQuery("");
  };

  const handleLogout = async () => {
    dispatch(logout({token: user.token}));

    if (isSuccess) {
      toast.success("Đăng xuất thành công");
      navigate("/");
    }
    setIsMenuOpen(false);
  };
  useEffect(() => {
    if (isError) {
      toast.error(message || "Đã có lỗi xảy ra");
    }
  }, [isError, message]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 shadow-md transition-all duration-300 ${
          isScroll ? "bg-[#d0011b]" : "bg-[#d0011b]/95"
        }`}
      >
        <ToastContainer />

        {/* Top Navigation */}
        <div className="py-2 text-white shadow-sm hidden lg:block">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            {/* Left-aligned menu */}
            <ul className="flex gap-8">
              <li className="hover:text-gray-200 transition-colors">
                <Link to="/" className="text-sm font-medium">
                  Trang chủ
                </Link>
              </li>
              <li className="hover:text-gray-200 transition-colors">
                <Link to="/contact" className="text-sm font-medium">
                  Liên hệ
                </Link>
              </li>
              <li className="hover:text-gray-200 transition-colors">
                <Link to="/about" className="text-sm font-medium">
                  Về chúng tôi
                </Link>
              </li>
              <li className="hover:text-gray-200 transition-colors">
                <Link to="/blog" className="text-sm font-medium">
                  Tin tức
                </Link>
              </li>
            </ul>

            {/* Right-aligned user section */}
            <div className="flex items-center">
              {isLoggedIn && getUserFromUserSlice ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaRegUserCircle className="h-7 w-7" />
                    <span className="ml-1 max-w-32 truncate">
                      {getUserFromUserSlice?.fullName || "Tài khoản"}
                    </span>
                    <FaAngleDown
                      className={`transition-transform ${
                        isMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMenuOpen && (
                    <div
                      ref={modalRef}
                      className="absolute right-0 z-10 mt-2 w-56 rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 border border-gray-200"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getUserFromUserSlice?.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {getUserFromUserSlice?.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiUser className="mr-3 h-4 w-4" />
                        Thông tin tài khoản
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiHeart className="mr-3 h-4 w-4" />
                        Sản phẩm yêu thích
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiPackage className="mr-3 h-4 w-4" />
                        Đơn hàng của tôi
                      </Link>

                      {getUserFromUserSlice?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-2"
                        >
                          <FiSettings className="mr-3 h-4 w-4" />
                          Trang quản trị
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="mr-3 h-4 w-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/register"
                    className="rounded-lg px-4 py-2 text-sm font-medium bg-white text-[#d0011b] hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    Đăng ký
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-lg px-4 py-2 text-sm font-medium bg-white text-[#d0011b] hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center space-x-8">
              <button
                className="lg:hidden mr-2 text-white"
                onClick={() => setIsOpenMenu(!isOpenMenu)}
              >
                <TiThMenu className="w-6 h-6" />
              </button>
              <Link
                to="/"
                className="text-2xl font-bold text-white hover:text-gray-200 transition-colors"
              >
                Nest Store
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:block relative flex-1 max-w-2xl mx-8"
              autoComplete="off"
            >
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border-0 py-3 pl-6 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded-lg bg-[#d0011b] p-2 hover:bg-[#b00117] transition-colors"
                  aria-label="Search"
                >
                  <FiSearch className="text-white h-5 w-5" />
                </button>
                {query && (
                  <button
                    type="button"
                    className="absolute right-12 p-2 text-gray-400 hover:text-red-600 transition-colors"
                    onClick={handleClearInput}
                    aria-label="Xóa"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Right Section - Cart and User */}
            <div className="flex items-center space-x-6">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center space-x-2 text-white hover:text-gray-200 transition-colors group"
              >
                <div className="relative">
                  <FiShoppingCart className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-[#d0011b] min-w-[20px] text-center">
                    5
                  </span>
                </div>
                <span className="hidden xl:block text-sm font-medium">
                  Giỏ hàng
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="relative" autoComplete="off">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mobile-search-input w-full rounded-xl border-0 py-3 pl-4 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-3 text-gray-500"
              aria-label="Search"
            >
              <FiSearch className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 lg:hidden ${
            isOpenMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-[#d0011b]">Menu</span>
              <button
                onClick={() => setIsOpenMenu(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoggedIn && getUserFromUserSlice ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaRegUserCircle className="h-8 w-8 text-[#d0011b] mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {getUserFromUserSlice?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getUserFromUserSlice?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center text-red-600 border border-red-600 rounded-lg py-2 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="mb-6 flex space-x-3">
                <Link
                  to="/login"
                  className="flex-1 text-center rounded-lg px-4 py-3 font-medium bg-[#d0011b] text-white hover:bg-[#b00117] transition-colors"
                  onClick={() => setIsOpenMenu(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center rounded-lg px-4 py-3 font-medium border border-[#d0011b] text-[#d0011b] hover:bg-red-50 transition-colors"
                  onClick={() => setIsOpenMenu(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}

            <ul className="space-y-1">
              {[
                { name: "Trang chủ", path: "/" },
                { name: "Sản phẩm", path: "/products" },
                { name: "Tin tức", path: "/blog" },
                { name: "Về chúng tôi", path: "/about" },
                { name: "Liên hệ", path: "/contact" },
                { name: "Giỏ hàng", path: "/cart" },
                { name: "Yêu thích", path: "/wishlist" },
                { name: "Đơn hàng", path: "/orders" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsOpenMenu(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isOpenMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpenMenu(false)}
          ></div>
        )}
      </header>
    </>
  );
};

export default Header;
