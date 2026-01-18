import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { loginSuccess } from "../../features/authSlice/authSlice";


const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Lấy dữ liệu từ URL
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const refreshToken = searchParams.get("refreshToken");

    // 2. Kiểm tra Access Token
    if (token) {
      // Xử lý tên: Nếu name null thì để chuỗi rỗng, tránh lỗi decodeURIComponent
      const decodedName = name ? decodeURIComponent(name) : "";

      // 3. Tạo object user khớp HOÀN TOÀN với cấu trúc khi login thường
      // (Để Redux authSlice đọc được mà không bị lỗi undefined)
      const userData = {
        _id: id,
        fullName: decodedName, // Map 'name' từ URL thành 'fullName' trong state
        email: email,
        role: role,
        token: token, // Access Token dùng để gọi API
      };

      dispatch(loginSuccess(userData));

      // 3. 🔥 QUAN TRỌNG: Xóa sạch dấu vết trên URL (Bảo mật)
      window.history.replaceState(null, '', window.location.pathname);

      // 4. Lưu vào LocalStorage
      // Lưu ý: Không cần lưu RefreshToken vì nó đã nằm an toàn trong Cookie của trình duyệt
      localStorage.setItem("customer", JSON.stringify(userData));
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // 5. Chuyển hướng và Reload
      setTimeout(() => {
        navigate("/");
        // Reload là cách an toàn nhất để:
        // - Redux load lại state từ localStorage (authSlice)
        // - Axios interceptor cập nhật header Authorization mới
        window.location.reload();
      }, 100);
    } else {
      // Trường hợp lỗi hoặc user cố tình truy cập link này mà không có token
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Hiệu ứng loading xoay vòng */}
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">
        Đang đăng nhập Google...
      </h2>
      <p className="text-gray-500 text-sm mt-2">Vui lòng đợi trong giây lát</p>
    </div>
  );
};

export default LoginSuccess;
