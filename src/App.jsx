import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { router } from "./routes";
import axiosClient, { setAccessToken } from "./api/axiosClient";
import { logout } from "./features/authSlice/authSlice"; 

function App() {
  const dispatch = useDispatch();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const { data } = await axiosClient.post("/user/refresh");
        if (data?.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        setIsReady(true);
      }
    };

    initApp();
  }, [dispatch]);


  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
