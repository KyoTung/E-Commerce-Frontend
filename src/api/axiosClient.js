import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true, // <--- BẬT LẠI CÁI NÀY (Để Email Login gửi được Cookie)
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
  // Ưu tiên lấy token lẻ, nếu không có thì tìm trong object customer
  return localStorage.getItem("token") || 
         (localStorage.getItem("customer") ? JSON.parse(localStorage.getItem("customer")).token : null);
};

export const setAccessToken = (token) => {
  const customer = localStorage.getItem("customer");
  if (customer) {
    const parsed = JSON.parse(customer);
    parsed.token = token;
    localStorage.setItem("customer", JSON.stringify(parsed));
  }
  localStorage.setItem("token", token);
};

export const clearAccessToken = () => {
  localStorage.removeItem("customer");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken"); 
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

    // A. Chặn loop: Nếu lỗi xảy ra tại chính API refresh -> Logout ngay
    if (originalRequest.url.includes("/user/refresh-token")) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // B. Nếu không có Access Token -> Không refresh
    const currentToken = getAccessToken();
    if (!currentToken) {
      return Promise.reject(error);
    }

    // C. Nếu đã retry rồi -> Dừng
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
      // --- SỬA LOGIC HYBRID TẠI ĐÂY ---
      
      // 1. Tìm Refresh Token trong LocalStorage (Cho Google Login)
      const localRefreshToken = localStorage.getItem("refreshToken");

      // 2. Chuẩn bị payload: 
      // - Nếu có localRefreshToken -> Gửi body: { refreshToken: ... }
      // - Nếu KHÔNG có (Email Login) -> Gửi body rỗng {} (Backend sẽ tự tìm Cookie)
      const payload = localRefreshToken ? { refreshToken: localRefreshToken } : {};

      // 3. Gọi API Refresh bằng AXIOS GỐC (tránh dùng axiosClient để không dính interceptor)
      const response = await axios.post(`${baseURL}/user/refresh-token`, payload, {
          withCredentials: true // QUAN TRỌNG: Để Email Login gửi kèm Cookie
      });

      const newAccessToken = response.data.accessToken || response.data.token;

      // 4. Lưu token mới
      setAccessToken(newAccessToken);
      
      // 5. Xả hàng đợi
      processQueue(null, newAccessToken);

      // 6. Gọi lại request gốc
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      
      // Dùng axiosClient gọi lại (để request này vẫn được hưởng các config khác nếu có)
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