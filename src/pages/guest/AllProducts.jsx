import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaStar,
  FaHeart,
  FaSortAmountDown,
  FaTimes,
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";

import { getAllProducts } from "../../features/guestSlice/product/productSlice";
import { getAllBrand } from "../../features/adminSlice/brand/brandSlice";
import { getAllCategory } from "../../features/adminSlice/category/categorySlice";
import Loading from "../../components/Loading";

const AllProducts = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const productListRef = useRef(null);
  const isFirstLoad = useRef(true);
  // Redux State
  const {
    products: reduxProducts,
    isLoading,
    isError,
  } = useSelector((state) => state.productClient);
  const { brands } = useSelector(
    (state) => state.brandAdmin || state.brandAdmin
  );
  const { categories } = useSelector(
    (state) => state.categoryAdmin || state.categoryAdmin
  );

  // --- LOCAL STATE ---
  const [localProducts, setLocalProducts] = useState([]); // Danh sách hiển thị
  const [page, setPage] = useState(1); // Trang hiện tại
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu không
  const LIMIT = 10; // Số lượng sản phẩm mỗi lần tải (Nên chia hết cho 2 và 5 để đẹp grid)

  // State Filter
  const [filter, setFilter] = useState({
    brand: searchParams.get("brand") || "",
    slugCategory: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    tag: searchParams.get("tag") || "",
    title: searchParams.get("title") || "",
    sort: "-createdAt",
  });

  const priceRanges = [
    { label: "Dưới 5 triệu", min: "", max: 5000000 },
    { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
    { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
    { label: "Trên 20 triệu", min: 20000000, max: "" },
  ];

  // 1. Fetch Brands ban đầu
  useEffect(() => {
    dispatch(getAllBrand());
    dispatch(getAllCategory());
  }, [dispatch]);

  // 2. Sync URL -> Filter State
  useEffect(() => {
    setFilter({
      brand: searchParams.get("brand") || "",
      slugCategory: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      tag: searchParams.get("tag") || "",
      title: searchParams.get("title") || "",
      sort: "-createdAt",
    });
    setPage(1);
    setHasMore(true);
  }, [searchParams]);

  useEffect(() => {
    const queryParams = {
      sort: filter.sort,
      page: page,
      limit: LIMIT,
    };

    if (filter.brand) queryParams.brand = filter.brand;
    if (filter.slugCategory) queryParams.slugCategory = filter.slugCategory;
    if (filter.tag) queryParams.tags = filter.tag;
    if (filter.minPrice !== "")
      queryParams["basePrice[gte]"] = Number(filter.minPrice);
    if (filter.maxPrice !== "")
      queryParams["basePrice[lte]"] = Number(filter.maxPrice);
    if (filter.title) queryParams.title = filter.title;

    dispatch(getAllProducts(queryParams));
  }, [dispatch, filter, page]);

  useEffect(() => {
    if (reduxProducts) {
      if (page === 1) {
        setLocalProducts(reduxProducts);

        if (isFirstLoad.current) {
          window.scrollTo(0, 0);
        } else {
          if (productListRef.current) {
            productListRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      } else {
        setLocalProducts((prev) => [...prev, ...reduxProducts]);
      }

      if (reduxProducts.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [reduxProducts, page]);

  // --- HANDLERS ---

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleBrandClick = (brandSlug) => {
    setFilter((prev) => ({
      ...prev,
      brand: prev.brand === brandSlug ? "" : brandSlug,
    }));
    isFirstLoad.current = false;
    setPage(1);
  };

  const handlePriceClick = (range) => {
    const isSelected =
      filter.minPrice == range.min && filter.maxPrice == range.max;
    setFilter((prev) => ({
      ...prev,
      minPrice: isSelected ? "" : range.min,
      maxPrice: isSelected ? "" : range.max,
    }));
    isFirstLoad.current = false;
    setPage(1);
  };

  const clearFilter = () => {
    setSearchParams({});
    setPage(1);
  };

  const handleCategoryClick = (slug) => {
    // Nếu đang chọn chính nó thì bỏ chọn, ngược lại thì chọn mới
    const newCategory = filter.slugCategory === slug ? "" : slug;

    // Cập nhật URL
    if (newCategory) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        category: newCategory,
      });
    } else {
      const newParams = Object.fromEntries(searchParams);
      delete newParams.category;
      setSearchParams(newParams);
    }

    // Reset về trang 1 và scroll lên
    setPage(1);
    isFirstLoad.current = false;
  };

  // Helper
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const getSpecs = (specs) => {
    if (!specs) return [];
    return [specs.screen, specs.ram, specs.storage].filter(Boolean).slice(0, 3);
  };

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-10">
      <div
        ref={productListRef}
        className="mx-auto max-w-[1200px] px-2 sm:px-4 py-4"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800 uppercase">
              {filter.category
                ? `Điện thoại ${filter.category}`
                : "Tất cả sản phẩm"}
            </h1>
            {(filter.brand || filter.minPrice !== "" || filter.category) && (
              <button
                onClick={clearFilter}
                className="text-sm text-red-500 flex items-center gap-1 hover:underline font-medium"
              >
                <FaTimes /> Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
            {/* Brands */}
            {/* --- CATEGORY FILTER --- */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2">
                Danh mục sản phẩm
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories &&
                  categories.map((item, index) => {
                    // So sánh slug trên URL với slug của item
                    const isActive = filter.slugCategory === item.slug;
                    return (
                      <button
                        key={index}
                        onClick={() => handleCategoryClick(item.slug)} // Truyền slug vào
                        className={`px-3 py-1.5 text-xs sm:text-sm border rounded-lg transition-all ${
                          isActive
                            ? "bg-blue-50 border-blue-500 text-blue-600 font-bold"
                            : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-gray-700 mr-2">
                Hãng:
              </span>
              {brands &&
                brands.map((item, idx) => {
                  const isActive =
                    filter.brand.toLowerCase() === item.title.toLowerCase();
                  return (
                    <button
                      key={idx}
                      onClick={() => handleBrandClick(item.title)}
                      className={`px-4 py-1.5 text-xs sm:text-sm border rounded-full transition-all ${
                        isActive
                          ? "bg-red-50 border-[#d70018] text-[#d70018] font-bold"
                          : "border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
            </div>

            {/* Price & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t pt-4 border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-gray-700 mr-2">
                  Giá:
                </span>
                {priceRanges.map((range, idx) => {
                  const isSelected =
                    filter.minPrice == range.min &&
                    filter.maxPrice == range.max;
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePriceClick(range)}
                      className={`px-3 py-1.5 text-xs sm:text-sm border rounded-md transition-all ${
                        isSelected
                          ? "bg-red-50 border-[#d70018] text-[#d70018] font-bold"
                          : "border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <FaSortAmountDown className="text-gray-500" />
                <select
                  className="text-sm border-none bg-transparent font-medium text-gray-800 focus:ring-0 cursor-pointer hover:text-[#d70018] outline-none"
                  value={filter.sort}
                  onChange={(e) => {
                    setFilter({ ...filter, sort: e.target.value });
                    setPage(1);
                  }}
                >
                  <option value="-createdAt">Mới nhất</option>
                  <option value="basePrice">Giá thấp đến cao</option>
                  <option value="-basePrice">Giá cao đến thấp</option>
                  <option value="-sold">Bán chạy nhất</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- PRODUCT LIST --- */}
        {isLoading && page === 1 ? (
          <div className="h-[50vh] flex items-center justify-center">
            <Loading />
          </div>
        ) : localProducts && localProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
              {localProducts.map((product) => {
                const displayPrice = product.basePrice;
                const specsList = getSpecs(product.specifications);
                return (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    className="group relative flex flex-col h-full overflow-hidden rounded-xl bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-3"
                  >
                    <div className="relative mb-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg sm:h-48">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          "https://via.placeholder.com/300"
                        }
                        alt={product.title}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.tags?.includes("hot") && (
                        <div className="absolute top-0 left-0 bg-[#d70018] text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg shadow-sm">
                          HOT
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3
                        className="mb-1 text-xs font-semibold leading-relaxed text-gray-700 line-clamp-2 hover:text-[#d70018] sm:mb-2 sm:text-sm min-h-[2.5em]"
                        title={product.title}
                      >
                        {product.title}
                      </h3>
                      <div className="mb-2 flex flex-wrap gap-1">
                        {specsList.map((spec, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 truncate max-w-[80px]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="mb-1 flex flex-wrap items-baseline gap-x-2 mt-auto">
                        <span className="text-sm font-bold text-[#d70018] sm:text-base">
                          {formatPrice(displayPrice)}
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
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

            {/* --- LOAD MORE BUTTON --- */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-[#fcebeb] hover:text-[#d70018] hover:border-[#d70018] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Đang tải..." : `Xem thêm ${LIMIT} sản phẩm`}
                  {!isLoading && <FaChevronDown className="text-xs" />}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400 text-3xl">
              <FaFilter />
            </div>
            <p className="text-gray-500 mb-4">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
            <button
              onClick={clearFilter}
              className="text-[#d70018] font-medium hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
