import React, { useEffect, useState } from "react";
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

  const { blogs, loading } = useSelector((state) => state.blogAdmin);

  useEffect(() => {
    
    dispatch(getAllBlog());
  }, [dispatch]);

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const resultAction = await dispatch(deleteBlog(id));

      if (deleteBlog.fulfilled.match(resultAction)) {
        toast.success("Blog deleted successfully");

      } else {
       
        const errorMsg = resultAction.payload?.message || "Failed to delete Blog";
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  
  const filteredBlogs = blogs.filter((blog) => {
    const searchTerm = search.toLowerCase();
    const titleMatch = blog.title?.toLowerCase().includes(searchTerm);
    const authorMatch = blog.author?.toLowerCase().includes(searchTerm);
    const catMatch = blog.category?.toLowerCase().includes(searchTerm);
    
    return titleMatch || authorMatch || catMatch;
  });

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Blogs Management</h1>
      
      <div className="card">
        <div className="card-header flex flex-col md:flex-row items-center gap-4">
          <div className="flex gap-2">
            <Link
              to="/admin/add-blog" 
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 transition"
            >
              Add New
            </Link>
           
            <button
              onClick={() => dispatch(getAllBlog())}
              className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 transition"
            >
              Refresh
            </button>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full md:w-auto md:ml-auto rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="p-8">
             <Loading className="flex items-center justify-center" />
          </div>
        ) : (
          <div className="card-body p-0">
            {filteredBlogs.length === 0 ? (
              <div className="flex h-32 items-center justify-center bg-gray-50">
                <p className="text-gray-500 italic">No blogs found matching your criteria.</p>
              </div>
            ) : (
              <div className="relative w-full overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="px-6 py-3">#</th>
                      <th className="px-6 py-3">Image</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Author</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Views</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredBlogs.map((blog, index) => (
                      <tr key={blog._id || blog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="h-16 w-24 overflow-hidden rounded-lg border bg-gray-100">
                            {blog.images?.[0]?.url ? (
                              <img
                                src={blog.images[0].url}
                                alt={blog.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                No Img
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[200px]" title={blog.title}>
                          {blog.title}
                        </td>
                        <td className="px-6 py-4">{blog.author || "Admin"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {blog.category || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4">{blog.numViews || 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => navigate(`/admin/edit-blog/${blog._id || blog.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <PencilLine size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(blog._id || blog.id)}
                              className="text-red-600 hover:text-red-900"
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;