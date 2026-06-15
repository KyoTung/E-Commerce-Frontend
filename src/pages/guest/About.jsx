import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaRocket, 
  FaShieldAlt, 
  FaHeadset, 
  FaShippingFast, 
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaLayerGroup,
  FaDatabase
} from "react-icons/fa";

const About = () => {
  // Cuộn lên đầu trang khi vừa vào
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toàn bộ dữ liệu được hardcode tĩnh tại đây
  const coreValues = [
    {
      icon: <FaShieldAlt className="text-4xl text-[#d70018] mb-4" />,
      title: "Chính Hãng 100%",
      desc: "Cam kết mọi sản phẩm điện thoại, phụ kiện đều là hàng chính hãng, nguyên seal và bảo hành đầy đủ."
    },
    {
      icon: <FaRocket className="text-4xl text-[#d70018] mb-4" />,
      title: "Trải Nghiệm Mượt Mà",
      desc: "Tốc độ phản hồi hệ thống siêu tốc, mang lại trải nghiệm mua sắm không giới hạn trên mọi thiết bị."
    },
    {
      icon: <FaShippingFast className="text-4xl text-[#d70018] mb-4" />,
      title: "Giao Hàng Siêu Tốc",
      desc: "Hệ thống vận hành tối ưu giúp sản phẩm đến tay khách hàng nhanh chóng và an toàn nhất."
    },
    {
      icon: <FaHeadset className="text-4xl text-[#d70018] mb-4" />,
      title: "Hỗ Trợ 24/7",
      desc: "Đội ngũ kỹ thuật và CSKH luôn sẵn sàng giải đáp mọi thắc mắc của bạn bất cứ lúc nào."
    }
  ];

  const stats = [
    { number: "10K+", label: "Khách Hàng" },
    { number: "500+", label: "Sản Phẩm" },
    { number: "99%", label: "Hài Lòng" },
    { number: "24/7", label: "Hỗ Trợ" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-[#d70018] rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl bottom-10 right-10"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Chào mừng đến với <span className="text-[#d70018]">NestStore</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Kết nối thế giới thực và không gian số thông qua những sản phẩm công nghệ tiên tiến nhất. Chúng tôi mang đến cho bạn trải nghiệm mua sắm thông minh, an toàn và toàn diện.
          </p>
        </div>
      </div>

      {/* Story & Tech Stack Section */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Về Chúng Tôi</h2>
            <div className="w-20 h-1 bg-[#d70018] rounded-full"></div>
            <p className="text-gray-600 leading-relaxed text-justify">
              Khởi nguồn từ niềm đam mê sâu sắc với thế giới số và công nghệ tương lai, <strong>NestStore</strong> được xây dựng với tầm nhìn trở thành cầu nối mang những thiết bị di động, laptop và phụ kiện thông minh nhất đến tận tay người tiêu dùng.
            </p>
            
            {/* Điểm nhấn khoe kỹ thuật ngầm với hội đồng */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mt-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                Nền Tảng Công Nghệ Của Hệ Thống
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-700 text-sm">
                  <FaLayerGroup className="text-[#d70018] mt-1 mr-3 shrink-0" /> 
                  <span><strong>Giao diện thân thiện:</strong> Sử dụng Ant Design kết hợp quản lý trạng thái luồng dữ liệu mượt mà từ Redux Toolkit.</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <FaDatabase className="text-[#d70018] mt-1 mr-3 shrink-0" /> 
                  <span><strong>Xử lý mạnh mẽ:</strong> Kiến trúc backend chịu tải cao với Node.js và hệ cơ sở dữ liệu linh hoạt MongoDB.</span>
                </li>
                <li className="flex items-start text-gray-700 text-sm">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 shrink-0" /> 
                  <span><strong>Bảo mật tối đa:</strong> Quy trình thanh toán và xác thực mã hóa an toàn tuyệt đối.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
              alt="Công nghệ tương lai" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 aspect-[4/3]"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#d70018] py-12 mt-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-red-500/50">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white px-4">
                <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.number}</div>
                <div className="text-red-100 font-medium text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="container mx-auto px-4 max-w-7xl py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá Trị Cốt Lõi</h2>
          <div className="w-20 h-1 bg-[#d70018] rounded-full mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-red-100 transition-all duration-300 transform hover:-translate-y-2 text-center group"
            >
              <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info & CTA */}
      <div className="container mx-auto px-4 max-w-7xl mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Thông Tin Liên Hệ</h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <div className="w-10 h-10 bg-red-50 text-[#d70018] rounded-full flex items-center justify-center mr-4 shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <span><strong>Trụ sở chính:</strong> Hoàng Mai, Hà Nội</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-10 h-10 bg-red-50 text-[#d70018] rounded-full flex items-center justify-center mr-4 shrink-0">
                  <FaPhoneAlt />
                </div>
                <span><strong>Hotline:</strong> 1900 xxxx (8:00 - 22:00)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-10 h-10 bg-red-50 text-[#d70018] rounded-full flex items-center justify-center mr-4 shrink-0">
                  <FaEnvelope />
                </div>
                <span><strong>Email:</strong> support@neststore.vn</span>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gray-900 rounded-2xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">Sẵn sàng trải nghiệm?</h3>
              <p className="text-gray-400 mb-6 text-sm">Khám phá hàng ngàn sản phẩm công nghệ với mức giá cực kỳ ưu đãi ngay hôm nay.</p>
              <Link 
                to="/" 
                className="inline-block bg-[#d70018] text-white font-bold px-8 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/30"
              >
                Mua Sắm Ngay
              </Link>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 border-4 border-[#d70018]/20 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 border-4 border-blue-600/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;