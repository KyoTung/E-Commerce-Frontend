import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  // withCredentials: true, // <-- TẠM TẮT HOẶC ĐỂ CŨNG ĐƯỢC (Vì giờ ta không phụ thuộc Cookie nữa)
  headers: {
    "Content-Type": "application/json",
  },
});

// --- HELPER FUNCTIONS ---
let store = null;
export const injectStore = (_store) => {
  store = _store;
};

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
    // Cập nhật cả key lẻ bên ngoài nếu bạn có dùng
    localStorage.setItem("token", token);
  }
};

// SỬA: Xóa sạch cả refresh token
export const clearAccessToken = () => {
  localStorage.removeItem("customer");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken"); // <--- XÓA CÁI NÀY NỮA
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

// --- RESPONSE INTERCEPTOR ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Chỉ xử lý lỗi 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // A. Chặn loop vô tận tại chính API refresh
    if (originalRequest.url.includes("/user/refresh-token")) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // B. Nếu không có token (Khách vãng lai) -> Không refresh
    const currentToken = getAccessToken();
    if (!currentToken) {
      return Promise.reject(error);
    }

    // C. Nếu đã retry rồi mà vẫn lỗi -> Dừng
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
      // --- THAY ĐỔI QUAN TRỌNG Ở ĐÂY ---
      
      // 1. Lấy Refresh Token từ LocalStorage
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // 2. Gọi API Refresh (Sử dụng PUT và gửi token trong Body)
      // Lưu ý: Kiểm tra route backend của bạn là PUT hay POST. Thường là PUT.
      const response = await axiosClient.put("/user/refresh-token", {
        refreshToken: refreshToken, // <--- Gửi kèm refreshToken
      });

      const newAccessToken = response.data.accessToken || response.data.token;

      // 3. Lưu token mới
      setAccessToken(newAccessToken);
      
      // 4. Xử lý hàng đợi đang chờ
      processQueue(null, newAccessToken);

      // 5. Gọi lại request ban đầu
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