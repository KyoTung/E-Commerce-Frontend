import React, { useEffect, useState } from "react";
import { PencilLine, Trash, Plus, RefreshCw, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  createBlogCategory,
  updateBlogCategory,
  getAllBlogCategory,
  deleteBlogCategory,
} from "../../../features/adminSlice/blogCategory/blogCategorySlice";
import Loading from "../../../components/Loading";

const BlogCategory = () => {
  const [editingBlogCategory, setEditingBlogCategory] = useState(null);
  const [editBlogCategory, setEditBlogCategory] = useState({ title: "" });
  const [newBlogCategory, setNewBlogCategory] = useState({ title: "" });
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const { blogCategories, loading } = useSelector(
    (state) => state.blogCategoryAdmin
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBlogCategory());
  }, [dispatch]);

  const filteredCategories = search.trim()
    ? blogCategories.filter((cat) =>
        cat.title?.toLowerCase().includes(search.toLowerCase())
      )
    : blogCategories;

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!newBlogCategory.title.trim()) {
      toast.warning("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      const resultAction = await dispatch(createBlogCategory(newBlogCategory));
      if (createBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Thêm danh mục thành công");
        setNewBlogCategory({ title: "" });
        setShowAddModal(false);
        dispatch(getAllBlogCategory());
      } else {
        toast.error(resultAction.payload?.message || "Thêm thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editBlogCategory.title.trim()) {
      toast.warning("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      const resultAction = await dispatch(
        updateBlogCategory({
          id: editingBlogCategory._id || editingBlogCategory.id,
          blogCategoryData: editBlogCategory,
        })
      );
      if (updateBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Cập nhật thành công");
        setEditingBlogCategory(null);
        dispatch(getAllBlogCategory());
      } else {
        toast.error(resultAction.payload?.message || "Cập nhật thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  const startEdit = (blogCategory) => {
    setEditingBlogCategory(blogCategory);
    setEditBlogCategory({ title: blogCategory.title });
  };

  const onDelete = async (blogCategory) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      const id = blogCategory._id || blogCategory.id;
      const resultAction = await dispatch(deleteBlogCategory(id));
      if (deleteBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Xóa thành công");
        dispatch(getAllBlogCategory());
      } else {
        toast.error(resultAction.payload?.message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục bài viết</h1>
      </div>

      {/* Thanh công cụ */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewBlogCategory({ title: "" });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm danh mục
          </button>
          <button
            onClick={() => dispatch(getAllBlogCategory())}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} /> Tải lại
          </button>
        </div>
        <div className="w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên danh mục..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Bảng */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy danh mục nào.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Tên danh mục</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-black-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredCategories.map((cat, idx) => (
                    <tr key={cat._id || cat.id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{cat.title}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => startEdit(cat)}
                            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition"
                            title="Sửa"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(cat)}
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

      {/* Modal thêm mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-xl font-bold text-gray-800">Thêm danh mục bài viết</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-5">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBlogCategory.title}
                  onChange={(e) => setNewBlogCategory({ title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: Tin tức, Khuyến mãi, Sự kiện..."
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Thêm danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {editingBlogCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa danh mục</h3>
              <button onClick={() => setEditingBlogCategory(null)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editBlogCategory.title}
                  onChange={(e) =>
                    setEditBlogCategory({ ...editBlogCategory, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="VD: Tin tức, Khuyến mãi..."
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBlogCategory(null)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCategory;