const baseURL = import.meta.env.VITE_BASE_URL;
import axios from "axios";
import { stringify } from "postcss";

const login = async (userData) => {
  const response = await axios.post(`${baseURL}/user/login`, userData);

  if (response.data && response.data.token) {
    console.log(response.data);
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...response,
        expiresAt: tokenExpiryTime,
      })
    );
  }

  return response.data;
};

const authService = {
  login,
};

export default authService;
