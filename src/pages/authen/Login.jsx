
import React, { useState, useEffect } from "react";
import { EyeOff, Eye, Mail, Lock } from "lucide-react";
import Axios from "../../Axios"; 
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login as loginThunk } from "../../features/authSlice/authSlice";
import "../../App.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // Handle input change + clear field error
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

  console.log("message:", message);

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
              Đăng nhập tài khoản để trải nghiệm mua sắm tốt nhất với những ưu đãi
              độc quyền
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">🚚</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Giao hàng miễn phí</h3>
                <p className="text-sm text-gray-600">Cho đơn hàng từ 500.000₫</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">🎁</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ưu đãi thành viên</h3>
                <p className="text-sm text-gray-600">Giảm giá lên đến 20%</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bảo mật thông tin</h3>
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                isLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Submit error */}
            {errors.submit && (
              <p className="mt-4 text-center text-sm text-red-600">{errors.submit}</p>
            )}

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

export default LoginForm;
