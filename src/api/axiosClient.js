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
export const injectStore = (_store) => {
  store = _store;
};

let accessToken = null; // lưu trong memory

export const setAccessToken = (newAccessToken) => {
  accessToken = newAccessToken;
};

export const getAccessToken = () => accessToken;

// export const getAccessToken = () => {
//   const customer = localStorage.getItem("customer");
//   return customer ? JSON.parse(customer).token : null;
// };

// export const setAccessToken = (token) => {
//   const customer = localStorage.getItem("customer");
//   if (customer) {
//     const parsed = JSON.parse(customer);
//     parsed.token = token;
//     localStorage.setItem("customer", JSON.stringify(parsed));
//   }
// };

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem("customer");
  localStorage.removeItem("user_info");
  if (store) store.dispatch({ type: "auth/reset" });
};

// --- LOGIC REFRESH ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, accessToken = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(accessToken);
  });
  failedQueue = [];
};

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error),
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
    if (originalRequest.url.includes("/user/refresh-token") || originalRequest.url.includes("/user/refresh")) {
      console.log("🚨 LỖI TẠI INTERCEPTOR: API Refresh bị 401");
      // Nếu refresh lỗi, nghĩa là phiên đăng nhập hết hạn hẳn -> Logout
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // B. Nếu không có dấu hiệu đã đăng nhập (không có customer trong localStorage) -> DỪNG
    const customer = localStorage.getItem("customer");
    if (!customer) {
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
          resolve: (accessToken) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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

      console.log("🚨 LỖI TẠI INTERCEPTOR: Try/catch refresh thất bại");
      processQueue(err, null);
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;
