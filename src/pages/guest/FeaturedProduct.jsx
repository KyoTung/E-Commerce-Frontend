import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";

// Dữ liệu giả lập phong phú hơn
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB | Chính hãng VN/A",
    img_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    price: 29490000,
    original_price: 34990000,
    rating: 5,
    review_count: 15,
    discount: 15,
    installment: true, // Có trả góp
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 12GB 256GB",
    img_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
    price: 26990000,
    original_price: 33990000,
    rating: 4.8,
    review_count: 42,
    discount: 20,
    installment: true,
  },
  {
    id: 3,
    name: "Xiaomi 14 12GB 256GB",
    img_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14_2_.png",
    price: 19990000,
    original_price: 22990000,
    rating: 4.9,
    review_count: 8,
    discount: 13,
    installment: false,
  },
  {
    id: 4,
    name: "OPPO Reno11 F 5G 8GB 256GB",
    img_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno11-f-tim-1.png",
    price: 8490000,
    original_price: 8990000,
    rating: 4.5,
    review_count: 22,
    discount: 5,
    installment: true,
  },
  {
    id: 5,
    name: "iPad Air 6 M2 11 inch WiFi 128GB",
    img_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-air-6-11-blue-thum.png",
    price: 15390000,
    original_price: 16990000,
    rating: 5,
    review_count: 5,
    discount: 9,
    installment: true,
  },
];

const FeaturedProduct = () => {
  return (
    // Wrapper màu đỏ (Hot Sale Style)
    <div className="bg-[#cd1818] py-6 sm:py-8">
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4">
        
        {/* --- Header: Title + Countdown (Giả lập) --- */}
        <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end sm:mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black uppercase italic text-white sm:text-3xl tracking-tight">
              SẢN PHẨM NỔI BẬT
            </h2>
            
           
          </div>
          
          
        </div>

        {/* --- Product Grid --- */}
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-3"
            >
              {/* Image Container */}
              <div className="relative mb-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg sm:h-48">
                <img
                  src={product.img_url}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                
              
               
                  <div className="absolute left-0 top-0 rounded-br-lg bg-[#d70018] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                    HOT
                  </div>
                
                {product.installment && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 sm:text-xs border border-gray-200">
                    Trả góp 0%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col">
                
                <h3 className="mb-1 text-xs font-semibold leading-relaxed text-gray-700 line-clamp-2 hover:text-[#d70018] sm:mb-2 sm:text-sm h-9 sm:h-10">
                  {product.name}
                </h3>

               
                <div className="mb-2 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-bold text-[#d70018] sm:text-base">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                  {product.discount > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      {product.original_price.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>

                

             
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}
                          size={10}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 sm:text-xs">
                      ({product.review_count} đánh giá)
                    </span>
                  </div>
                  
                 
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <FaHeart size={14} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;