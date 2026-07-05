import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://e-commerce-backend-f62w.onrender.com/api",
  //withCredentials: true,
});

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("ACCESS_TOKEN");
//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    // if (response.status === 401) {
    //   localStorage.removeItem("ACCESS_TOKEN");
    // }

    throw error;
  }
);

export default axiosClient;
