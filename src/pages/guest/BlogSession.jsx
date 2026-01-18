import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";


const blogPosts = [
  {
    id: 1,
    title: "Công nghệ màn hình mới trên smartphone 2024",
    excerpt: "Khám phá những công nghệ màn hình đột phá sẽ được tích hợp trên smartphone trong năm 2024 và những lợi ích chúng mang lại.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    date: "15/04/2024",
    author: "Admin",
    category: "Công nghệ",
    readTime: "5 phút đọc"
  },
  {
    id: 2,
    title: "Top 5 điện thoại chụp ảnh đẹp nhất 2024",
    excerpt: "Tổng hợp những mẫu điện thoại có camera ấn tượng nhất năm 2024, từ flagship đến tầm trung nhưng vẫn cho chất lượng hình ảnh tuyệt vời.",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=772&q=80",
    date: "12/04/2024",
    author: "Minh Tuấn",
    category: "Đánh giá",
    readTime: "7 phút đọc"
  },
  {
    id: 3,
    title: "Hướng dẫn bảo vệ điện thoại khỏi hỏng hóc",
    excerpt: "Những mẹo đơn giản nhưng hiệu quả giúp bảo vệ điện thoại của bạn khỏi các tác nhân gây hại và kéo dài tuổi thọ thiết bị.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
    date: "10/04/2024",
    author: "Thanh Hương",
    category: "Mẹo hay",
    readTime: "4 phút đọc"
  },
  {
    id: 4,
    title: "Xu hướng thiết kế điện thoại trong tương lai",
    excerpt: "Cùng khám phá những xu hướng thiết kế mới sẽ định hình diện mạo của smartphone trong những năm tới.",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=861&q=80",
    date: "08/04/2024",
    author: "Đức Anh",
    category: "Xu hướng",
    readTime: "6 phút đọc"
  }
];

const BlogsSection = () => {
  return (
    <div className="px-4 py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">TIN TỨC & BLOG</h2>
          
          <div className="w-20 h-1 bg-[#d0011b] mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#d0011b] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
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
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-[#d0011b] transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                  <Link
                    to={`/blog/${post.id}`}
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