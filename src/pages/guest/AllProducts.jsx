import React from "react";
import { FaStar, FaShoppingCart, FaEye } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";


const products = [
  {
    id: 1,
    name: "iPhone 15 128GB | Chính hãng VN/A",
    img_url:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__1.png",
    price: 20000000,
    rating: 4.7,
    discount: 10,
    screen_size: "6.5 inches",
    ram: "8GB",
    rom: "256GB",
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Ultra 256GB",
    img_url:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-tim-1.png",
    price: 21500000,
    rating: 4.8,
    discount: 15,
    screen_size: "6.5 inches",
    ram: "8GB",
    rom: "256GB",
  },
  {
    id: 3,
    name: "iPhone 15 128GB | Chính hãng VN/A",
    img_url:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__1.png",
    price: 20000000,
    rating: 4.7,
    discount: 10,
    screen_size: "6.5 inches",
    ram: "8GB",
    rom: "256GB",
  },
  {
    id: 4,
    name: "Samsung Galaxy S23 Ultra 256GB",
    img_url:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-tim-1.png",
    price: 21500000,
    rating: 4.8,
    discount: 15,
    screen_size: "6.5 inches",
    ram: "8GB",
    rom: "256GB",
  },
];


const AllProducts = () => {
  return (
    <div>
      <div className="px-1 sm:px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold">Sắp xếp theo:</span>
            <select className="rounded border p-2 ">
              <option value="popular" >Phổ biến</option>
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <div className="h-50 flex items-center justify-center p-4 bg-white">
                  <img
                    src={product.img_url}
                    alt={product.name}
                    className="sm:max-h-44 max-h-32 object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-[#d0011b] text-white text-xs font-bold px-2 py-1 rounded-md">
                    GIẢM {product.discount}%
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 -ml-2 line-clamp-2 h-14">
                  {product.name}
                </h3>
                <div className="mb-2 flex flex-wrap gap-1 -ml-2">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {product.screen_size}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {product.ram}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {product.rom}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 -ml-2">
                  <span className="text-sm sm:text-lg font-bold text-[#d0011b]">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                  {product.discount > 0 && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through -mr-2">
                      {Math.round(
                        product.price / (1 - product.discount / 100)
                      ).toLocaleString("vi-VN")}
                      ₫
                    </span>
                  )}
                </div>

                <div className="flex items-center my-2 -ml-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(product.rating)
                            ? "w-4 h-4 fill-current"
                            : "w-4 h-4 text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm  text-gray-600 ml-2 ">
                    ({product.rating})
                  </span>
                </div>

                {/* <div className="mt-4 flex space-x-2">
                          <button className="flex-1 bg-[#d0011b] text-white py-2 rounded-md hover:bg-[#b00117] transition-colors duration-300 font-medium text-sm flex items-center justify-center">
                            <FaShoppingCart className="mr-2" size={12} />
                            Thêm vào giỏ
                          </button>
                        </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center text-center">
          <button className="flex items-center justify-center rounded header_bg_color px-6 py-3 font-medium text-white hover:bg-red-700">
            <p> Xem thêm sản phẩm</p>
            <FaChevronDown className="ml-4" />
          </button>
        </div>
        {/* {products.length > visibleProducts && (
                   
                )} */}
      </div>
    </div>
  );
};

export default AllProducts;
