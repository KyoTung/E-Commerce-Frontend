import React, { useEffect, useState } from "react";
import { PencilLine, Trash, Plus, RefreshCw, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";

import {
  createCategory,
  updateCategory,
  getAllCategory,
  deleteCategory,
} from "../../../features/adminSlice/category/categorySlice";

const Categories = () => {
  const dispatch = useDispatch();
  
  const { categories, loading } = useSelector((state) => state.categoryAdmin);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [currentCate, setCurrentCate] = useState({ id: null, title: "" });

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);


  const filteredCategories = categories.filter((cate) =>
    cate.title?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (mode, category = null) => {
    setModalMode(mode);
    if (mode === "edit" && category) {
      setCurrentCate({ id: category._id || category.id, title: category.title });
    } else {
      setCurrentCate({ id: null, title: "" }); 
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCate({ id: null, title: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCate.title.trim()) {
      toast.warning("Please enter category title");
      return;
    }

    try {
      let resultAction;
      
      if (modalMode === "add") {
        // --- ADD ---
        resultAction = await dispatch(createCategory({ title: currentCate.title }));
      } else {
        // --- EDIT ---
        resultAction = await dispatch(
          updateCategory({
            categoryId: currentCate.id,
            categoryData: { title: currentCate.title },
          })
        );
      }

      if (
        createCategory.fulfilled.match(resultAction) ||
        updateCategory.fulfilled.match(resultAction)
      ) {
        toast.success(
          modalMode === "add"
            ? "Category created successfully"
            : "Category updated successfully"
        );
        closeModal();
        dispatch(getAllCategory());
      } else {
        toast.error(resultAction.payload?.message || "Action failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // 5. Xử lý Delete
  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      const resultAction = await dispatch(deleteCategory(id));
      if (deleteCategory.fulfilled.match(resultAction)) {
        toast.success("Category deleted successfully");
        dispatch(getAllCategory());
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete category");
      }
    } catch {
      toast.error("Error deleting category");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Product Categories</h1>
      
      <div className="card">
        {/* --- TOOLBAR (Add, Refresh, Search) --- */}
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
              onClick={() => dispatch(getAllCategory())}
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
              placeholder="Search categories..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* --- TABLE CONTENT --- */}
        {loading ? (
          <div className="p-12">
            <Loading className="flex items-center justify-center" />
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative w-full overflow-x-auto">
              {filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">
                  No categories found.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="px-6 py-3 w-16 text-center">#</th>
                      <th className="px-6 py-3">Category Name</th>
                      <th className="px-6 py-3 w-40 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCategories.map((cate, index) => (
                      <tr key={cate._id || cate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-center text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {cate.title}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => openModal("edit", cate)}
                              className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                              title="Edit"
                            >
                              <PencilLine size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(cate._id || cate.id)}
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

      {/* --- REUSABLE MODAL (Dùng chung cho Add và Edit) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl transform transition-all scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-800">
                {modalMode === "add" ? "Add New Category" : "Edit Category"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentCate.title}
                  onChange={(e) =>
                    setCurrentCate({ ...currentCate, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter category title"
                  autoFocus
                />
              </div>

              {/* Modal Footer */}
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

export default Categories;