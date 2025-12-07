import axiosClient, { setAccessToken, clearAccessToken } from '../../api';

// Login User
const login = async (userData) => {
  const response = await axiosClient.post('/user/login', userData);
  
  // Giả sử server trả về: { _id, name, email, ..., token: "xyz..." }
  const { token, ...userInfo } = response.data;

  if (token) {
    // 1. Lưu Access Token vào RAM (axiosClient)
    setAccessToken(token);
  }

  // 2. Chỉ trả về thông tin user (KHÔNG CÓ TOKEN) cho Slice
  return userInfo;
};

// Logout User
const logout = async () => {
  // Gọi API để server xóa Cookie Refresh Token
  await axiosClient.get('/user/logout'); // hoặc post tùy backend
  
  // Xóa token trong RAM
  clearAccessToken();
};

const authService = {
  login,
  logout,
};

export default authService;