import axiosClient, { setAccessToken, clearAccessToken } from '../../api/axiosClient';

// Login User
const login = async (userData) => {
  const response = await axiosClient.post('/user/login', userData);
  
  const { token, ...userInfo } = response.data;

  if (token) {
    setAccessToken(token);
  }
  return userInfo;
};

// Logout User
const logout = async () => {
  await axiosClient.post('/user/logout'); 
  
  // Xóa token trong RAM
  clearAccessToken();
};

const authService = {
  login,
  logout,
};

export default authService;