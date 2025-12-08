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

const Colors = () => {
  const dispatch = useDispatch();
  
  // Redux State
  const { colors, loading } = useSelector((state) => state.colorAdmin);

  // Local State
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [currentColor, setCurrentColor] = useState({ id: null, title: "" });

  // 1. Fetch Data
  useEffect(() => {
    dispatch(getAllColor());
  }, [dispatch]);

  // 2. Client-side Search
  const filteredColors = colors.filter((color) =>
    color.title?.toLowerCase().includes(search.toLowerCase())
  );

  // 3. Modal Handlers
  const openModal = (mode, color = null) => {
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
  };

  // 4. Submit Handler (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentColor.title.trim()) {
      toast.warning("Color title is required");
      return;
    }

    try {
      let resultAction;

      if (modalMode === "add") {
        // --- CREATE ---
        resultAction = await dispatch(createColor({ title: currentColor.title }));
      } else {
        // --- UPDATE ---
        resultAction = await dispatch(
          updateColor({
            colorId: currentColor.id,
            colorData: { title: currentColor.title },
          })
        );
      }

      if (
        createColor.fulfilled.match(resultAction) ||
        updateColor.fulfilled.match(resultAction)
      ) {
        toast.success(
          modalMode === "add"
            ? "Color created successfully"
            : "Color updated successfully"
        );
        dispatch(getAllColor());
        closeModal();
      } else {
        toast.error(resultAction.payload?.message || "Action failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // 5. Delete Handler
  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this color?")) {
      return;
    }
    try {
      const resultAction = await dispatch(deleteColor(id));
      if (deleteColor.fulfilled.match(resultAction)) {
        toast.success("Color deleted successfully");
        dispatch(getAllColor());
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete color");
      }
    } catch {
      toast.error("Error deleting color");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Colors Management</h1>

      <div className="card">
        {/* --- TOOLBAR --- */}
        <div className="card-header flex flex-col md:flex-row items-center gap-4 py-4 px-6 border-b border-gray-100">
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => openModal("add")}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition w-full md:w-auto"
            >
              <Plus size={18} />
              Add New
            </button>
            <button
              onClick={() => dispatch(getAllColor())}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          <div className="w-full md:ml-auto md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colors..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* --- TABLE --- */}
        {loading ? (
          <div className="p-12">
            <Loading className="flex items-center justify-center" />
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative w-full overflow-x-auto">
              {filteredColors.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">
                  No colors found.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="px-6 py-3 w-16 text-center">#</th>
                      <th className="px-6 py-3">Color Name</th>
                      <th className="px-6 py-3">Preview</th>
                      <th className="px-6 py-3 w-40 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredColors.map((color, index) => (
                      <tr
                        key={color._id || color.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-center text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {color.title}
                        </td>
                        <td className="px-6 py-4">
                          {/* Hiển thị mẫu màu nếu title là mã hex hợp lệ */}
                          <div
                            className="h-6 w-6 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: color.title }}
                            title={color.title}
                          ></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => openModal("edit", color)}
                              className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                              title="Edit"
                            >
                              <PencilLine size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(color._id || color.id)}
                              className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800 transition"
                              title="Delete"
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

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl transform transition-all scale-100">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-800">
                {modalMode === "add" ? "Add New Color" : "Edit Color"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Title / Hex Code <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentColor.title}
                    onChange={(e) =>
                      setCurrentColor({ ...currentColor, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Red or #ff0000"
                    autoFocus
                  />
                  {/* Color Picker helper */}
                  <input 
                    type="color" 
                    value={currentColor.title.startsWith('#') ? currentColor.title : '#000000'}
                    onChange={(e) => setCurrentColor({ ...currentColor, title: e.target.value })}
                    className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300 p-1"
                    title="Pick a color"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 transition border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                >
                  {modalMode === "add" ? "Create" : "Save Changes"}
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