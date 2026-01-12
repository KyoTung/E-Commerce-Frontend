import axiosClient from "../../api/axiosClient";


const recordTraffic = async (trafficData) => {
  const response = await axiosClient.post("/traffic/record", trafficData);
  return response.data;
};

const getTrafficStats = async () => {
  const response = await axiosClient.get("/traffic/stats");
  return response.data;
};

export const trafficService = {
  recordTraffic,
  getTrafficStats,
};