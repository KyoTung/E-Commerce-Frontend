const baseURL = import.meta.env.VITE_BASE_URL;
import axios from "axios";
import { stringify } from "postcss";

//const tokenExpiryTime = Date.now() + 30*60*1000;


const login = async (userData) => {
  const response = await axios.post(`${baseURL}/user/login`, userData);

  return response.data;
};

const logout = async(token) =>{
  const response = await axios.get(`${baseURL}/user/logout`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

const authService = {
  login,
  logout,
};

export default authService;
