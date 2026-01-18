import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Import Hook Form
import { useDispatch, useSelector } from "react-redux"; // Import Redux
import { Link, useNavigate } from "react-router-dom";
import { EyeOff, Eye, User, Mail, Lock, Phone, MapPin } from "lucide-react"; // Dùng Phone thay Smartphone cho ngắn
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Action
import { register as registerUser, resetState } from "../../features/authSlice/authSlice";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- REDUX STATE ---
  const { isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.auth
  );

  // --- LOCAL STATE (Cho UI) ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- REACT HOOK FORM ---
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  
  const password = watch("password");

  
  useEffect(() => {
    if (isSuccess) {
      
      setTimeout(() => {
        navigate("/login"); 
      }, 1000);
    }

    if (isError) {
      
    }

    // Reset state khi rời trang để tránh lỗi cũ hiện lại
    return () => {
      dispatch(resetState());
    };
  }, [isSuccess, isError, message, navigate, dispatch]);

  // --- SUBMIT ---
  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center py-8 px-4">
      <ToastContainer />
      
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- LEFT SIDE: BRAND INFO (Giữ nguyên UI cũ) --- */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chào mừng đến với <span className="text-red-600">Nest Store</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Đăng ký tài khoản để trải nghiệm mua sắm tốt nhất với những ưu đãi độc quyền
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

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Đăng Ký Tài Khoản</h2>
            <p className="text-gray-600 mt-2">Tạo tài khoản để bắt đầu mua sắm</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  {...register("email", { 
                    required: "Vui lòng nhập email",
                    pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

          
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { 
                    required: "Vui lòng nhập mật khẩu",
                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                  })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", { 
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: value => value === password || "Mật khẩu xác nhận không khớp"
                  })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                "Đăng Ký"
              )}
            </button>

            {/* Error Message from Backend (Hiển thị nếu có lỗi chung) */}
            {isError && !errors.name && !errors.email && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{message || "Đăng ký thất bại"}</p>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-red-600 font-semibold hover:text-red-700 transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Bằng việc đăng ký, bạn đã đồng ý với{" "}
              <a href="#" className="text-red-600 hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" className="text-red-600 hover:underline">
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;