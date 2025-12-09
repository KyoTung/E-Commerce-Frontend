import axiosClient from "../../../api/axiosClient"

const getUser = async (id) => {
  const response = await axiosClient.get(`/user/${id}`);
  return response.data;
};

const updateUser = async (userData, id) => {
  const response = await axiosClient.put(`/user/update-information/${id}`, userData);
  return response.data;
};

const userService = {
  getUser,
  updateUser,
};

export default userService;