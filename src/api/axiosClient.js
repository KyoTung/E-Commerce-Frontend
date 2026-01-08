import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- HELPER FUNCTIONS ---
let store = null;
export const injectStore = (_store) => { store = _store; };

export const getAccessToken = () => {
  return localStorage.getItem("token") || 
         (localStorage.getItem("customer") ? JSON.parse(localStorage.getItem("customer")).token : null);
};

export const setAccessToken = (token) => {
  // Cập nhật state customer
  const customer = localStorage.getItem("customer");
  if (customer) {
    const parsed = JSON.parse(customer);
    parsed.token = token;
    localStorage.setItem("customer", JSON.stringify(parsed));
  }
  // Cập nhật token lẻ
  localStorage.setItem("token", token);
};

export const clearAccessToken = () => {
  localStorage.removeItem("customer");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken"); 
  if (store) store.dispatch({ type: "auth/reset" });
};

// --- REQUEST INTERCEPTOR (Giữ nguyên) ---
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR (LOGIC MỚI ĐỒNG NHẤT) ---
// Queue xử lý request đợi refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Chỉ bắt lỗi 401 (Unauthorized)
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 2. Chặn Loop: Nếu chính API refresh bị lỗi -> Logout ngay
    if (originalRequest.url.includes("/user/refresh-token")) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 3. Nếu không có token từ đầu -> Không cứu
    if (!getAccessToken()) {
        return Promise.reject(error);
    }

    // 4. Nếu đã retry rồi mà vẫn lỗi -> Không cứu
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // 5. Logic hàng đợi (Queue) nếu đang có tiến trình refresh chạy
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ✅ LOGIC ĐỒNG NHẤT: LUÔN LẤY TỪ LOCAL STORAGE
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token in storage");
      }

      // Gọi API (Backend phải chấp nhận req.body.refreshToken)
      const response = await axios.post(`${baseURL}/user/refresh-token`, {
        refreshToken: refreshToken 
      });

      const newAccessToken = response.data.accessToken || response.data.token;

      // Lưu token mới
      setAccessToken(newAccessToken);
      
      // Xử lý hàng đợi
      processQueue(null, newAccessToken);

      // Gọi lại request gốc
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);

    } catch (err) {
      // Refresh thất bại (hết hạn refresh token hoặc lỗi mạng)
      processQueue(err, null);
      clearAccessToken(); // Xóa sạch
      window.location.href = "/login"; // Đá về login
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;