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

  // Lấy dữ liệu và trạng thái từ Redux Store
  const {
    suppliers = [],
    total = 0,
    loading,
  } = useSelector((state) => state.supplier);

  // Khai báo các State cục bộ
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // State quản lý dữ liệu Form nhập kho
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    status: "Active",
  });

  // Số lượng phần tử hiển thị cố định trên mỗi trang
  const itemsPerPage = 10;

  // Lắng nghe thay đổi trang hoặc từ khóa tìm kiếm để tự động gọi API
  useEffect(() => {
    dispatch(
      getSuppliers({
        page: currentPage,
        limit: itemsPerPage,
        search: search.trim(),
      }),
    );
  }, [dispatch, currentPage, search]);

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi gõ từ khóa mới
  };

  // Hàm tải lại thủ công
  const handleRefresh = () => {
    dispatch(
      getSuppliers({
        page: currentPage,
        limit: itemsPerPage,
        search: search.trim(),
      }),
    );
  };

  // Mở modal thêm mới nhà cung cấp
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

  // Mở modal chỉnh sửa (gán dữ liệu cũ của NCC vào form)
  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      taxCode: supplier.taxCode || "",
      status: supplier.status || "Active",
    });
    setShowModal(true);
  };

  // Cập nhật giá trị state khi gõ thông tin form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HÀM XỬ LÝ HÀNH ĐỘNG: THÊM MỚI / CẬP NHẬT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.warning("Vui lòng điền tên và số điện thoại nhà cung cấp!");
      return;
    }

    try {
      if (editingSupplier) {
        // Truyền đúng cấu trúc Object băm { id, supplierData } mà Redux Thunk mong đợi
        await dispatch(
          updateSupplier({
            id: editingSupplier._id,
            supplierData: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(createSupplier(formData)).unwrap();
      }

      setShowModal(false); // Đóng modal
      handleRefresh(); // Tải lại danh sách mới
    } catch (error) {
      console.error("Lỗi cập nhật dữ liệu:", error);
    }
  };

  // --- HÀM XỬ LÝ HÀNH ĐỘNG: XÓA NHÀ CUNG CẤP ---
  const handleDelete = async (id) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn nhà cung cấp này?")
    ) {
      try {
        // Gửi mã chuỗi ID đơn lẻ khớp với Thunk deleteSupplier nhận vào
        await dispatch(deleteSupplier(id)).unwrap();

        // Logic bọc lót: Nếu trang hiện tại chỉ còn 1 phần tử mà bị xóa, lùi về trang trước
        if (suppliers.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          handleRefresh();
        }
      } catch (error) {
        console.error("Lỗi xóa dữ liệu:", error);
      }
    }
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(total / itemsPerPage) || 1;

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />

      {/* Tiêu đề & Nút bấm trên cùng */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý nhà cung cấp
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng số cơ sở đối tác: {total}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm nhà cung cấp
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />{" "}
            Tải lại
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-4 w-full md:w-80">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Bảng hiển thị dữ liệu */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading && suppliers.length === 0 ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {suppliers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Không tìm thấy nhà cung cấp nào.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Tên NCC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Số điện thoại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Địa chỉ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Mã số thuế
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {suppliers.map((sup, idx) => (
                    <tr key={sup._id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 max-w-[220px] break-words whitespace-normal">
                        {sup.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 font-medium">
                        {sup.phone}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 font-mono text-xs">
                        {sup.email || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {sup.address || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 font-mono">
                        {sup.taxCode || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            sup.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sup.status === "Active" ? "Hoạt động" : "Tạm ngưng"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(sup)}
                            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(sup._id)}
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 transition"
                            title="Xóa đối tác"
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

      {/* Thanh Điều hướng chuyển số trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4 rounded-lg shadow-sm">
          <div className="flex flex-1 justify-between sm:justify-end gap-3 items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Trước
            </button>
            <span className="text-sm text-gray-700 font-medium">
              Trang <strong>{currentPage}</strong> / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* --- HỘP THOẠI MODAL (POPUP) THÊM / SỬA --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-xl font-bold text-gray-800">
                {editingSupplier
                  ? "Chỉnh sửa đối tác NCC"
                  : "Thêm nhà cung cấp mới"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tên nhà cung cấp *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Số điện thoại *
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email công ty
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Địa chỉ văn phòng
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Mã số thuế (Doanh nghiệp)
                  </label>
                  <input
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Trạng thái hợp tác
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Active">Hoạt động (Active)</option>
                    <option value="Inactive">Tạm ngưng (Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  {editingSupplier ? "Cập nhật dữ liệu" : "Xác nhận thêm"}
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
