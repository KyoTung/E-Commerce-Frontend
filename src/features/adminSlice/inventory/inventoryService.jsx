import axiosClient from "../../../api/axiosClient";

// Lấy danh sách giao dịch (phân trang, lọc)
const getTransactions = async (params) => {
  const response = await axiosClient.get("/inventory/transactions", { params });
  return response.data;
};

// Tạo phiếu nhập kho
const createImport = async (data) => {
  const response = await axiosClient.post("/inventory/import", data);
  return response.data;
};

// Tạo phiếu xuất kho
const createExport = async (data) => {
  const response = await axiosClient.post("/inventory/export", data);
  return response.data;
};

// Hủy phiếu nhập (hoàn tác)
const cancelTransaction = async (id) => {
  const response = await axiosClient.put(`/inventory/transactions/${id}/cancel`);
  return response.data;
};

// Xem tồn kho hiện tại (có filter)
const getStock = async (params) => {
  const response = await axiosClient.get("/inventory/stock", { params });
  return response.data;
};

// Lấy chi tiết một giao dịch
const getTransactionDetail = async (id) => {
  const response = await axiosClient.get(`/inventory/transactions/${id}`);
  return response.data;
};

const inventoryService = {
  getTransactions,
  createImport,
  createExport,
  cancelTransaction,
  getStock,
  getTransactionDetail,
};

export default inventoryService;