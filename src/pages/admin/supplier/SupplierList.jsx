import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Pencil, Trash2, Plus, RefreshCw, X } from "lucide-react";
import Loading from "../../../components/Loading";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../../features/adminSlice/supplier/supplierSlice";

const SupplierList = () => {
  const dispatch = useDispatch();
  const { suppliers, total, page, limit, loading } = useSelector(
    (state) => state.supplier
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    status: "Active",
  });

  useEffect(() => {
    dispatch(
      getSuppliers({
        page: currentPage,
        limit,
        search,
      })
    );
  }, [dispatch, currentPage, limit, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    dispatch(
      getSuppliers({
        page: currentPage,
        limit,
        search,
      })
    );
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      taxCode: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email || "",
      address: supplier.address || "",
      taxCode: supplier.taxCode || "",
      status: supplier.status,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.warning("Vui lòng nhập tên và số điện thoại");
      return;
    }
    if (editingSupplier) {
      await dispatch(
        updateSupplier({
          id: editingSupplier._id,
          supplierData: formData,
        })
      );
    } else {
      await dispatch(createSupplier(formData));
    }
    setShowModal(false);
    // Refresh lại danh sách
    dispatch(
      getSuppliers({
        page: currentPage,
        limit,
        search,
      })
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này?")) {
      await dispatch(deleteSupplier(id));
      dispatch(
        getSuppliers({
          page: currentPage,
          limit,
          search,
        })
      );
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý nhà cung cấp</h1>
        <div className="flex gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm nhà cung cấp
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} /> Tải lại
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 w-full md:w-80">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {suppliers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy nhà cung cấp nào.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Tên NCC</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Số điện thoại</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Địa chỉ</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Mã số thuế</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {suppliers.map((sup, idx) => (
                    <tr key={sup._id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                        { idx + 1}
                       </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{sup.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{sup.phone}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{sup.email || "—"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{sup.address || "—"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{sup.taxCode || "—"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            sup.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sup.status === "Active" ? "Hoạt động" : "Tạm ngưng"}
                        </span>
                       </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditModal(sup)}
                            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(sup._id)}
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4 rounded-lg shadow-sm">
          <div className="flex flex-1 justify-between sm:justify-end gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Trước
            </button>
            <span className="text-sm text-gray-700 py-2">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-xl font-bold text-gray-800">
                {editingSupplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Tên nhà cung cấp *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Số điện thoại *</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Mã số thuế</label>
                  <input
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Tạm ngưng</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  {editingSupplier ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;