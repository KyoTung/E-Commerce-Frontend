import React from "react";
import { Link } from "react-router-dom";
import { 
  FaCamera, 
  FaGamepad, 
  FaBatteryFull, 
  FaMicrochip 
} from "react-icons/fa";
import { MdFlipCameraAndroid } from "react-icons/md";

const needs = [
  { 
    id: 1, 
    name: "Chụp ảnh đẹp", 
    slug: "camera", 
    desc: "Camera sắc nét, quay 4K",
    icon: <FaCamera />, 
  },
  { 
    id: 2, 
    name: "Chơi game", 
    slug: "gaming", 
    desc: "Cấu hình mạnh, tản nhiệt",
    icon: <FaGamepad />, 
  },
  { 
    id: 3, 
    name: "Pin khủng", 
    slug: "battery", 
    desc: "Trâu lì, sạc siêu nhanh",
    icon: <FaBatteryFull />, 
  },
  { 
    id: 4, 
    name: "Gập / Trượt", 
    slug: "foldable", 
    desc: "Thiết kế độc đáo",
    icon: <MdFlipCameraAndroid />, 
  },
  { 
    id: 5, 
    name: "Cấu hình AI", 
    slug: "ai", 
    desc: "Hiệu năng đỉnh cao",
    icon: <FaMicrochip />, 
  },
];

const Categories = () => {
  return (
    <div id="categories-section" className="py-4 bg-white">
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4">
        <h2 className="mb-3 text-sm lg:text-xl font-bold text-gray-800 uppercase px-1">
          Chọn theo nhu cầu
        </h2>
        
        
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-4">
          {needs.map((item) => (
            <Link
              key={item.id}
              to={`/products?search=${item.slug}`} 
              className="group flex flex-col items-center justify-center 
                         rounded-xl border border-gray-100 bg-white shadow-sm 
                         hover:border-[#d70018] hover:shadow-md transition-all duration-300 cursor-pointer
                         py-2 px-1 lg:py-6 lg:px-4" 
            >
            
              <div className="flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors group-hover:bg-[#d70018] group-hover:text-white
                              mb-1 lg:mb-3 
                              h-10 w-10 lg:h-16 lg:w-16 /* Mobile: 40px, Desktop: 64px */
                              text-xl lg:text-3xl"      
              >
                {item.icon}
              </div>
              
              <div className="text-center">
                
                <p className="font-bold text-gray-700 group-hover:text-[#d70018] transition-colors whitespace-nowrap
                              text-[10px] lg:text-base" /* Mobile: chữ bé tí, Desktop: chữ to rõ */
                >
                  {item.name}
                </p>

              
                <p className="hidden lg:block text-xs text-gray-500 mt-1 group-hover:text-[#d70018]">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;