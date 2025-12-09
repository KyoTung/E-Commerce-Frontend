import React, { useState } from "react";
import { Link } from "react-router-dom";
import RenderDocument from "../../components/RenderDocument"
import "../../App.css"
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

const sampleArticle = {
    id: 1,
    title: "Hướng dẫn sử dụng Jodit Editor trong React",
    excerpt: "Bài viết hướng dẫn tích hợp và sử dụng Jodit Editor trong ứng dụng React",
    content: `
        <h1>Jodit Editor - Trình soạn thảo WYSIWYG mạnh mẽ</h1>
        
        <p>Jodit là một trình soạn thảo WYSIWYG hiện đại và mạnh mẽ cho web.</p>
        
        <h2>Tính năng nổi bật</h2>
        
        <ul>
            <li>Hỗ trợ <strong>đầy đủ các định dạng văn bản</strong></li>
            <li>Tích hợp dễ dàng với <em>React</em></li>
            <li>Hỗ trợ upload ảnh và file</li>
        </ul>
        
        <blockquote>
            <p>Đây là trình soạn thảo lý tưởng cho các ứng dụng CMS</p>
        </blockquote>
        
        <h3>Code example:</h3>
        <pre><code>const editor = new Jodit('#editor');</code></pre>
        
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Tính năng</th>
                    <th>Mô tả</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>WYSIWYG</td>
                    <td>What You See Is What You Get</td>
                </tr>
            </tbody>
        </table>
    `,
    author: "Admin",
    createdAt: "2024-01-15",
    tags: ["react", "jodit", "editor"]
};

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



const BlogDetail = () => {
  const [visiblePosts, setVisiblePosts] = useState(4);

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-1/4 space-y-6">
            <SearchWidget />
            <BlogCategories />
            <TagsWidget />
          </div>

          {/* Main Content - Blog Posts */}
          <div className="lg:w-4/4">
           <RenderDocument content={sampleArticle.content} />
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;