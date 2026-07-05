import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PencilLine, Trash, Plus, RefreshCw, ImageOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBlog,
  deleteBlog,
} from "../../../features/adminSlice/blog/blogSlice";

const Blog = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { blogs = [], loading } = useSelector((state) => state.blogAdmin) || {};

  useEffect(() => {
    dispatch(getAllBlog());
  }, [dispatch]);

  const onDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      const resultAction = await dispatch(deleteBlog(id));
      if (deleteBlog.fulfilled.match(resultAction)) {
        toast.success("Xóa bài viết thành công");
        dispatch(getAllBlog());
      } else {
        toast.error(resultAction.payload?.message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  // const filteredBlogs = blogs.filter((blog) => {
  //   const searchTerm = search.toLowerCase();
  //   const titleMatch = blog.title?.toLowerCase().includes(searchTerm);
  //   const authorMatch = blog.author?.toLowerCase().includes(searchTerm);
  //   const catMatch = blog.category?.toLowerCase().includes(searchTerm);
  //   return titleMatch || authorMatch || catMatch;
  // });

  const filteredBlogs = (blogs || []).filter((blog) => {
  const searchTerm = search.toLowerCase();
  const titleMatch = blog.title?.toLowerCase().includes(searchTerm);
  const authorMatch = blog.author?.toLowerCase().includes(searchTerm);
  const catMatch = blog.category?.toLowerCase().includes(searchTerm);
  return titleMatch || authorMatch || catMatch;
});

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/add-blog"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm bài viết
          </Link>
          <button
            onClick={() => dispatch(getAllBlog())}
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
          placeholder="Tìm kiếm theo tiêu đề, tác giả hoặc danh mục..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:w-80"
        />
      </div>

      {/* Bảng bài viết */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredBlogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Không tìm thấy bài viết nào.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Hình ảnh</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Tiêu đề</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Tác giả</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Danh mục</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Lượt xem</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-black-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredBlogs.map((blog, idx) => (
                    <tr key={blog._id || blog.id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm transition-all hover:shadow-md">
                          {blog.images?.[0]?.url ? (
                            <img
                              src={blog.images[0].url}
                              alt={blog.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "";
                                e.target.parentElement.innerHTML = '<div class="flex h-full w-full items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off"><path d="M10.5 5.5 14 9"/><path d="M21 21H3.5L3 20.5"/><path d="M6.5 6.5 3 10"/><path d="M12 12 9 15"/><path d="M18 18 15 21"/><path d="M18 6 21 9"/><path d="M9 9 6 6"/><path d="M21 15 18 18"/><path d="M12 3v3"/><path d="M3 9h3"/><path d="M15 18h3"/><path d="M18 15h3"/></svg></div>';
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <ImageOff size={24} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-[200px]" title={blog.title}>
                        {blog.title}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{blog.author || "Admin"}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {blog.category || "Chung"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{blog.numViews || 0}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => navigate(`/admin/edit-blog/${blog._id || blog.id}`)}
                            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition"
                            title="Sửa"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(blog._id || blog.id)}
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
    </div>
  );
};

export default Blog;