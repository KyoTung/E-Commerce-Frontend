import React, { useEffect, useState } from "react";
import { topProducts } from "@/constants";
import { PencilLine, Trash } from "lucide-react";
import Axios from "../../../Axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  createCategory,
  updateCategory,
  getCategory,
  getAllCategory,
  deleteCategory,
} from "../../../features/adminSlice/category/categorySlice";

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const { categories, loading, error } = useSelector(
    (state) => state.categoryAdmin
  );
  const [editingCategory, setEditingCategory] = useState(null);

  const [editCate, setEditCate] = useState({ title: "" });
  const [newCate, setNewCate] = useState({ title: "" });

  useEffect(() => {
    getCate();
  }, []);

  // get all categories
  const getCate = () => {
    dispatch(getAllCategory({ token: currentUser.token }));
  };

  // added category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCate.title.trim()) {
      toast.error("Category title is required");
      return;
    }
    try {
      const resultAction = await dispatch(
        createCategory({ categoryData: newCate, token: currentUser.token })
      );

      if (createCategory.fulfilled.match(resultAction)) {
        toast.success("Category created successfully");
        setNewCate({ title: "" });
        getCate();
      } else {
        toast.error("Failed to create category");
        toast.error(resultAction.payload || "Error: Create category failed!");
      }
    } catch (error) {
      toast.error("Error: Create category failed!");
    }
  };

  // edit category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        updateCategory({
          categoryId: editingCategory._id,
          categoryData: editCate,
          token: currentUser.token,
        })
      );
      if (updateCategory.fulfilled.match(resultAction)) {
        toast.success("Category updated successfully");
        setEditingCategory(null);
        getCate();
      } else {
        toast.error("Failed to update category");
        toast.error(resultAction.payload || "Error: Update category failed!");
      }
    } catch {
      toast.error("Error updating category");
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setEditCate(category);
  };

  // delete category
  const onDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category ?")) {
      return;
    }
    try {
      const resultAction = await dispatch(
        deleteCategory({ categoryId: categoryId, token: currentUser.token })
      );
      if (deleteCategory.fulfilled.match(resultAction)) {
        toast.success("Category deleted successfully");
        getCate();
      } else {
        toast.error("Failed to delete category");
        toast.error(resultAction.payload || "Error: Delete category failed!");
      }
    } catch {
      toast.error("Error deleting category");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Categories</h1>
      <div className="card">
        <div className="flex">
          <form className="flex" onSubmit={handleSubmit}>
            <div className="mr-2">
              <input
                type="text"
                id="title"
                value={newCate.title}
                onChange={(e) =>
                  setNewCate({ ...newCate, title: e.target.value })
                }
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                placeholder="Enter new category title"
              />
            </div>
            <button
              type="submit"
              class="mr-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Add new
            </button>
          </form>
          <button
            onClick={() => getCate()}
            class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          >
            Refresh
          </button>
        </div>

        <div className="card-header"></div>
        {loading ? (
          <Loading className="flex items-center justify-center text-center" />
        ) : (
          <div className="card-body p-0">
            <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">#</th>
                    <th className="table-head">Name</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>

                <tbody className="table-body">
                  {categories.map((cate, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{(index += 1)}</td>
                      <td className="table-cell">
                        <div className="flex w-max gap-x-4">
                          <div className="flex flex-col">
                            <p>{cate.title}</p>
                            {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-x-4">
                          <button
                            onClick={() => startEdit(cate)}
                            className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-800"
                          >
                            <PencilLine size={20} />
                          </button>
                          <button
                            onClick={(e) => onDelete(cate._id)}
                            className="text-red-500 hover:text-red-800"
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Edit category popup menu */}
      {editingCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Edit Category</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editCate.title}
                  onChange={(e) =>
                    setEditCate({ ...editCate, title: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category title"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Save Changes
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
