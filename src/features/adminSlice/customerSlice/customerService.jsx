const baseURL = import.meta.env.VITE_BASE_URL;
import axios from "axios";


const createUser = async (userData) => {
  const response = await axios.post(`${baseURL}/user/register`, userData)
  return response.data;
}


const updateUser = async (userId, userData, token) => {
  const response = await axios.put(`${baseURL}/user/update-user/${userId}`, userData, {
    headers: {  Authorization: `Bearer ${token}`      }
  })
  return response.data;
}

const getUserDetail = async (userId, token) => {
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

const blockUser = async (userId, token) => {
  const response = await axios.put(`${baseURL}/user/block-user/${userId}`, {}, {
    headers: {  Authorization: `Bearer ${token}`      }
  });
  return response.data;
};

const unBlockUser = async (userId, token) => {
  const response = await axios.put(`${baseURL}/user/unblock-user/${userId}`, {}, {
    headers: {  Authorization: `Bearer ${token}`      }
  });
  return response.data;
}

const customerService = {
    getUserDetail,
    getAllUser,
    createUser,
    updateUser,
    deleteUser,
    blockUser,
    unBlockUser,
}

export default customerService;