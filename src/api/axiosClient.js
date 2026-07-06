import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { router } from "./routes";
import { setAccessToken } from "./api/axiosClient";

function App() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Logic khởi tạo App rất đơn giản: Chỉ cần lấy Token từ bộ nhớ lên
    const initApp = () => {
      const customer = localStorage.getItem("customer");

      if (customer) {
        try {
          const parsedCustomer = JSON.parse(customer);
          if (parsedCustomer.token || parsedCustomer.accessToken) {
            // Đẩy token vào memory của axiosClient để tăng tốc độ lấy token
            setAccessToken(parsedCustomer.token || parsedCustomer.accessToken);
          }
        } catch (error) {
          console.error("Lỗi parse dữ liệu customer từ LocalStorage", error);
        }
      }
      
      // Không gọi API /refresh ở đây nữa. Axios Interceptor sẽ lo việc đó khi cần!
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