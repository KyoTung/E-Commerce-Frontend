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

export const getAccessToken = () => {
  const token = localStorage.getItem("token");
  if (token) return token;
  const customer = localStorage.getItem("customer");
  return customer ? JSON.parse(customer).token : null;
};

export const setAccessToken = (token) => {
  localStorage.setItem("token", token);
  const customer = localStorage.getItem("customer");
  if (customer) {
    const parsed = JSON.parse(customer);
    parsed.token = token;
    localStorage.setItem("customer", JSON.stringify(parsed));
  }
};

export const clearAccessToken = () => {
  localStorage.removeItem("customer");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  if (store) store.dispatch({ type: "auth/reset" });
};

// --- LOGIC HÀNG ĐỢI ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

    // 2. Chặn loop ở API Refresh
    if (originalRequest.url.includes("/user/refresh-token")) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 3. Nếu đã retry rồi -> Dừng
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Kiểm tra ngay lập tức: Nếu không có RefreshToken trong kho -> Đây là khách vãng lai.
    // -> Trả lỗi ngay để Component tự xử lý (hiện thông báo), KHÔNG Refresh, KHÔNG Redirect.
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
        return Promise.reject(error);
    }

    // ----------------------------------------------------

    // 4. Xếp hàng nếu đang refresh
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            resolve(axiosClient(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    // 5. Bắt đầu Refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
     // Dùng FETCH để tránh loop interceptor khi gọi API Refresh (vì axiosClient sẽ tự động thêm token vào header
      const response = await fetch(`${baseURL}/user/refresh`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      // DEBUG: Xem Backend trả về mã lỗi gì?
      if (!response.ok) {
        console.error("Refresh API Failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error details:", errorText);
        throw new Error("Refresh failed");
      }

      const data = await response.json();
      
      // DEBUG: Xem Backend có trả về refreshToken mới không?
      console.log("Refresh Success! Data received:", data);

      const newAccessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken; 

      // 1. Lưu Access Token
      setAccessToken(newAccessToken);

      // 2. Lưu Refresh Token mới (nếu có)
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      } else {
        console.warn("CẢNH BÁO: Backend không trả về refreshToken mới! Lần sau F5 sẽ bị lỗi.");
      }

      // Mở cổng hàng đợi
      processQueue(null, newAccessToken);

      // Gọi lại request gốc
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);

    } catch (err) {
      // Chỉ khi quá trình refresh thất bại (nghĩa là token hết hạn thật sự) mới logout
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