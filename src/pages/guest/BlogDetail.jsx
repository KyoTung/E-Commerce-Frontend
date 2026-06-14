// src/pages/guest/BlogDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaUser,
  FaThumbsUp,
  FaThumbsDown,
  FaTags,
  FaFire,
  FaSearch,
} from "react-icons/fa";
import RenderDocument from "../../components/RenderDocument";
import {
  fetchBlogById,
  likeBlog,
  dislikeBlog,
  fetchAllBlogs,
} from "../../features/guestSlice/blog/blogSlice";
import { fetchAllBlogCategories } from "../../features/guestSlice/blogCategory/blogCategorySlice";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentBlog, loading, blogs } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.blogCategory);
  const { user } = useSelector((state) => state.auth);

  const [localLikes, setLocalLikes] = useState(0);
  const [localDislikes, setLocalDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy bài viết hiện tại
  useEffect(() => {
    if (id) dispatch(fetchBlogById(id));
  }, [dispatch, id]);

  console.log("blog id", id);

  // Lấy danh sách blog và danh mục cho sidebar (nếu chưa có)
  useEffect(() => {
    if (!blogs) dispatch(fetchAllBlogs());
    if (!categories) dispatch(fetchAllBlogCategories());
  }, [dispatch, blogs, categories]);

  // Cập nhật like/dislike local
  useEffect(() => {
    if (currentBlog) {
      setLocalLikes(currentBlog.likes?.length || 0);
      setLocalDislikes(currentBlog.dislikes?.length || 0);
      if (user) {
        setUserLiked(currentBlog.likes?.some((like) => like._id === user._id));
        setUserDisliked(
          currentBlog.dislikes?.some((dislike) => dislike._id === user._id),
        );
      }
    }
  }, [currentBlog, user]);

  const handleLike = async () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để like bài viết");
      navigate("/login");
      return;
    }
    const result = await dispatch(likeBlog(id));
    if (result.payload) {
      if (userDisliked) setLocalDislikes((prev) => prev - 1);
      setUserLiked(!userLiked);
      setLocalLikes((prev) => (userLiked ? prev - 1 : prev + 1));
      setUserDisliked(false);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để dislike bài viết");
      navigate("/login");
      return;
    }
    const result = await dispatch(dislikeBlog(id));
    if (result.payload) {
      if (userLiked) setLocalLikes((prev) => prev - 1);
      setUserDisliked(!userDisliked);
      setLocalDislikes((prev) => (userDisliked ? prev - 1 : prev + 1));
      setUserLiked(false);
    }
  };

  // Bài viết nổi bật (top 4 theo lượt xem)
  const popularPosts = useMemo(() => {
    if (!blogs) return [];
    return [...blogs]
      .sort((a, b) => (b.numViews || 0) - (a.numViews || 0))
      .slice(0, 4);
  }, [blogs]);

  // Thẻ của bài viết hiện tại
  const tags = currentBlog?.tags || [];

  if (loading || !currentBlog) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar trái */}
          <div className="lg:w-1/4 space-y-6">
            {/* Tìm kiếm */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tìm kiếm
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Danh mục */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaTags className="mr-2 text-red-600" />
                Danh mục
              </h3>
              <ul className="space-y-2">
                {categories &&
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <Link
                        to={`/blogs?category=${encodeURIComponent(cat.title)}`}
                        className="flex items-center justify-between py-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <span>{cat.title}</span>
                        
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Thẻ (tags) của bài viết */}
            {tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thẻ của bài viết
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog/tag/${tag.toLowerCase()}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nội dung chính */}
          <div className="lg:w-2/4">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {currentBlog.images && currentBlog.images.length > 0 && (
                <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden rounded-lg mb-4 bg-white">
                  <img
                    src={currentBlog.images[0].url}
                    alt={currentBlog.title}
                    
                    className="h-full w-full object-contain  transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaCalendarAlt className="mr-1" />
                  <span>
                    {new Date(currentBlog.createdAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </span>
                  <span className="mx-2">•</span>
                  <FaUser className="mr-1" />
                  <span>{currentBlog.author || "Admin"}</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentBlog.title}
                </h1>

                <div className="prose max-w-none">
                  <RenderDocument
                    content={currentBlog.content || currentBlog.description}
                  />
                </div>

                <div className="flex items-center gap-6 mt-8 pt-6 border-t">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      userLiked
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FaThumbsUp /> {localLikes}
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      userDisliked
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FaThumbsDown /> {localDislikes}
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar phải */}
          <div className="lg:w-1/4 space-y-6">
            {/* Bài viết nổi bật */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaFire className="mr-2 text-red-600" />
                Bài viết nổi bật
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post._id}`}
                    className="flex items-start space-x-3 group"
                  >
                    <img
                      src={
                        post.images?.[0]?.url ||
                        "https://via.placeholder.com/60"
                      }
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <FaCalendarAlt className="mr-1" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Đăng ký nhận tin */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Đăng ký nhận tin</h3>
              <p className="text-red-100 text-sm mb-4">
                Nhận thông tin mới nhất về sản phẩm và khuyến mãi
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-3 py-2 rounded text-gray-900 text-sm focus:outline-none"
                />
                <button className="w-full bg-white text-red-600 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Đăng ký ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
