// src/components/guest/BlogsSection.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBlogs } from "../../features/guestSlice/blog/blogSlice";

const BlogsSection = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  // Lấy 4 bài mới nhất (backend đã sort -createdAt)
  const latestBlogs = blogs?.slice(0, 4) || [];

  const stripHTML = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  if (loading) {
    return (
      <div className="px-4 py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl text-center">
          Đang tải bài viết...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            TIN TỨC & BLOG
          </h2>
          <div className="w-20 h-1 bg-[#d0011b] mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestBlogs.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden rounded-lg mb-4 bg-white">
                <img
                  src={
                    post.images?.[0]?.url ||
                    "https://via.placeholder.com/400x200"
                  }
                  alt={post.title}
                  className="h-full w-full object-contain  transition-transform duration-500"
                />

                <div className="absolute top-4 left-4">
                  <span className="bg-[#d0011b] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category?.title || "Tin tức"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <FaUser className="mr-1" />
                    <span>{post.author || "Admin"}</span>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-[#d0011b] transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {stripHTML(post.description || post.content)}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {post.readTime || "3 phút đọc"}
                  </span>
                  <Link
                    to={`/blog-detail/${post._id}`}
                    className="flex items-center text-[#d0011b] font-semibold text-sm hover:underline"
                  >
                    Đọc thêm
                    <FaArrowRight className="ml-2" size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blogs"
            className="inline-flex items-center bg-[#d0011b] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#b00117] transition-colors duration-300"
          >
            Xem tất cả bài viết
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogsSection;
