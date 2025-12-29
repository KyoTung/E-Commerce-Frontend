import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaCcVisa,
  FaCcMastercard,
  FaCcJcb,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import { SiTiktok, SiZalo } from "react-icons/si";

const Footer = () => {
  const location = useLocation();

  // Logic scroll to hash (giữ nguyên từ code cũ của bạn)
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add("highlight");
        setTimeout(() => {
          element.classList.remove("highlight");
        }, 1500);
      }
    }
  }, [location]);

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 text-sm">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* --- MAIN GRID CONTENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Cột 1: Tổng đài hỗ trợ */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tổng đài hỗ trợ miễn phí</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Gọi mua hàng (8:00 - 21:00)</span>
                <a href="tel:18002097" className="font-bold text-gray-800 hover:text-[#d70018]">1800.2097</a>
              </li>
              <li className="flex justify-between">
                <span>Khiếu nại, góp ý (8:00 - 21:00)</span>
                <a href="tel:18002063" className="font-bold text-gray-800 hover:text-[#d70018]">1800.2063</a>
              </li>
              <li className="flex justify-between">
                <span>Bảo hành (8:00 - 21:00)</span>
                <a href="tel:18002064" className="font-bold text-gray-800 hover:text-[#d70018]">1800.2064</a>
              </li>
            </ul>
            
            {/* Payment Methods Mockup */}
            <div className="mt-6">
              <h3 className="text-base font-bold text-gray-800 mb-3">Phương thức thanh toán</h3>
              <div className="flex flex-wrap gap-2 text-gray-500">
                 <FaCcVisa size={30} />
                 <FaCcMastercard size={30} />
                 <FaCcJcb size={30} />
                 <FaCreditCard size={30} />
                 <FaMoneyBillWave size={30} />
              </div>
            </div>
          </div>

          {/* Cột 2: Thông tin & Chính sách */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin và chính sách</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Giới thiệu về Nest Store
                </Link>
              </li>
              <li>
                <Link to="/recruitment" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/warranty-policy" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Chính sách bảo mật thanh toán
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Chính sách vận chuyển
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Dịch vụ & Khác */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Dịch vụ và thông tin khác</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/customers" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Khách hàng doanh nghiệp (B2B)
                </Link>
              </li>
              <li>
                <Link to="/installment" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Ưu đãi thanh toán
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Quy chế hoạt động
                </Link>
              </li>
              <li>
                <Link to="/store-list" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Danh sách cửa hàng
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-[#d70018] hover:underline">
                  Liên hệ hợp tác
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Kết nối & Chứng nhận */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Kết nối với Nest Store</h3>
            <div className="flex gap-3 mb-6">
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded bg-[#3b5998] text-white hover:opacity-90">
                <FaFacebookF />
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded bg-[#FF0000] text-white hover:opacity-90">
                <FaYoutube />
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded bg-black text-white hover:opacity-90">
                <SiTiktok />
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded bg-[#E1306C] text-white hover:opacity-90">
                <FaInstagram />
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center rounded bg-[#0068FF] text-white hover:opacity-90">
                <SiZalo size={20}/>
              </a>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">Chứng nhận Website</h3>
            <div className="flex items-center gap-2">
               {/* Mockup logo Bộ Công Thương */}
               <div className="w-32">
                  <img 
                    src="https://cdn.dangkywebsitevoibocongthuong.com/wp-content/uploads/2018/06/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png" 
                    alt="Đã thông báo bộ công thương" 
                    className="w-full h-auto object-contain"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;