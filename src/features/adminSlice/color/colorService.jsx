import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
  
const createColor = async (colorData, token) => {
  const response = await axios.post(`${baseURL}/color`, colorData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateColor= async (colorId, colorData, token) => {
  const response = await axios.put(
    `${baseURL}/color/${colorId}`,
    colorData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


const getAllColor= async (token) => {
  const response = await axios.get(`${baseURL}/color`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getColor= async (colorId, token) => {
  const response = await axios.get(`${baseURL}/color/${colorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteColor= async (colorId, token) => {
  const response = await axios.delete(`${baseURL}/color/${colorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
