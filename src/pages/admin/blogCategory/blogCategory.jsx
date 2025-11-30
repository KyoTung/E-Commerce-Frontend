import React, { useEffect, useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import Axios from "../../../Axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  createBlogCategory,
  updateBlogCategory,
  getBlogCategory,
  getAllBlogCategory,
  deleteBlogCategory,
} from "../../../features/adminSlice/blogCategory/blogCategorySlice";

const BlogCategory = () => {
  const [editingBlogCategory, setEditingBlogCategory] = useState(null);
  const [editBlogCategory, setEditBlogCategory] = useState({ title: "" });
  const [newBlogCategory, setNewBlogCategory] = useState({ title: "" });

  const currentUser = useSelector((state) => state.auth.user);
  const { blogCategories, loading, error } = useSelector((state) => state.blogCategoryAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getBlogCategories();
  }, [dispatch, currentUser.accessToken]);

  // get all blog categories
  const getBlogCategories = () => {
    dispatch(getAllBlogCategory({ token: currentUser.token }));
  };

  // added blog category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBlogCategory.title.trim()) {
      toast.error("Blog category title is required");
      return;
    }
    try {
      const resultAction = await dispatch(
        createBlogCategory({ blogCategoryData: newBlogCategory, token: currentUser.token })
      );

      if (createBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Blog category created successfully");
        setNewBlogCategory({ title: "" });
        getBlogCategories();
      } else {
        toast.error("Failed to create blog category");
        toast.error(resultAction.payload || "Error: Create blog category failed!");
      }
    } catch (error) {
      toast.error("Error: Create blog category failed!");
    }
  };

  // edit category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        updateBlogCategory({
          blogCategoryId: editingBlogCategory._id || editBlogCategory.id,
          blogCategoryData: editBlogCategory,
          token: currentUser.token,
        })
      );
      if (updateBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Blog category updated successfully");
        setEditingBlogCategory(null);
        getBlogCategories();
      } else {
        toast.error("Failed to update blog category");
        toast.error(resultAction.payload || "Error: Update blog category failed!");
      }
    } catch (error) {
      toast.error("Error updating blog category");
    }
  };

  const startEdit = (blogCategory) => {
    setEditingBlogCategory(blogCategory);
    setEditBlogCategory(blogCategory);
  };

  // delete blog category
  const onDelete = async (blogCategory) => {
    if (!window.confirm("Are you sure you want to delete this blog category ?")) {
      return;
    }
    try {
      const resultAction = await dispatch(
        deleteBlogCategory({
          blogCategoryId: blogCategory._id || blogCategory.id,
          token: currentUser.token,
        })
      );
      if (deleteBlogCategory.fulfilled.match(resultAction)) {
        toast.success("Blog category deleted successfully");
        getBlogCategories();
      } else {
        toast.error("Failed to delete blog category");
        toast.error(resultAction.payload || "Error: Delete blog category failed!");
      }
    } catch {
      toast.error("Error deleting blog category");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Blog Categories</h1>
      <div className="card">
        <div className="flex">
          <form className="flex" onSubmit={handleSubmit}>
            <div className="mr-2">
              <input
                type="text"
                id="name"
                value={newBlogCategory.title}
                onChange={(e) =>
                  setNewBlogCategory({ ...newBlogCategory, title: e.target.value })
                }
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                placeholder="Enter new blog category title"
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
            onClick={() => getBlogCategories()}
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
                  {blogCategories.map((blogCategory, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{(index += 1)}</td>
                      <td className="table-cell">
                        <div className="flex w-max gap-x-4">
                          <div className="flex flex-col">
                            <p>{brand.title}</p>
                            {/* <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p> */}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-x-4">
                          <button
                            onClick={() => startEdit(blogCategory)}
                            className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-800"
                          >
                            <PencilLine size={20} />
                          </button>
                          <button
                            onClick={(e) => onDelete(blogCategory)}
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
      {/* Edit brand popup menu */}
      {editingBrand && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Edit Blog Category</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editBlogCategory.title}
                  onChange={(e) =>
                    setEditBlogCategory({ ...editBlogCategory, title: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Blog category title"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlogCategory(null)}
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

export default BlogCategory;
