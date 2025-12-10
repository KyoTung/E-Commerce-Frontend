import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

// --- QUẢN LÝ TOKEN (IN-MEMORY) ---
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

let store = null;
export const injectStore = (_store) => {
  store = _store;
};

// --- AXIOS INSTANCE ---
const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
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

    if (originalRequest.url.includes("/user/refresh")) {
      return Promise.reject(error);
    }
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
        const { data } = await axiosClient.post("/user/refresh");
        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        // Cập nhật token cho request ban đầu
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAccessToken();
        if (store) {
          store.dispatch({ type: "auth/clearAuth" });
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
