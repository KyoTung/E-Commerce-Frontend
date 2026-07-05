import React, { useEffect, useState } from "react";
import { PencilLine, Trash, Plus, RefreshCw, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";

import {
  createBrand,
  updateBrand,
  getAllBrand,
  deleteBrand,
} from "../../../features/adminSlice/brand/brandSlice";

const Brands = () => {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.brandAdmin);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentBrand, setCurrentBrand] = useState({ id: null, title: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getAllBrand());
  }, [dispatch]);

  const filteredBrands = brands.filter((brand) =>
    brand.title?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (mode, brand = null) => {
    setError("");
    setModalMode(mode);
    if (mode === "edit" && brand) {
      setCurrentBrand({ id: brand._id || brand.id, title: brand.title });
    } else {
      setCurrentBrand({ id: null, title: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBrand({ id: null, title: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = currentBrand.title.trim();
    if (!title) {
      toast.warning("Vui lòng nhập tên thương hiệu");
      return;
    }

    // Kiểm tra trùng tên
    const duplicate = brands.some(
      (b) =>
        b.title.toLowerCase() === title.toLowerCase() &&
        (modalMode === "add" || b._id !== currentBrand.id)
    );
    if (duplicate) {
      setError("Tên thương hiệu đã tồn tại");
      return;
    }
    setError("");

    try {
      let resultAction;
      if (modalMode === "add") {
        resultAction = await dispatch(createBrand({ title }));
      } else {
        resultAction = await dispatch(
          updateBrand({
            brandId: currentBrand.id,
            brandData: { title },
          })
        );
      }

      if (
        createBrand.fulfilled.match(resultAction) ||
        updateBrand.fulfilled.match(resultAction)
      ) {
        toast.success(
          modalMode === "add"
            ? "Thêm thương hiệu thành công"
            : "Cập nhật thương hiệu thành công"
        );
        closeModal();
        dispatch(getAllBrand());
      } else {
        toast.error(resultAction.payload?.message || "Thao tác thất bại");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) return;
    try {
      const resultAction = await dispatch(deleteBrand(id));
      if (deleteBrand.fulfilled.match(resultAction)) {
        toast.success("Xóa thương hiệu thành công");
        dispatch(getAllBrand());
      } else {
        toast.error(resultAction.payload?.message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi khi xóa thương hiệu");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thương hiệu</h1>
        <div className="flex gap-2">
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm thương hiệu
          </button>
          <button
            onClick={() => dispatch(getAllBrand())}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} /> Tải lại
          </button>
        </div>
      </div>

      {/* Ô tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên thương hiệu..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:w-80"
        />
      </div>

      {/* Bảng thương hiệu */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredBrands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy thương hiệu nào.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Tên thương hiệu</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-black-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredBrands.map((brand, idx) => (
                    <tr key={brand._id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{brand.title}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openModal("edit", brand)}
                            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition"
                            title="Sửa"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(brand._id)}
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 transition"
                            title="Xóa"
                          >
                            <Trash size={16} />
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

      {/* Modal thêm/sửa thương hiệu */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === "add" ? "Thêm thương hiệu mới" : "Chỉnh sửa thương hiệu"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Tên thương hiệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentBrand.title}
                  onChange={(e) => {
                    setCurrentBrand({ ...currentBrand, title: e.target.value });
                    setError("");
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: Samsung, Apple, Xiaomi..."
                  autoFocus
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  {modalMode === "add" ? "Thêm thương hiệu" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;