import React, { useState } from "react";
import { Link } from "react-router-dom";
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

// Mock BlogCategories component
const BlogCategories = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <FaTags className="mr-2 text-red-600" />
      Danh mục
    </h3>
    <ul className="space-y-2">
      {["Công nghệ", "Đánh giá", "Mẹo hay", "Xu hướng", "Khuyến mãi", "Tin tức"].map((category) => (
        <li key={category}>
          <Link 
            to={`/blog/category/${category.toLowerCase()}`}
            className="flex items-center justify-between py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <span>{category}</span>
            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">12</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// Mock PopularPosts component
const PopularPosts = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <FaFire className="mr-2 text-red-600" />
      Bài viết nổi bật
    </h3>
    <div className="space-y-4">
      {blogPosts.slice(0, 4).map((post) => (
        <Link 
          key={post.id} 
          to={`/blog/${post.id}`}
          className="flex items-start space-x-3 group"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
              {post.title}
            </h4>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <FaCalendarAlt className="mr-1" />
              <span>{post.date}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

// Mock SearchWidget component
const SearchWidget = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tìm kiếm</h3>
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
  );
};

// Mock TagsWidget component
const TagsWidget = () => {
  const tags = ["iPhone", "Samsung", "Camera", "Pin", "5G", "Màn hình", "Công nghệ", "Đánh giá"];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thẻ phổ biến</h3>
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
  );
};

const blogPosts = [
  {
    id: 1,
    title: "Công nghệ màn hình mới trên smartphone 2024",
    excerpt:
      "Khám phá những công nghệ màn hình đột phá sẽ được tích hợp trên smartphone trong năm 2024 và những lợi ích chúng mang lại.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    date: "15/04/2024",
    author: "Admin",
    category: "Công nghệ",
    readTime: "5 phút đọc",
    views: 1250,
    featured: true
  },
  {
    id: 2,
    title: "Top 5 điện thoại chụp ảnh đẹp nhất 2024",
    excerpt:
      "Tổng hợp những mẫu điện thoại có camera ấn tượng nhất năm 2024, từ flagship đến tầm trung nhưng vẫn cho chất lượng hình ảnh tuyệt vời.",
    image:
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=772&q=80",
    date: "12/04/2024",
    author: "Minh Tuấn",
    category: "Đánh giá",
    readTime: "7 phút đọc",
    views: 980,
    featured: true
  },
  {
    id: 3,
    title: "Hướng dẫn bảo vệ điện thoại khỏi hỏng hóc",
    excerpt:
      "Những mẹo đơn giản nhưng hiệu quả giúp bảo vệ điện thoại của bạn khỏi các tác nhân gây hại và kéo dài tuổi thọ thiết bị.",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
    date: "10/04/2024",
    author: "Thanh Hương",
    category: "Mẹo hay",
    readTime: "4 phút đọc",
    views: 1560,
    featured: false
  },
  {
    id: 4,
    title: "Xu hướng thiết kế điện thoại trong tương lai",
    excerpt:
      "Cùng khám phá những xu hướng thiết kế mới sẽ định hình diện mạo của smartphone trong những năm tới.",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=861&q=80",
    date: "08/04/2024",
    author: "Đức Anh",
    category: "Xu hướng",
    readTime: "6 phút đọc",
    views: 890,
    featured: false
  },
  {
    id: 5,
    title: "So sánh iPhone 15 và Samsung Galaxy S23: Đâu là lựa chọn tốt nhất?",
    excerpt:
      "Phân tích chi tiết sự khác biệt giữa hai flagship hàng đầu thị trường và đưa ra lời khuyên cho người dùng.",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "05/04/2024",
    author: "Tech Review",
    category: "So sánh",
    readTime: "8 phút đọc",
    views: 2100,
    featured: true
  },
  {
    id: 6,
    title: "Cách tối ưu pin điện thoại để sử dụng cả ngày",
    excerpt:
      "Những phương pháp đơn giản giúp kéo dài thời lượng pin smartphone mà không ảnh hưởng đến trải nghiệm sử dụng.",
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "02/04/2024",
    author: "Battery Expert",
    category: "Mẹo hay",
    readTime: "5 phút đọc",
    views: 1750,
    featured: false
  },
];

const BlogDetail = () => {
  const [visiblePosts, setVisiblePosts] = useState(4);

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 2);
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
            Cập nhật những tin tức mới nhất về công nghệ, đánh giá sản phẩm và mẹo sử dụng điện thoại hiệu quả
          </p>
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-1/4 space-y-6">
            <SearchWidget />
            <BlogCategories />
            <TagsWidget />
          </div>

          {/* Main Content - Blog Posts */}
          <div className="lg:w-2/4">
            <div className="grid grid-cols-1 gap-6">
              {blogPosts.slice(0, visiblePosts).map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  <div className="md:flex">
                    <div className="md:w-2/5">
                      <div className="relative overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                        </div>
                        {post.featured && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              Nổi bật
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:w-3/5 p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{post.date}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <FaUser className="mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {post.views.toLocaleString()} lượt xem
                        </span>
                        <Link
                          to={`/blog/${post.id}`}
                          className="flex items-center text-red-600 font-semibold text-sm hover:text-red-700 transition-colors"
                        >
                          Đọc thêm
                          <FaArrowRight className="ml-2" size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {visiblePosts < blogPosts.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMorePosts}
                  className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300"
                >
                  Xem thêm bài viết
                  <FaChevronDown className="ml-2" />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Popular Posts */}
          <div className="lg:w-1/4 space-y-6">
            <PopularPosts />
            
            {/* Newsletter Subscription */}
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

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Theo dõi chúng tôi</h3>
              <div className="flex space-x-3">
                {[
                  { name: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
                  { name: "YouTube", color: "bg-red-600 hover:bg-red-700" },
                  { name: "Instagram", color: "bg-pink-600 hover:bg-pink-700" },
                  { name: "Twitter", color: "bg-blue-400 hover:bg-blue-500" },
                ].map((social) => (
                  <button
                    key={social.name}
                    className={`w-10 h-10 ${social.color} text-white rounded-full flex items-center justify-center transition-colors`}
                    title={social.name}
                  >
                    <span className="text-xs font-bold">{social.name[0]}</span>
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

export default BlogDetail;