import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let store = null;
export const injectStore = (_store) => {
  store = _store;
};

// SỬA TẠI ĐÂY: Quét cả 'accessToken' và 'token'
export const getAccessToken = () => {
  const customer = localStorage.getItem("customer");
  if (!customer) return null;
  const parsed = JSON.parse(customer);
  return parsed.accessToken || parsed.token || null; 
};

// SỬA TẠI ĐÂY: Lưu đè đúng tên biến
export const setAccessToken = (newToken) => {
  const customer = localStorage.getItem("customer");
  if (customer) {
    const parsed = JSON.parse(customer);
    parsed.accessToken = newToken; // Cập nhật đúng key
    localStorage.setItem("customer", JSON.stringify(parsed));
  }
};

export const clearAccessToken = () => {
  localStorage.removeItem("customer");
  localStorage.removeItem("user_info");
  if (store) store.dispatch({ type: "auth/clearAuth" }); // Đồng bộ với hàm clear của authSlice
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const customerStr = localStorage.getItem("customer");
    if (!customerStr) {
      return Promise.reject(error); 
    }

    if (originalRequest.url.includes("/user/refresh")) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

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
      const response = await axiosClient.post("/user/refresh");
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