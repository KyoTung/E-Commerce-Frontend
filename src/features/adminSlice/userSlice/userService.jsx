const baseURL = import.meta.env.VITE_BASE_URL;
import axios from "axios";


// userService.js
const getUser = async (userId, token) => {
  const response = await axios.get(`${baseURL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

const getAllUser = async (token) =>{
  const response = await axios.get(`${baseURL}/user/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};


const userService = {
    getUser,
    getAllUser,
}

export default userService;