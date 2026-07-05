import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  FaUserTie, 
  FaMoneyBillWave, 
  FaLaptopCode, 
  FaHeartbeat, 
  FaMapMarkerAlt, 
  FaClock, 
  FaChevronRight 
} from "react-icons/fa";

const RecruitmentPage = () => {
  // Cuộn lên đầu trang khi render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Xử lý nộp CV ảo
  const handleApply = () => {
    toast.success("Cảm ơn bạn! Hồ sơ của bạn đã được gửi đến bộ phận Nhân sự.");
  };

  const benefits = [
    {
      icon: <FaMoneyBillWave className="text-4xl text-[#d70018] mb-4" />,
      title: "Thu Nhập Hấp Dẫn",
      desc: "Mức lương cạnh tranh, xét tăng lương 2 lần/năm cùng thưởng dự án, thưởng tháng 13, 14."
    },
    {
      icon: <FaLaptopCode className="text-4xl text-[#d70018] mb-4" />,
      title: "Môi Trường Hiện Đại",
      desc: "Trang bị đầy đủ thiết bị làm việc tân tiến (MacBook/Dell XPS), không gian mở, sáng tạo."
    },
    {
      icon: <FaHeartbeat className="text-4xl text-[#d70018] mb-4" />,
      title: "Chăm Sóc Sức Khỏe",
      desc: "Bảo hiểm sức khỏe cao cấp, khám sức khỏe định kỳ và các hoạt động thể thao hàng tuần."
    },
    {
      icon: <FaUserTie className="text-4xl text-[#d70018] mb-4" />,
      title: "Phát Triển Sự Nghiệp",
      desc: "Lộ trình thăng tiến rõ ràng, được tài trợ các khóa học chứng chỉ chuyên môn."
    }
  ];

  const jobs = [
    {
      id: 1,
      title: "Full-stack Developer (Node.js/ReactJS)",
      department: "Khối Công Nghệ",
      type: "Toàn thời gian",
      location: "Hoàng Mai, Hà Nội",
      salary: "Tới 25.000.000 VNĐ",
      requirements: "Ít nhất 1 năm kinh nghiệm với MERN Stack. Thành thạo Node.js, Express, MongoDB và ReactJS."
    },
    {
      id: 2,
      title: "Frontend developer (Fresher/Junior) (ReactJs, Redux Toolkit/AntD)",
      department: "Khối Công Nghệ",
      type: "Toàn thời gian",
      location: "Hoàng Mai, Hà Nội",
      salary: "Tới 18.000.000 VNĐ",
      requirements: "Nắm vững HTML/CSS/JS. Có kinh nghiệm triển khai dự án thực tế với React, Redux và Tailwind CSS."
    },
    {
      id: 3,
      title: "Nhân viên Chăm sóc khách hàng (CSKH)",
      department: "Khối Vận Hành",
      type: "Toàn thời gian / Bán thời gian",
      location: "Hoàng Mai, Hà Nội",
      salary: "7.000.000 - 12.000.000 VNĐ",
      requirements: "Giao tiếp tốt, kiên nhẫn. Có kinh nghiệm trực page E-commerce là một lợi thế."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-[#d70018] rounded-full blur-3xl -top-20 -right-20"></div>
          <div className="absolute w-96 h-96 bg-gray-500 rounded-full blur-3xl bottom-10 left-10"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Gia Nhập Đội Ngũ <span className="text-[#d70018]">NestStore</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Cùng chúng tôi xây dựng nền tảng thương mại điện tử công nghệ hàng đầu, mang lại giá trị thực cho hàng triệu khách hàng.
          </p>
        </div>
      </div>

      {/* Phúc lợi (Benefits) */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại Sao Chọn NestStore?</h2>
          <div className="w-16 h-1 bg-[#d70018] rounded-full mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow text-center group">
              <div className="flex justify-center group-hover:-translate-y-2 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vị trí đang tuyển (Job Openings) */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Vị Trí Đang Tuyển Dụng</h2>
              <p className="text-gray-500">Khám phá các cơ hội nghề nghiệp phù hợp với bạn.</p>
            </div>
            <div className="bg-red-50 text-[#d70018] px-4 py-2 rounded-full font-semibold text-sm">
              Đang mở: {jobs.length} vị trí
            </div>
          </div>

          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-red-300 transition-colors group">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  {/* Job Info */}
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                      {job.department}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#d70018] transition-colors">
                      {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaClock className="text-gray-400" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaMoneyBillWave className="text-gray-400" />
                        <span className="font-semibold text-gray-800">{job.salary}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 border-l-2 border-red-200 pl-3">
                      <span className="font-semibold text-gray-700">Yêu cầu:</span> {job.requirements}
                    </p>
                  </div>

                  {/* Apply Button */}
                  <div className="md:w-48 shrink-0 flex flex-col justify-end">
                    <button 
                      onClick={handleApply}
                      className="w-full bg-white border-2 border-[#d70018] text-[#d70018] hover:bg-[#d70018] hover:text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>Ứng Tuyển</span>
                      <FaChevronRight size={12} />
                    </button>
                    <span className="text-xs text-center text-gray-400 mt-2">Hạn nộp: 30/08/2026</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thông tin nộp CV */}
      <div className="container mx-auto px-4 max-w-4xl mt-16 text-center">
        <div className="bg-red-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Bạn chưa tìm thấy vị trí phù hợp?</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Đừng lo lắng! Hãy gửi CV của bạn về hệ thống dữ liệu ứng viên của chúng tôi. Chúng tôi sẽ chủ động liên hệ khi có vị trí phù hợp với năng lực của bạn.
          </p>
          <div className="inline-block bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <span className="block text-sm text-gray-500 mb-1">Email nhận CV:</span>
            <span className="text-lg font-bold text-[#d70018]">tuyendung@neststore.vn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentPage;