import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// --- QUẢN LÝ TOKEN (IN-MEMORY) ---
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

// --- INJECT STORE (Để gọi Action Redux từ file này) ---
let store = null;
export const injectStore = (_store) => {
  store = _store;
};

// --- AXIOS INSTANCE ---
const axiosClient = axios.create({
  baseURL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    // Nếu có token trong RAM, gắn vào Header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (Refresh Token) ---
let isRefreshing = false;
let failedQueue = [];

//  xử lý hàng đợi các request bị lỗi
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

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
     
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
        // Gọi API refresh token
        // Không cần truyền token cũ, cookie HttpOnly sẽ tự gửi đi
        const { data } = await axiosClient.post('/user/refresh');
        
        // Server trả về { accessToken: "..." }
        const newAccessToken = data.accessToken;
        
        // Lưu token mới vào RAM
        setAccessToken(newAccessToken);

        // Xử lý hàng đợi
        processQueue(null, newAccessToken);

        // Gọi lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);

      } catch (err) {
        // Refresh thất bại (Token hết hạn hoặc không hợp lệ) -> LOGOUT
        processQueue(err, null);
        clearAccessToken();

        // Gọi Action Logout trong Redux để xóa state User và redirect về Login
        if (store) {
          store.dispatch({ type: 'auth/clearAuth' }); 
        }
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;