import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTools, FaRocket, FaArrowLeft } from "react-icons/fa";

const ComingSoonPage = () => {
  const navigate = useNavigate();

  // Cuộn lên đầu trang khi render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[80vh] bg-[#f4f6f8] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center relative overflow-hidden">
        
        {/* Vòng tròn trang trí mờ phía sau */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-50 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-50 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          {/* Icon Animation */}
          <div className="flex justify-center items-center mb-6 relative">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
              {/* Hiệu ứng xoay lắc nhẹ */}
              <FaTools className="text-5xl text-[#d70018] animate-[spin_3s_linear_infinite]" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center animate-bounce">
              <FaRocket className="text-xl text-blue-500" />
            </div>
          </div>

          {/* Nội dung thông báo */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Tính Năng Đang Phát Triển
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Đội ngũ kỹ sư của <strong className="text-[#d70018]">NestStore</strong> đang làm việc hết công suất để hoàn thiện chức năng này. Trải nghiệm tuyệt vời sắp ra mắt, mong bạn thông cảm và quay lại sau nhé!
          </p>

          {/* Cụm nút bấm */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => navigate(-1)} // Quay lại trang trước đó
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft />
              <span>Quay lại</span>
            </button>
            <Link 
              to="/" 
              className="flex items-center justify-center px-6 py-3 bg-[#d70018] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
            >
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;