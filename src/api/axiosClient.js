import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- HELPER FUNCTIONS ---
let store = null;
export const injectStore = (_store) => { store = _store; };

export const getAccessToken = () => {
  const customer = localStorage.getItem("customer");
  return customer ? JSON.parse(customer).token : null;
};

export const setAccessToken = (token) => {
  const customer = localStorage.getItem("customer");
  if (customer) {
    const parsed = JSON.parse(customer);
    parsed.token = token;
    localStorage.setItem("customer", JSON.stringify(parsed));
  }
};

export const clearAccessToken = () => {
  localStorage.removeItem("customer");
  if (store) store.dispatch({ type: "auth/reset" });
};

// --- LOGIC REFRESH ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR (VÁ LỖI TẠI ĐÂY) ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Chỉ xử lý lỗi 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // --- CHỐT CHẶN QUAN TRỌNG (FIX LOOP) ---
    
    // A. Nếu chính API Refresh bị lỗi -> DỪNG NGAY (Tránh lặp vô tận)
    if (originalRequest.url.includes("/user/refresh-token")) {
      // Nếu refresh lỗi, nghĩa là phiên đăng nhập hết hạn hẳn -> Logout
      clearAccessToken();
      window.location.href = "/login"; 
      return Promise.reject(error);
    }

    // B. Nếu LocalStorage không có token (Khách vãng lai) -> DỪNG NGAY
    // (Khách chưa đăng nhập mà bị 401 thì là lỗi quyền hạn, không phải do hết hạn token)
    const currentToken = getAccessToken();
    if (!currentToken) {
        return Promise.reject(error);
    }

    // C. Nếu đã retry 1 lần rồi mà vẫn lỗi -> DỪNG
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // ----------------------------------------

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
      const response = await axiosClient.get("/user/refresh-token");
      const newAccessToken = response.data.accessToken || response.data.token;

      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);

    } catch (err) {
      processQueue(err, null);
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;