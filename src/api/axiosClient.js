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
export const injectStore = (_store) => {
  store = _store;
};

// Lưu access token trong memory
let accessToken = null;

export const setAccessToken = (newAccessToken) => {
  accessToken = newAccessToken;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem("customer");
  localStorage.removeItem("user_info");
  localStorage.removeItem("refreshToken");
  if (store) store.dispatch({ type: "auth/reset" });
};

// --- HÀNG ĐỢI REFRESH ---
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
  (error) => Promise.reject(error),
);

// --- RESPONSE INTERCEPTOR ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu không phải lỗi 401 hoặc đã retry -> reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Nếu là request refresh token -> logout
    if (originalRequest.url.includes("/user/refresh")) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Kiểm tra có refresh token trong localStorage không
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return Promise.reject(error);
    }

    // Nếu đang refresh, xếp hàng đợi
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
      // Gọi refresh token
      const response = await axiosClient.post("/user/refresh");
      const newAccessToken = response.data.accessToken || response.data.token;

      // Lưu token mới
      setAccessToken(newAccessToken);

      // Nếu có refreshToken mới (nếu backend trả về) thì lưu lại
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      // Xử lý hàng đợi
      processQueue(null, newAccessToken);

      // Retry request gốc
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      // Refresh thất bại -> logout
      processQueue(refreshError, null);
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;