import axios from "axios";

// URL Backend
const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true, // Quan trọng: Để gửi kèm Cookie RefreshToken
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. BIẾN CỜ & HÀNG ĐỢI (METHOD 2) ---
let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý hàng đợi sau khi có token mới (hoặc lỗi)
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

// --- 2. REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    // Luôn lấy token mới nhất từ LocalStorage
    // (Vì LoginSuccess và RefreshToken đều lưu vào đây)
    const customer = localStorage.getItem("customer");
    
    if (customer) {
      try {
        const parsedCustomer = JSON.parse(customer);
        const token = parsedCustomer.token; // Lấy Access Token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // Nếu JSON lỗi thì bỏ qua
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 3. RESPONSE INTERCEPTOR (LOGIC CHÍNH) ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi không phải 401, trả về lỗi luôn
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Nếu request lỗi chính là request đi refresh token -> Bỏ cuộc (Tránh vòng lặp)
    // (Lưu ý: URL này phải khớp với backend của bạn, ví dụ /user/refresh-token)
    if (originalRequest.url.includes("/user/refresh-token")) {
      return Promise.reject(error);
    }

    // Nếu request đã từng retry rồi mà vẫn lỗi -> Bỏ cuộc
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // --- TRƯỜNG HỢP A: ĐANG CÓ NGƯỜI KHÁC REFRESH (isRefreshing = true) ---
    if (isRefreshing) {
      // Request này phải xếp hàng đợi
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

    // --- TRƯỜNG HỢP B: CHƯA AI REFRESH -> MÌNH LÀ NGƯỜI ĐẦU TIÊN ---
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // 1. Gọi API Refresh (Backend tự lấy RefreshToken từ Cookie)
      // Sửa lại method/url cho đúng backend của bạn (thường là GET hoặc POST)
      const response = await axiosClient.get("/user/refresh-token"); 
      
      // 2. Lấy Access Token mới từ phản hồi
      // Backend của bạn trả về: { accessToken: "..." }
      const newAccessToken = response.data.accessToken || response.data.token;

      // 3. QUAN TRỌNG: CẬP NHẬT LOCAL STORAGE
      // Phải lưu vào đây để lần sau F5 trang web vẫn còn token mới
      const customer = localStorage.getItem("customer");
      if (customer) {
        const parsedCustomer = JSON.parse(customer);
        parsedCustomer.token = newAccessToken; // Cập nhật token mới
        localStorage.setItem("customer", JSON.stringify(parsedCustomer));
      }

      // 4. Giải phóng hàng đợi (Báo cho các request đang chờ biết token mới)
      processQueue(null, newAccessToken);

      // 5. Retry request ban đầu của mình
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);

    } catch (err) {
      // 6. Nếu refresh thất bại (Hết hạn hẳn hoặc lỗi mạng)
      processQueue(err, null);
      
      // Xóa LocalStorage và Logout
      localStorage.removeItem("customer");
      window.location.href = "/login"; // Đá về trang login
      return Promise.reject(err);
    } finally {
      // 7. Luôn tắt cờ refresh dù thành công hay thất bại
      isRefreshing = false;
    }
  }
);

export default axiosClient;