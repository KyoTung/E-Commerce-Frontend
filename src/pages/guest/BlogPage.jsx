import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RenderDocument from "../../components/RenderDocument";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaChevronDown,
  FaFire,
  FaSearch,
  FaTags,
  FaClock,
} from "react-icons/fa";
import {
  fetchAllBlogs,
  resetBlogState,
} from "../../features/guestSlice/blog/blogSlice";
import { fetchAllBlogCategories } from "../../features/guestSlice/blogCategory/blogCategorySlice";
import Loading from "../../components/Loading";

const BlogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Lấy cả category và search từ URL xuống
  const categoryParam = queryParams.get("category");
  const searchParam = queryParams.get("search");

  const { blogs, loading, page, totalPages, total } = useSelector(
    (state) => state.blog,
  );
  const { categories } = useSelector((state) => state.blogCategory);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [inputSearch, setInputSearch] = useState(searchParam || ""); // Lưu chuỗi tạm thời đang gõ
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 1. Reset state khi mount component
  useEffect(() => {
    dispatch(resetBlogState());
    dispatch(fetchAllBlogCategories());
  }, [dispatch]);

  // 2. Kích hoạt gọi API khi danh mục hoặc từ khóa thay đổi
  useEffect(() => {
    const params = { page: 1, limit: 6 };
    if (selectedCategory) params.category = selectedCategory;
    if (searchTerm) params.search = searchTerm;

    dispatch(fetchAllBlogs(params));
    window.scrollTo(0, 0);
  }, [dispatch, selectedCategory, searchTerm]);

  // 3. Lắng nghe thay đổi URL để đồng bộ ngược lại State nội bộ (khi đi điều hướng lịch sử trang)
  useEffect(() => {
    setSelectedCategory(categoryParam || "");
    setSearchTerm(searchParam || "");
    setInputSearch(searchParam || "");
  }, [categoryParam, searchParam]);

  // 4. Xử lý khi nhấn nút Tìm kiếm hoặc Enter
  const handleSearch = () => {
    setSearchTerm(inputSearch);

    // Đẩy từ khóa lên URL để quản lý route đồng bộ
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (inputSearch) params.set("search", inputSearch);

    navigate(`/blogs?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCategoryClick = (categoryTitle) => {

    
    const params = new URLSearchParams();
    if (categoryTitle) params.set("category", categoryTitle);
    // Giữ lại từ khóa tìm kiếm cũ nếu muốn, hoặc xóa hẳn tùy nghiệp vụ
    if (searchTerm) params.set("search", searchTerm);

    navigate(`/blogs?${params.toString()}`);
    setSelectedCategory(categoryTitle);
  };

  const loadMore = () => {
    if (page >= totalPages) return;
    setIsLoadingMore(true);
    const params = { page: page + 1, limit: 6 };
    if (selectedCategory) params.category = selectedCategory;
    if (searchTerm) params.search = searchTerm;
    dispatch(fetchAllBlogs(params)).finally(() => setIsLoadingMore(false));
  };

  const popularPosts = [...blogs]
    .sort((a, b) => (b.numViews || 0) - (a.numViews || 0))
    .slice(0, 4);

  const allTags = Array.from(
    new Set(blogs.flatMap((blog) => blog.tags || [])),
  ).slice(0, 10);

  if (loading && blogs.length === 0) return <Loading />;

  const hasMore = page < totalPages;

  const stripHTML = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TIN TỨC & BLOG
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất về công nghệ, đánh giá sản phẩm và
            mẹo sử dụng điện thoại hiệu quả
          </p>
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Search Widget */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tìm kiếm
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-red-600"
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaTags className="mr-2 text-red-600" /> Danh mục
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryClick("")}
                    className={`w-full flex items-center justify-between py-2 text-gray-600 hover:text-red-600 transition-colors ${!selectedCategory ? "text-red-600 font-semibold" : ""}`}
                  >
                    <span>Tất cả</span>
                    <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                      {total}
                    </span>
                  </button>
                </li>
                {categories &&
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        onClick={() => handleCategoryClick(cat.title)}
                        className={`w-full flex items-center justify-between py-2 text-gray-600 hover:text-red-600 transition-colors ${selectedCategory === cat.title ? "text-red-600 font-semibold" : ""}`}
                      >
                        <span>{cat.title}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Tags Widget */}
            {allTags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thẻ phổ biến
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
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

          {/* Main Content */}
          <div className="lg:w-2/4">
            <div className="grid grid-cols-1 gap-6">
              {blogs.map((post) => (
                <article
                  key={post._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  <div className="md:flex">
                    <div className="md:w-2/5 relative overflow-hidden">
                      <img
                        src={
                          post.images?.[0]?.url ||
                          "https://via.placeholder.com/400x300"
                        }
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {post.category?.title || "Tin tức"}
                        </span>
                      </div>
                    </div>
                    <div className="md:w-3/5 p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <FaCalendarAlt className="mr-1" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="mx-2">•</span>
                        <FaUser className="mr-1" />
                        <span>{post.author || "Admin"}</span>
                        <span className="mx-2">•</span>
                        <FaClock className="mr-1" />
                        <span>{post.readTime || "3 phút đọc"}</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {stripHTML(post.description || post.content)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {post.numViews || 0} lượt xem
                        </span>
                        <Link
                          to={`/blog-detail/${post._id}`}
                          className="flex items-center text-red-600 font-semibold text-sm hover:text-red-700"
                        >
                          Đọc thêm <FaArrowRight className="ml-2" size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoadingMore ? "Đang tải..." : "Xem thêm bài viết"}
                  {!isLoadingMore && <FaChevronDown className="ml-2" />}
                </button>
              </div>
            )}

            {blogs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Không tìm thấy bài viết nào.
              </div>
            )}
          </div>

          {/* Right Sidebar - Popular Posts & Newsletter */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaFire className="mr-2 text-red-600" /> Bài viết nổi bật
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog-detail/${post._id}`}
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

            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Đăng ký nhận tin</h3>
              <p className="text-red-100 text-sm mb-4">
                Nhận thông tin mới nhất về sản phẩm và khuyến mãi
              </p>
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-3 py-2 rounded text-gray-900 text-sm mb-2"
              />
              <button className="w-full bg-white text-red-600 py-2 rounded font-semibold text-sm">
                Đăng ký ngay
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Theo dõi chúng tôi
              </h3>
              <div className="flex space-x-3">
                {["Facebook", "YouTube", "Instagram", "Twitter"].map((name) => (
                  <button
                    key={name}
                    className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    {name[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
