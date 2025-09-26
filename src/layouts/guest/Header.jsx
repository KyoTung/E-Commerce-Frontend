import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiShoppingCart, FiUser, FiSearch, FiX, FiLogOut } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { useStateContext } from "../../contexts/contextProvider";
import Axios from "../../Axios"

const Header = () => {
 const { user, token, setToken, setUser } = useStateContext();
 const [userInfo, setUserInfor] = useState({
  fullName:"",
  email:"",
  address:"",
  phone:""
 })
  const [query, setQuery] = useState("");
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const inputRef = useRef();
  const menuRef = useRef();
  const modalRef = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUser = async () => {
        try {
            const respon = await Axios.get(
                `user/${user}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUserInfor(respon.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    if (token) fetchUser();
}, [setUserInfor, token]);


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

  const handleLogout = async() => {
    try{
       await Axios.get("/user/logout", 
       {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
       )
       setToken("");
       setUser("");
      toast.success("Đăng xuất thành công");
    }
    catch(error){
       toast.error("Đăng xuất thất bại");
    }

   
    setIsMenuOpen(false);
  };

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
      <header className={`sticky top-0 z-50 shadow-md transition-all duration-300 ${isScroll ? 'bg-[#d0011b]' : 'bg-[#d0011b]/90'}`}>
        <ToastContainer />
        
        {/* Top Navigation */}
        <div className="py-2 text-white shadow-sm hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center">
            {/* Left-aligned menu */}
            <ul className="flex gap-6">
              <li className="hover:text-gray-300 transition-colors">
                <Link to="/" className="text-sm font-medium">
                  Trang chủ
                </Link>
              </li>
              <li className="hover:text-gray-300 transition-colors">
                <Link to="#contact" className="text-sm font-medium">
                  Kết nối
                </Link>
              </li>
              <li className="hover:text-gray-300 transition-colors">
                <Link to="#about" className="text-sm font-medium">
                  Về chúng tôi
                </Link>
              </li>
              <li className="hover:text-gray-300 transition-colors">
                <Link to="#blog" className="text-sm font-medium">
                  Blogs
                </Link>
              </li>
            </ul>

            {/* Right-aligned user section */}
            <div className="flex items-center">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-1"
                  >
                    <FiUser className="h-5 w-5" />
                    <span className="ml-1">{userInfo.fullName}</span>
                    <FaAngleDown className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMenuOpen && (
                    <div
                      ref={modalRef}
                      className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tài khoản
                      </Link>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Danh sách yêu thích
                      </Link>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Lịch sử đơn hàng
                      </Link>
                      <div className="mt-2 border-t">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <FiLogOut className="mr-2 h-4 w-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    to="/register"
                    className="rounded-md px-3 py-1.5 text-sm font-medium bg-white text-[#d0011b] hover:bg-gray-100 transition-colors"
                  >
                    Đăng ký
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-md px-3 py-1.5 text-sm font-medium bg-white text-[#d0011b] hover:bg-gray-100 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button 
                className="md:hidden mr-3 text-white"
                onClick={() => setIsOpenMenu(!isOpenMenu)}
              >
                <TiThMenu className="w-6 h-6" />
              </button>
              <Link to="/" className="text-xl font-bold text-white">
                Nest Store
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <form
              onSubmit={handleSearch}
              className="hidden md:block relative mx-4 max-w-full flex-1 md:max-w-xl"
              autoComplete="off"
            >
              <div className="relative flex justify-center items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-10 text-black focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded bg-[#d0011b] p-1.5 hover:bg-[#b00117] transition-colors"
                  aria-label="Search"
                >
                  <FiSearch className="text-white h-4 w-4" />
                </button>
                {query && (
                  <button
                    type="button"
                    className="absolute right-10 top-2 p-1 text-gray-400 hover:text-red-600"
                    onClick={handleClearInput}
                    aria-label="Xóa"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Cart and Mobile Search */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Button */}
              
              
              {/* Cart */}
              <Link to="/cart" className="relative text-white">
                <FiShoppingCart className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 rounded-full bg-white px-1.5 py-0.5 text-xs text-[#d0011b] font-bold">
                  5
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Visible only on mobile when active */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative" autoComplete="off">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-black focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 text-gray-500"
              aria-label="Search"
            >
              <FiSearch className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden ${isOpenMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-5 border-b">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-[#d0011b]">Menu</span>
              <button onClick={() => setIsOpenMenu(false)} className="text-gray-500">
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-5">
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-800 font-medium" onClick={() => setIsOpenMenu(false)}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="#contact" className="text-gray-800 font-medium" onClick={() => setIsOpenMenu(false)}>
                  Kết nối
                </Link>
              </li>
              <li>
                <Link to="#about" className="text-gray-800 font-medium" onClick={() => setIsOpenMenu(false)}>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="#blog" className="text-gray-800 font-medium" onClick={() => setIsOpenMenu(false)}>
                  Blogs
                </Link>
              </li>
            </ul>
            
            <div className="mt-8 pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center mb-4">
                    <FiUser className="h-5 w-5 text-[#d0011b] mr-2" />
                    <span className="font-medium">Xin chào, User</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-red-600"
                  >
                    <FiLogOut className="h-5 w-5 mr-2" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="rounded-md px-4 py-2 text-center font-medium bg-[#d0011b] text-white"
                    onClick={() => setIsOpenMenu(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md px-4 py-2 text-center font-medium border border-[#d0011b] text-[#d0011b]"
                    onClick={() => setIsOpenMenu(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isOpenMenu && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpenMenu(false)}
          ></div>
        )}
      </header>
    </>
  );
};

export default Header;