import React, { useEffect, useState } from "react";
import { PencilLine, Trash, Plus, RefreshCw, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";

import {
  createColor,
  updateColor,
  deleteColor,
  getAllColor,
} from "../../../features/adminSlice/color/colorSlice";

// Ánh xạ màu tiếng Việt sang mã màu
const colorMap = {
  "đỏ": "#ef4444",
  "xanh lá": "#22c55e",
  "xanh lá cây": "#22c55e",
  "xanh dương": "#3b82f6",
  "xanh nước biển": "#3b82f6",
  "vàng": "#eab308",
  "đen": "#1f2937",
  "trắng": "#f9fafb",
  "cam": "#f97316",
  "tím": "#a855f7",
  "hồng": "#ec4899",
  "xám": "#9ca3af",
  "ghi": "#9ca3af",
  "nâu": "#8b4513",
};

const getValidColor = (colorTitle) => {
  if (!colorTitle) return "#e5e7eb";
  const normalized = colorTitle.trim().toLowerCase();
  return colorMap[normalized] || "#cbd5e1";
};

const Colors = () => {
  const dispatch = useDispatch();
  const { colors, loading } = useSelector((state) => state.colorAdmin);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentColor, setCurrentColor] = useState({ id: null, title: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getAllColor());
  }, [dispatch]);

  const filteredColors = colors.filter((color) =>
    color.title?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (mode, color = null) => {
    setError("");
    setModalMode(mode);
    if (mode === "edit" && color) {
      setCurrentColor({ id: color._id || color.id, title: color.title });
    } else {
      setCurrentColor({ id: null, title: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentColor({ id: null, title: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = currentColor.title.trim();
    if (!title) {
      toast.warning("Vui lòng nhập tên màu");
      return;
    }

    const duplicate = colors.some(
      (c) =>
        c.title.toLowerCase() === title.toLowerCase() &&
        (modalMode === "add" || c._id !== currentColor.id)
    );
    if (duplicate) {
      setError("Tên màu đã tồn tại");
      return;
    }
    setError("");

    try {
      let resultAction;
      if (modalMode === "add") {
        resultAction = await dispatch(createColor({ title }));
      } else {
        resultAction = await dispatch(
          updateColor({ colorId: currentColor.id, colorData: { title } })
        );
      }

      if (
        createColor.fulfilled.match(resultAction) ||
        updateColor.fulfilled.match(resultAction)
      ) {
        toast.success(modalMode === "add" ? "Thêm màu thành công" : "Cập nhật thành công");
        dispatch(getAllColor());
        closeModal();
      } else {
        toast.error(resultAction.payload?.message || "Thao tác thất bại");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa màu này?")) return;
    try {
      const resultAction = await dispatch(deleteColor(id));
      if (deleteColor.fulfilled.match(resultAction)) {
        toast.success("Xóa màu thành công");
        dispatch(getAllColor());
      } else {
        toast.error(resultAction.payload?.message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi khi xóa");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Quản lý màu sắc</h1>

      <div className="card">
        <div className="card-header flex flex-col md:flex-row items-center gap-4 py-4 px-6 border-b border-gray-100">
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => openModal("add")}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition w-full md:w-auto"
            >
              <Plus size={18} />
              Thêm mới
            </button>
            <button
              onClick={() => dispatch(getAllColor())}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              <RefreshCw size={18} />
              Làm mới
            </button>
          </div>

          <div className="w-full md:ml-auto md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm màu..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12">
            <Loading className="flex items-center justify-center" />
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative w-full overflow-x-auto">
              {filteredColors.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">
                  Không tìm thấy màu nào.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="px-6 py-3 w-16 text-center">#</th>
                      <th className="px-6 py-3">Tên màu</th>
                      <th className="px-6 py-3">Xem trước</th>
                      <th className="px-6 py-3 w-40 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredColors.map((color, index) => (
                      <tr key={color._id || color.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-center text-gray-400">{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{color.title}</td>
                        <td className="px-6 py-4">
                          <div
                            className="h-6 w-6 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: getValidColor(color.title) }}
                            title={color.title}
                          ></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => openModal("edit", color)}
                              className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                              title="Sửa"
                            >
                              <PencilLine size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(color._id || color.id)}
                              className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800 transition"
                              title="Xóa"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal chỉ có text input, không color picker */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl transform transition-all scale-100">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-800">
                {modalMode === "add" ? "Thêm màu mới" : "Chỉnh sửa màu"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tên màu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentColor.title}
                  onChange={(e) => {
                    setCurrentColor({ ...currentColor, title: e.target.value });
                    setError("");
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: Đỏ, Xanh dương, Vàng..."
                  autoFocus
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                <p className="mt-1 text-xs text-gray-400">
                  Hỗ trợ các tên: đỏ, xanh lá, xanh dương, vàng, đen, trắng, cam, tím, hồng, xám, nâu
                </p>
              </div>

              {/* Preview màu dựa trên tên */}
              <div className="mb-5 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div
                  className="h-8 w-8 rounded-full border shadow-sm"
                  style={{ backgroundColor: getValidColor(currentColor.title) }}
                />
                <span className="text-sm text-gray-600">
                  Màu hiển thị:{" "}
                  <span className="font-mono text-xs">{getValidColor(currentColor.title)}</span>
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 transition border border-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                >
                  {modalMode === "add" ? "Thêm" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Colors;