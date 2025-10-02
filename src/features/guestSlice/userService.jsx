const baseURL = import.meta.env.VITE_BASE_URL;
import axios from "axios";


const token = JSON.parse(localStorage.getItem("user"))?.token;

const getUser = async (userId) => {
  const response = await axios.get(`${baseURL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};



const userService = {
    getUser,
}

export default userService;