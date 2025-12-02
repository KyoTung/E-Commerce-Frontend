import React, { useEffect, useState } from "react";
import Axios from "../../../Axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PencilLine, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBlog,
  deleteBlog,
} from "../../../features/adminSlice/blog/blogSlice";

const Blog = () => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Lấy currentUser từ Redux state
  const currentUser = useSelector((state) => state.auth.user);
  const { blogs, loading } = useSelector((state) => state.blogAdmin);

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = () => {
    // Thêm token nếu API yêu cầu
    if (currentUser?.token) {
      dispatch(getAllBlog({ token: currentUser.token }));
    } else {
      toast.error("User not authenticated");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    
    // Kiểm tra xem có currentUser và token không
    if (!currentUser || !currentUser.token) {
      toast.error("User not authenticated");
      return;
    }
    
    try {
      const resultAction = await dispatch(deleteBlog({ 
        blogId: id, 
        token: currentUser.token 
      }));

      if (deleteBlog.fulfilled.match(resultAction)) {
        toast.success("Blog deleted successfully");
        // Làm mới danh sách blog sau khi xóa
        getBlogs();
      } else {
        // Hiển thị lỗi từ payload hoặc error
        const errorMessage = resultAction.payload?.message || 
                            resultAction.error?.message || 
                            "Failed to delete Blog";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Delete blog error:", err);
      toast.error(err.response?.data?.message || "Failed to delete Blog");
    }
  };

  // Lọc blog theo tìm kiếm
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    (blog.author && blog.author.toLowerCase().includes(search.toLowerCase())) ||
    (blog.category && blog.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Blogs</h1>
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <Link
            to="/admin/new-blog"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Add new
          </Link>
          <button
            onClick={() => getBlogs()}
            className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          >
            Refresh
          </button>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author or category"
            className="ml-auto rounded border px-3 py-2 focus:outline-none"
          />
        </div>
        {loading ? (
          <Loading className="flex items-center justify-center" />
        ) : (
          <div className="card-body p-0">
            {filteredBlogs.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-gray-500">No blogs found</p>
              </div>
            ) : (
              <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                <table className="table">
                  <thead className="table-header">
                    <tr className="table-row">
                      <th className="table-head">#</th>
                      <th className="table-head">Image</th>
                      <th className="table-head">Title</th>
                      <th className="table-head">Author</th>
                      <th className="table-head">Category</th>
                      <th className="table-head">Views</th>
                      <th className="table-head">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {filteredBlogs.map((blog, index) => (
                      <tr key={blog._id || blog.id} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">
                          <div className="flex w-max gap-x-4">
                            {blog.images?.[0]?.url ? (
                              <img
                                src={blog.images[0].url}
                                alt={blog.title}
                                className="w-35 h-40 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-35 h-40 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="table-cell">{blog.title}</td>
                        <td className="table-cell">{blog.author || "N/A"}</td>
                        <td className="table-cell">{blog.category || "N/A"}</td>
                        <td className="table-cell">{blog.numViews || 0}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-x-4">
                            <button
                              onClick={() =>
                                navigate(`/admin/edit-blog/${blog._id || blog.id}`)
                              }
                              className="text-blue-500 dark:text-blue-600 hover:text-blue-700"
                              title="Edit"
                            >
                              <PencilLine size={20} />
                            </button>
                            <button
                              onClick={() => onDelete(blog._id || blog.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;