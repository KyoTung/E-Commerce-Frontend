import React, { useEffect, useState } from "react";
import { PencilLine, Trash } from "lucide-react";
// import Axios from "../../../Axios"; // Đã xóa import thừa
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

  const { blogCategories, loading } = useSelector(
    (state) => state.blogCategoryAdmin
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBlogCategory());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBlogCategory.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const resultAction = await dispatch(createBlogCategory(newBlogCategory));

      if (createBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Created successfully");
        setNewBlogCategory({ title: "" });
      } else {
        const errorMsg = resultAction.payload?.message || "Creation failed";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        updateBlogCategory({
          id: editingBlogCategory._id || editingBlogCategory.id,
          blogCategoryData: editBlogCategory,
        })
      );

      if (updateBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Updated successfully");
        dispatch(getAllBlogCategory());
        setEditingBlogCategory(null);
      } else {
        const errorMsg = resultAction.payload?.message || "Update failed";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const startEdit = (blogCategory) => {
    setEditingBlogCategory(blogCategory);
    setEditBlogCategory(blogCategory);
  };

  const onDelete = async (blogCategory) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      const id = blogCategory._id || blogCategory.id;
      const resultAction = await dispatch(deleteBlogCategory(id));

      if (deleteBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Deleted successfully");
        dispatch(getAllBlogCategory());
      } else {
        const errorMsg = resultAction.payload?.message || "Delete failed";
        toast.error(errorMsg);
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Blog Categories</h1>
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end md:items-center">
          <form className="flex w-full md:w-auto gap-2" onSubmit={handleSubmit}>
            <div className="flex-1 md:w-80">
              <input
                type="text"
                value={newBlogCategory.title}
                onChange={(e) =>
                  setNewBlogCategory({
                    ...newBlogCategory,
                    title: e.target.value,
                  })
                }
                className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new category title..."
              />
            </div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 transition"
              disabled={loading}
            >
              Add
            </button>
          </form>

          <button
            onClick={() => dispatch(getAllBlogCategory())}
            className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 transition ml-auto md:ml-0"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8">
            <Loading className="flex items-center justify-center" />
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative w-full overflow-x-auto">
              {!blogCategories || blogCategories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No categories found.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="px-6 py-3 w-16">#</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3 w-32 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {blogCategories.map((blogCategory, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {blogCategory.title}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => startEdit(blogCategory)}
                              className="text-blue-600 hover:text-blue-900 transition"
                              title="Edit"
                            >
                              <PencilLine size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(blogCategory)}
                              className="text-red-600 hover:text-red-900 transition"
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

      {editingBlogCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Edit Category
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editBlogCategory.title}
                  onChange={(e) =>
                    setEditBlogCategory({
                      ...editBlogCategory,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category title"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlogCategory(null)}
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                >
                  Save
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
