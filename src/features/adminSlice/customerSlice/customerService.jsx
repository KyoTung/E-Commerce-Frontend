
import axiosClient from "../../../api/axiosClient"; 

const createUser = async (userData) => {
  const response = await axiosClient.post('/user/register', userData);
  return response.data;
};

const updateUser = async (userId, userData) => {
  const response = await axiosClient.put(`/user/update-user/${userId}`, userData);
  return response.data;
};

const getUserDetail = async (userId) => {
  const response = await axiosClient.get(`/user/${userId}`);
  return response.data;
};

const getAllUser = async () => {
  const response = await axiosClient.get('/user/all-users');
  return response.data;
};

const deleteUser = async (userId) => {
  const response = await axiosClient.delete(`/user/${userId}`);
  return response.data;
};

const blockUser = async (userId) => {
  const response = await axiosClient.put(`/user/block-user/${userId}`, {});
  return response.data;
};

const unBlockUser = async (userId) => {
  const response = await axiosClient.put(`/user/unlock-user/${userId}`, {});
  return response.data;
};

const customerService = {
  getUserDetail,
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  blockUser,
  unBlockUser,
};

export default customerService;