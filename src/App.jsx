import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { router } from "./routes";
import { setAccessToken } from "./api/axiosClient";
import { loginSuccess } from "./features/authSlice/authSlice"; 

function App() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = () => {
      // 1. Chỉ đọc dữ liệu từ LocalStorage
      const customerStr = localStorage.getItem("customer");

      if (customerStr) {
        try {
          const parsedCustomer = JSON.parse(customerStr);
          
          // 2. Nạp token vào bộ nhớ của Axios để gọi các API khác
          if (parsedCustomer.token || parsedCustomer.accessToken) {
            setAccessToken(parsedCustomer.token || parsedCustomer.accessToken);
          }
          
          // 3. CHỐT CHẶN: Phục hồi State cho Redux ngay lập tức để không bị văng ra Login
          dispatch(loginSuccess(parsedCustomer)); 
          
        } catch (error) {
          console.error("Lỗi parse dữ liệu customer", error);
        }
      }
      
      // Không gọi axios.post('/user/refresh') ở đây! 
      // Việc lấy lại token (nếu thực sự hết hạn) đã có interceptor ở axiosClient.js lo liệu.
      setIsReady(true);
    };

    initApp();
  }, [dispatch]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
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