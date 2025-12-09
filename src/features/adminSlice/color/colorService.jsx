import axiosClient from "../../../api/axiosClient";

const createColor = async (colorData) => {
  const response = await axiosClient.post('/color', colorData);
  return response.data;
};

const updateColor = async (colorId, colorData) => {
  const response = await axiosClient.put(`/color/${colorId}`, colorData);
  return response.data;
};

const getAllColor = async () => {
  const response = await axiosClient.get('/color');
  return response.data;
};

const getColor = async (colorId) => {
  const response = await axiosClient.get(`/color/${colorId}`);
  return response.data;
};

const deleteColor = async (colorId) => {
  const response = await axiosClient.delete(`/color/${colorId}`);
  return response.data;
};

const colorService = {
  createColor,
  updateColor,
  deleteColor,
  getAllColor,
  getColor,
};

export default colorService;