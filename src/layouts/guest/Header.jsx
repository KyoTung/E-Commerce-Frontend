import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../../contexts/contextProvider";
import { useState, useEffect, useRef, useContext } from "react";
import { FiShoppingCart, FiUser, FiSearch, FiX } from "react-icons/fi";
import "../../App.css";
import { FaAngleDown } from "react-icons/fa6";

const Header = () => {
  const { user, token, setToken, setUser } = useStateContext();
  const [query, setQuery] = useState("");
  const inputRef = useRef();
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
  return (
    <>
      <header className="header_bg_color sticky top-0 z-50 shadow-md">
        <ToastContainer />
        {/* Top Navigation */}
        <div className="py-2 text-white shadow-sm">
          <nav className="container relative mx-auto flex flex-wrap items-center justify-between px-4 md:flex-row md:px-1">
            <ul className="flex gap-4">
              <li className="hover:text-gray-300">
                <Link to="/" className="rounded-md  text-sm font-medium">
                  Trang chủ
                </Link>
              </li>
              <li className="dropdown flex items-center gap-1 cursor-pointer hover:text-gray-300">
                <Link to="/" className="rounded-md  text-sm font-medium">
                  Danh mục
                </Link>
                <FaAngleDown/>
              </li>

              <li className="hover:text-gray-300">
                <Link to="#contact" className="rounded-md  text-sm font-medium">
                  Kết nối
                </Link>
              </li>
              <li className="hover:text-gray-300">
                <Link to="#about" className="rounded-md  text-sm font-medium">
                  Về chúng tôi
                </Link>
              </li>
               <li className="hover:text-gray-300">
                <Link to="#blog" className="rounded-md  text-sm font-medium">
                  Blogs
                </Link>
              </li>
            </ul>

            {/* User Section */}
            <div className="flex items-center">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center"
                    aria-label="User menu"
                  >
                    <FiUser className="h-6 w-6" />
                    <span className="ml-2">{user.name}</span>
                  </button>

                  {isMenuOpen && (
                    <div
                      ref={modalRef}
                      className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAccountModal(true);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Thông tin tài khoản
                      </Link>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAccountModal(true);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Danh sách yêu thích
                      </Link>
                      <Link
                        to={`/order-history/${user.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Lịch sử đơn hàng
                      </Link>
                      {(user.role === 1 || user.role === 2) && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Truy cập trang quản trị
                        </Link>
                      )}
                      <div className="mt-2 border-t">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <FiUser className="mr-2 h-4 w-4" />
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
                    className="rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Đăng ký
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Main Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex items-center justify-between px-2 py-4 md:py-2">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-white">
              Nest Store
            </Link>
            <form
              onSubmit={handleSearch}
              className="relative mx-4 max-w-full flex-1 sm:mx-6 md:mx-8 md:max-w-xl"
              autoComplete="off"
            >
              <div className="relative flex justify-center items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-5 pr-10 text-black focus:outline-none text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="absolute right-2 sm:right-3 rounded bg-red-600 px-3 py-2 hover:bg-red-700"
                  aria-label="Search"
                >
                  <FiSearch className="text-white" />
                </button>
                {query && (
                  <button
                    type="button"
                    className="absolute right-12 sm:right-16 top-2 p-1 text-gray-400 hover:text-red-600"
                    onClick={handleClearInput}
                    aria-label="Xóa"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>
            {/* Cart */}
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="relative">
                <FiShoppingCart className="h-6 w-6 text-white" />

                <span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-xs text-red-600">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
