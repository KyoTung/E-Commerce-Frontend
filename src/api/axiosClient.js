import axios from "axios";

// URL Backend
const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. KHÔI PHỤC CÁC HÀM HELPER (Đã chỉnh sửa để đồng bộ LocalStorage) ---
let store = null;

export const injectStore = (_store) => {
  store = _store;
};

// Hàm này giờ sẽ xóa token trong LocalStorage (Nơi lưu trữ chính)
export const clearAccessToken = () => {
  localStorage.removeItem("customer"); // Xóa key "customer"
  
  // Nếu có Redux Store, dispatch action logout để UI cập nhật ngay
  if (store) {
    // Bạn thay "auth/logout" bằng action logout thực tế trong slice của bạn
    // Ví dụ: store.dispatch(logout()); 
    store.dispatch({ type: "auth/reset" }); // Hoặc action reset state
  }
};

// --- 2. BIẾN CỜ & HÀNG ĐỢI (LOGIC REFRESH) ---
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

// --- 3. REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    // Luôn lấy token mới nhất từ LocalStorage
    const customer = localStorage.getItem("customer");
    if (customer) {
      try {
        const parsedCustomer = JSON.parse(customer);
        const token = parsedCustomer.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // JSON lỗi thì thôi
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 4. RESPONSE INTERCEPTOR ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Tránh loop vô tận nếu chính API refresh bị lỗi
    if (originalRequest.url.includes("/user/refresh-token")) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // --- LOGIC XẾP HÀNG (FLAG + QUEUE) ---
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Gọi API Refresh
      const response = await axiosClient.get("/user/refresh-token"); 
      const newAccessToken = response.data.accessToken || response.data.token;

      // Cập nhật LocalStorage
      const customer = localStorage.getItem("customer");
      if (customer) {
        const parsedCustomer = JSON.parse(customer);
        parsedCustomer.token = newAccessToken;
        localStorage.setItem("customer", JSON.stringify(parsedCustomer));
      }

      // Mở hàng đợi
      processQueue(null, newAccessToken);

      // Gửi lại request lỗi
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);

    } catch (err) {
      // Refresh thất bại -> Xử lý Logout
      processQueue(err, null);
      
      // GỌI HÀM HELPER BẠN CẦN Ở ĐÂY
      clearAccessToken(); 
      
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;