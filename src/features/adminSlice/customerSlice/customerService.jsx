const baseURL = import.meta.env.VITE_BASE_URL;
import axios from "axios";


const addUser = async (userData, token) => {
  const response = await axios.post(`${baseURL}/user`, userData, {
    headers: {  Authorization: `Bearer ${token}`      }
  })
  return response.data;
}


const updateUser = async (userData, token) => {
  const response = await axios.put(`${baseURL}/user/${userData.id}`, userData, {
    headers: {  Authorization: `Bearer ${token}`      }
  })
  return response.data;
}

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
  return response.data;
};

const deleteUser = async (userId, token) => {
  const response = await axios.delete(`${baseURL}/user/${userId}`, {
    headers: {  Authorization: `Bearer ${token}`      }
  });
  return response.data;
};

const customerService = {
    getUser,
    getAllUser,
    addUser,
    updateUser,
    deleteUser
}

export default customerService;