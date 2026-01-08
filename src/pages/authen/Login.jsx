import React, { useState, useEffect } from "react";
import { EyeOff, Eye, Mail, Lock } from "lucide-react";
import Axios from "../../Axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login as loginThunk } from "../../features/authSlice/authSlice";
import "../../App.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";
  //  LOGIN GOOGLE
  const handleGoogleLogin = () => {
    window.open(`${baseURL}/user/auth/google`, "_self");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: "" }));
    }
  };

  // Basic validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { email: formData.email, password: formData.password };
    dispatch(loginThunk(payload));
  };

  useEffect(() => {
    if (isSuccess && user) {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      navigate("/");
    }
  }, [isSuccess, user, navigate]);

  useEffect(() => {
    if (isError) {
      setErrors((prev) => ({ ...prev, submit: message }));
    }
  }, [isError, message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Brand info */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chào mừng đến với <span className="text-red-600">Nest Store</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Đăng nhập tài khoản để trải nghiệm mua sắm tốt nhất với những ưu
              đãi độc quyền
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">🚚</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Giao hàng miễn phí
                </h3>
                <p className="text-sm text-gray-600">
                  Cho đơn hàng từ 500.000₫
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">🎁</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Ưu đãi thành viên
                </h3>
                <p className="text-sm text-gray-600">Giảm giá lên đến 20%</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Bảo mật thông tin
                </h3>
                <p className="text-sm text-gray-600">Cam kết bảo vệ dữ liệu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Login form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Đăng Nhập</h2>
            <p className="text-gray-600 mt-2">Đăng nhập để bắt đầu mua sắm</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="email@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            {/* Submit error */}
            {errors.submit && (
              <p className="mt-4 text-center text-sm text-red-600">
                {errors.submit}
              </p>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                isLoading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">
                Hoặc
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors bg-white"
            >
              {/* Google Icon SVG */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Đăng nhập bằng Google
            </button>

            {/* Extra actions */}
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <Link to="/register" className="hover:text-red-600">
                Chưa có tài khoản? Đăng ký
              </Link>
              <Link to="/forgot-password" className="hover:text-red-600">
                Quên mật khẩu?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
