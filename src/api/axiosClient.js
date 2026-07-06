import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true, // Vẫn giữ để gửi Refresh Token qua Cookie (nếu trình duyệt cho phép)
  headers: {
    "Content-Type": "application/json",
  },
});

// --- HELPER FUNCTIONS CHO LOCALSTORAGE ---
let store = null;
export const injectStore = (_store) => {
  store = _store;
};

// Đọc Token trực tiếp từ localStorage (Giúp F5 không bị mất)
export const getAccessToken = () => {
  const customer = localStorage.getItem("customer");
  return customer ? JSON.parse(customer).token : null;
};

// Lưu Token mới vào localStorage
export const setAccessToken = (token) => {
  const customer = localStorage.getItem("customer");
  if (customer) {
    const parsed = JSON.parse(customer);
    parsed.token = token; // Cập nhật token mới
    localStorage.setItem("customer", JSON.stringify(parsed));
  } else {
    // Đề phòng trường hợp chưa có object customer
    localStorage.setItem("customer", JSON.stringify({ token: token }));
  }
};

export const clearAccessToken = () => {
  localStorage.removeItem("customer");
  localStorage.removeItem("user_info");
  if (store) store.dispatch({ type: "auth/reset" });
};

// --- LOGIC REFRESH QUẢN LÝ HÀNG ĐỢI ---
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
    const accessToken = getAccessToken(); // Lấy từ localStorage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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

    // 1. Chỉ xử lý khi lỗi 401 (Hết hạn Token hoặc Không có Token)
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 2. Tránh vòng lặp vô tận nếu chính API refresh cũng bị 401
    if (originalRequest.url.includes("/user/refresh-token") || originalRequest.url.includes("/user/refresh")) {
      console.log("🚨 Refresh Token cũng đã hết hạn -> Đăng xuất");
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 3. Nếu đã thử refresh 1 lần cho request này rồi mà vẫn lỗi -> Dừng
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // 4. Đưa các request bị lỗi 401 khác vào hàng chờ (Queue) trong lúc gọi API Refresh
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
      // 5. Gọi API cấp lại Token mới
      const response = await axiosClient.post("/user/refresh");
      const newAccessToken = response.data.accessToken || response.data.token;

      // 6. Lưu Token mới vào localStorage
      setAccessToken(newAccessToken);
      
      // 7. Giải phóng hàng đợi
      processQueue(null, newAccessToken);

      // 8. Thực hiện lại request ban đầu với Token mới
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (err) {
      console.log("🚨 Try/catch refresh thất bại -> Đăng xuất");
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