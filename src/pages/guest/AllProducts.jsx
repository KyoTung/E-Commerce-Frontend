import React, { useEffect, useState } from "react";
import { FaStar, FaHeart, FaSortAmountDown } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAllProducts } from "../../features/guestSlice/product/productSlice";
import Loading from "../../components/Loading";

const AllProducts = () => {
  const dispatch = useDispatch();

  const { products, isLoading, isError } = useSelector(
    (state) => state.productClient
  );

  const [sort, setSort] = useState("popular");

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getSpecs = (specs) => {
    if (!specs) return [];
    const list = [];
    if (specs.screen) list.push(specs.screen);
    if (specs.ram) list.push(specs.ram);
    if (specs.storage) list.push(specs.storage);
    return list.slice(0, 3);
  };

  console.log("Products:", products);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Đã có lỗi xảy ra khi tải sản phẩm.
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-10">
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4 py-4">
        {/* --- Header & Filter Bar --- */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 uppercase mb-4">
            Tất cả điện thoại
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                "Apple",
                "Samsung",
                "Xiaomi",
                "OPPO",
                "Từ 2-4 triệu",
                "Pin khủng",
              ].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md hover:border-[#d70018] hover:text-[#d70018] bg-gray-50 transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <FaSortAmountDown className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                Sắp xếp:
              </span>
              <select
                className="text-sm border-none bg-transparent font-medium text-gray-800 focus:ring-0 cursor-pointer"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="popular">Nổi bật</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Product Grid --- */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => {
              const specsList = getSpecs(product.specifications);
              const discount = 0;

              return (
                <Link
                  to={`/product/${product._id || product.id}`}
                  key={product._id || product.id}
                  className="group relative flex flex-col h-full overflow-hidden rounded-xl bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-3"
                >
                  {/* Image Section */}
                  <div className="relative mb-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg sm:h-48">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/300"
                      }
                      alt={product.title}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />

                    {discount > 0 && (
                      <div className="absolute left-0 top-0 rounded-br-lg bg-[#d70018] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                        Giảm {discount}%
                      </div>
                    )}

                    {product.basePrice > 3000000 && (
                      <div className="absolute right-0 top-0 rounded-bl-lg bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 sm:text-xs border border-gray-200">
                        Trả góp 0%
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col">
                    <h3
                      className="mb-1 text-xs font-semibold leading-relaxed text-gray-700 line-clamp-3 hover:text-[#d70018] sm:mb-2 sm:text-sm min-h-[2.5em]"
                      title={product.title}
                    >
                      {product.title}
                    </h3>

                    {/* Specs Chips */}
                    <div className="mb-2 flex flex-wrap gap-1">
                      {specsList.map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 truncate max-w-[80px]"
                          title={spec}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="mb-1 flex flex-wrap items-baseline gap-x-2 mt-auto">
                      <span className="text-sm font-bold text-[#d70018] sm:text-base">
                        {formatPrice(product.basePrice)}
                      </span>
                    </div>

                    {/* Footer: Rating & Wishlist */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" size={10} />
                        <span className="text-[10px] text-gray-500 sm:text-xs font-medium">
                          {product.totalRating || 0} (
                          {product.rating?.length || 0})
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-[#d70018] transition-colors flex items-center gap-1 text-xs group/heart">
                        Yêu thích
                        <FaHeart
                          className="group-hover/heart:text-[#d70018]"
                          size={12}
                        />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            Không tìm thấy sản phẩm nào.
          </div>
        )}

        {/* Load More Button */}
        <div className="mt-8 flex justify-center">
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-[#fcebeb] hover:text-[#d70018] hover:border-[#d70018]">
            Xem thêm 20 sản phẩm <FaChevronDown className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
