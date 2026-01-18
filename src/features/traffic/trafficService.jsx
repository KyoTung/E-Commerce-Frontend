import axiosClient from "../../api/axiosClient";

const recordVisit = async () => {
  const response = await axiosClient.post("/traffic/record");
  return response.data;
};

const getTrafficStats = async () => {
  const response = await axiosClient.get("/traffic");
  return response.data;
};

const trafficService = {
  recordVisit,
  getTrafficStats,
};

export default trafficService;