import axiosClient from "../../../api/axiosClient";

// Lấy danh sách giao dịch (nhập/xuất)
const getTransactions = async (params) => {
  const response = await axiosClient.get("/inventory/transactions", { params });
  return response.data;
};

// Lấy chi tiết một giao dịch
const getTransactionById = async (id) => {
  const response = await axiosClient.get(`/inventory/transactions/${id}`);
  return response.data;
};

// Tạo phiếu nhập kho
const createImportTransaction = async (data) => {
  const response = await axiosClient.post("/inventory/import", data);
  return response.data;
};

// Tạo phiếu xuất kho
const createExportTransaction = async (data) => {
  const response = await axiosClient.post("/inventory/export", data);
  return response.data;
};

// Hủy phiếu nhập (hoàn kho)
const cancelTransaction = async (id) => {
  const response = await axiosClient.put(`/inventory/transactions/${id}/cancel`);
  return response.data;
};

// Lấy tồn kho hiện tại
const getStock = async (params) => {
  const response = await axiosClient.get("/inventory/stock", { params });
  return response.data;
};

const inventoryService = {
  getTransactions,
  getTransactionById,
  createImportTransaction,
  createExportTransaction,
  cancelTransaction,
  getStock,
};

export default inventoryService;