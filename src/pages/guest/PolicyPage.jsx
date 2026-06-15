import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  FaShieldAlt, 
  FaUndoAlt, 
  FaLock, 
  FaTruck, 
  FaCheckCircle 
} from "react-icons/fa";

const PolicyPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("warranty");

  // Tự động cuộn lên đầu trang khi render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Dữ liệu nội dung các chính sách (Hardcode tĩnh)
  const policies = {
    warranty: {
      id: "warranty",
      icon: <FaShieldAlt className="text-xl mb-1" />,
      title: "Bảo Hành",
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Chính Sách Bảo Hành Chính Hãng</h3>
          <p>
            NestStore cam kết tất cả sản phẩm điện thoại bán ra đều là hàng chính hãng 100%, được bảo hành theo đúng tiêu chuẩn của nhà sản xuất.
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Thiết bị di động (Điện thoại):</strong> Bảo hành chính hãng 12 tháng tại các trung tâm bảo hành ủy quyền trên toàn quốc.</span>
            </li>
            
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Lỗi phần mềm:</strong> Hỗ trợ cài đặt, nâng cấp và khắc phục lỗi phần mềm trọn đời máy hoàn toàn miễn phí.</span>
            </li>
          </ul>
          <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-200">
            <p className="text-sm">
              <strong className="text-gray-800">Lưu ý:</strong> NestStore có quyền từ chối bảo hành đối với các trường hợp máy bị rơi vỡ, vào nước, can thiệp phần cứng trái phép hoặc tem bảo hành không còn nguyên vẹn.
            </p>
          </div>
        </div>
      )
    },
    return: {
      id: "return",
      icon: <FaUndoAlt className="text-xl mb-1" />,
      title: "Đổi Trả",
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Chính Sách Đổi Trả 30 Ngày</h3>
          <p>
            Nhằm đảm bảo quyền lợi tuyệt đối cho khách hàng, NestStore áp dụng chính sách bao test, đổi trả cực kỳ linh hoạt.
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Đổi mới 1-1 trong 30 ngày đầu:</strong> Nếu sản phẩm phát sinh lỗi phần cứng do nhà sản xuất (như hỏng main, lỗi màn hình, lỗi camera...), quý khách sẽ được đổi ngay một sản phẩm mới nguyên seal tương đương.</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Trả hàng - Hoàn tiền:</strong> Trong vòng 7 ngày đầu, nếu quý khách không hài lòng về sản phẩm (áp dụng với sản phẩm chưa kích hoạt bảo hành, nguyên seal), NestStore hỗ trợ thu mua lại với mức phí chiết khấu từ 10% - 15% tùy tình trạng.</span>
            </li>
          </ul>
          <p className="mt-4">
            Quá trình kiểm định lỗi và xử lý đổi trả sẽ diễn ra nhanh chóng từ 24h - 48h làm việc tại hệ thống cửa hàng NestStore.
          </p>
        </div>
      )
    },
    security: {
      id: "security",
      icon: <FaLock className="text-xl mb-1" />,
      title: "Bảo Mật",
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Chính Sách Bảo Mật Thanh Toán</h3>
          <p>
            Sự an toàn tài chính của khách hàng là ưu tiên hàng đầu tại hệ thống E-commerce của NestStore. Chúng tôi áp dụng các tiêu chuẩn bảo mật quốc tế khắt khe nhất.
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Mã hóa SSL 256-bit:</strong> Mọi thông tin giao dịch, dữ liệu cá nhân của khách hàng đều được mã hóa trên đường truyền, chống lại mọi hình thức đánh cắp dữ liệu.</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Tích hợp cổng thanh toán an toàn:</strong> Xử lý giao dịch thông qua các đối tác uy tín như ZaloPay, VNPAY, đảm bảo không lưu trữ trực tiếp thông tin thẻ tín dụng của khách hàng trên máy chủ NestStore.</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Không chia sẻ dữ liệu:</strong> NestStore cam kết tuyệt đối không mua bán, trao đổi thông tin khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại.</span>
            </li>
          </ul>
        </div>
      )
    },
    shipping: {
      id: "shipping",
      icon: <FaTruck className="text-xl mb-1" />,
      title: "Vận Chuyển",
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Chính Sách Giao Hàng & Vận Chuyển</h3>
          <p>
            NestStore hợp tác với các đơn vị vận chuyển hàng đầu để mang sản phẩm đến tay bạn một cách nhanh chóng và nguyên vẹn nhất.
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Giao hàng hỏa tốc nội thành:</strong> Giao ngay trong 2h đối với các đơn hàng tại khu vực nội thành Hà Nội. Đồng giá phí ship 20.000 VNĐ.</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Miễn phí vận chuyển toàn quốc:</strong> Áp dụng cho mọi đơn hàng có giá trị từ 500.000 VNĐ trở lên. Thời gian nhận hàng từ 2 - 4 ngày làm việc.</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-[#d70018] mt-1 mr-3 shrink-0" />
              <span><strong>Đồng kiểm khi nhận hàng:</strong> Khách hàng được quyền yêu cầu shipper mở hộp kiểm tra ngoại quan sản phẩm (không kích hoạt máy) trước khi thanh toán tiền mặt (COD).</span>
            </li>
          </ul>
        </div>
      )
    }
  };

  const tabs = Object.values(policies);

  return (
    <div className="min-h-screen bg-[#f4f6f8] py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Tiêu đề trang */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Trung Tâm Hỗ Trợ Khách Hàng</h1>
          <p className="text-gray-500">Mọi quy định và chính sách để bạn an tâm mua sắm tại NestStore</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Menu (Thẻ Tabs) */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0 sticky top-24">
            <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">
              Danh Mục Chính Sách
            </div>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-4 text-sm font-semibold transition-colors whitespace-nowrap lg:whitespace-normal border-l-4 ${
                    activeTab === tab.id
                      ? "bg-red-50 text-[#d70018] border-[#d70018]"
                      : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-[#d70018]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activeTab === tab.id ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                    {tab.icon}
                  </div>
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nội dung hiển thị bên phải */}
          <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[500px]">
            {/* Hiệu ứng mờ dần khi chuyển tab */}
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {policies[activeTab].content}
            </div>
          </div>
        </div>

        {/* Khối liên hệ khẩn cấp */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-3">Bạn cần hỗ trợ thêm?</h3>
          <p className="text-gray-300 mb-6">Đội ngũ chuyên viên của chúng tôi luôn trực tuyến để giải đáp mọi vấn đề của bạn.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:1900xxxx" className="bg-[#d70018] text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition">
              Gọi Hotline: 1900 2063 | 2064
            </a>
            <a href="mailto:support@neststore.vn" className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Gửi Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;