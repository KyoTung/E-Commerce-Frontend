import axiosClient from "../../../api/axiosClient";

const getOverview = async (params) => {
  const response = await axiosClient.get("/stats/overview", { params });
  return response.data;
};

const getRevenueChart = async (params) => {
  const response = await axiosClient.get("/stats/revenue", { params });
  return response.data;
};

const getTopProducts = async (params) => {
  const response = await axiosClient.get("/stats/top-products", { params });
  return response.data;
};

const getLowStock = async (threshold) => {
  const response = await axiosClient.get("/stats/low-stock", { params: { threshold } });
  return response.data;
};

const dashboardService = {
  getOverview,
  getRevenueChart,
  getTopProducts,
  getLowStock,
};

export default dashboardService;