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
      const customerStr = localStorage.getItem("customer");

      if (customerStr) {
        try {
          const parsedCustomer = JSON.parse(customerStr);
          if (parsedCustomer.token || parsedCustomer.accessToken) {
            setAccessToken(parsedCustomer.token || parsedCustomer.accessToken);
          }
          // Nạp lại dữ liệu cho Redux để giữ phiên đăng nhập
          dispatch(loginSuccess(parsedCustomer));
        } catch (error) {
          console.error("Lỗi parse dữ liệu customer", error);
        }
      }
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