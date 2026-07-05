import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { router } from "./routes";
import { setAccessToken, clearAccessToken } from "./api/axiosClient";
import { clearAuth } from "./features/authSlice/authSlice";
import axios from "axios"; // Import axios gốc

function App() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // 1. Kiểm tra xem user có dấu hiệu đã đăng nhập không
      const customer = localStorage.getItem("customer");

      // Nếu là khách vãng lai, không cần gọi API refresh, cho web chạy luôn
      if (!customer) {
        setIsReady(true);
        return;
      }

      // 2. Nếu có customer, tiến hành lấy lại token
      try {
        // Sử dụng axios gốc (bypass interceptor) để gọi refresh token
        const baseURL =
          import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";
        const { data } = await axios.post(
          `${baseURL}/user/refresh`,
          {},
          { withCredentials: true },
        );

        if (data?.accessToken || data?.token) {
          setAccessToken(data.accessToken || data.token);
        }
      } catch (error) {
        console.error(" LỖI TẠI APP.JSX KHÔNG LẤY ĐƯỢC TOKEN:", error);
        // Lỗi refresh (hết hạn hoặc token sai) -> Xóa toàn bộ phiên
        clearAccessToken();
        dispatch(clearAuth());

        // Chuyển hướng nếu đang không ở trang public
        // const isPublicPage = window.location.pathname.includes('/login') ||
        //                      window.location.pathname.includes('/register');
        // if (!isPublicPage) {
        //   console.log("👉 Đang redirect về /login từ App.jsx")
        //   window.location.href = "/login";
        // }
      } finally {
        setIsReady(true);
      }
    }
  }, [dispatch]);

  if (!isReady) {
    // Có thể thay bằng một Component Spinner đẹp mắt hơn
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;