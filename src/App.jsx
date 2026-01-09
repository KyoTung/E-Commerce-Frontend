import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { router } from "./routes";
import { loginSuccess } from "./features/authSlice/authSlice";

function App() {
  const dispatch = useDispatch();



  useEffect(() => {
    // Logic: Kiểm tra xem trong kho có User không?
    const customer = localStorage.getItem("customer");
    const token = localStorage.getItem("token");

    if (customer && token) {
      try {
        const userData = JSON.parse(customer);
        // Nạp lại vào Redux để app biết là "Đã đăng nhập"
        dispatch(loginSuccess(userData)); 
      } catch (error) {
        console.error("Lỗi parse JSON user:", error);
        localStorage.removeItem("customer");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    }
  }, [dispatch]);

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;