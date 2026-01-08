import axiosClient, { setAccessToken, clearAccessToken } from '../../api/axiosClient';

const login = async (userData) => {
  const response = await axiosClient.post('/user/login', userData);
  
  const { token, ...userInfo } = response.data;

  if (token) {
    setAccessToken(token);
    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }
  }
  return userInfo;
};

const register = async (userData) => {
  const response = await axiosClient.post('/user/register', userData);
  return response.data;
}

const logout = async () => {
  await axiosClient.post('/user/logout'); 

  clearAccessToken();
};

const updatePassword = async (passwordData) => {

  const response = await axiosClient.put("/user/password", passwordData);
  return response.data;
};


const forgotPasswordToken = async (email) => {
  const response = await axiosClient.post("/user/forgot-password-token", { email });
  return response.data;
};


const resetPassword = async (token, password) => {
  const response = await axiosClient.put(`/user/reset-password/${token}`, { password });
  return response.data;
};

const authService = {
  login,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  register
};

export default authService;