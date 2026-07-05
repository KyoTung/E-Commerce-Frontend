import axiosClient from "../../../api/axiosClient";

const getSuppliers = async (params) => {
  const response = await axiosClient.get("/supplier", { params });
  return response.data;
};

const createSupplier = async (supplierData) => {
  const response = await axiosClient.post("/supplier", supplierData);
  return response.data;
};

const updateSupplier = async (id, supplierData) => {
  const response = await axiosClient.put(`/supplier/${id}`, supplierData);
  return response.data;
};

const deleteSupplier = async (id) => {
  const response = await axiosClient.delete(`/supplier/${id}`);
  return response.data;
};

const supplierService = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};

export default supplierService;