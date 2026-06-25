import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PencilLine, Plus, RefreshCw, Eye, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import { MdLockOutline, MdLockOpen } from "react-icons/md"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";
import { getAllProducts, deleteProduct } from "../../../features/adminSlice/products/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products = [], loading, totalProducts, totalPages, currentPage } = useSelector(
    (state) => state.productAdmin
  );
  
  // State quản lý bộ lọc dữ liệu đa năng
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("active"); // Mặc định: hiển thị sản phẩm đang bán
  const [sortOption, setSortOption] = useState("default");     // Mặc định: Mới nhất
  const itemsPerPage = 10;

  // Debounce tìm kiếm (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Hàm tập trung gọi API lấy danh sách sản phẩm đồng bộ tất cả bộ lọc
  // const fetchProductsList = (pageNumber = currentPage) => {
  //   dispatch(
  //     getAllProducts({
  //       page: pageNumber,
  //       limit: itemsPerPage,
  //       search: debouncedSearch.trim(),
  //       status: filterStatus,
  //       sort: sortOption,
  //     })
  //   );
  // };

  const fetchProductsList = (pageNumber = currentPage) => {
    dispatch(
      getAllProducts({
        page: pageNumber,
        limit: itemsPerPage,
        search: debouncedSearch.trim(),
        status: filterStatus, 
        sort: sortOption,    
      })
    );
  };

  // Theo dõi sự thay đổi của trang, từ khóa, trạng thái, và tiêu chí sắp xếp để tự động reload bảng
  useEffect(() => {
    fetchProductsList();
  }, [dispatch, currentPage, debouncedSearch, filterStatus, sortOption]);

  // Tự động quay về trang 1 khi thay đổi tiêu chí bộ lọc mới
  useEffect(() => {
    fetchProductsList(1);
  }, [debouncedSearch, filterStatus, sortOption]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      fetchProductsList(newPage);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  // Hành động đóng / mở khóa ẩn sản phẩm
  const handleToggleActiveProduct = async (product) => {
    const actionText = product.isActive ? "KHÓA / ẨN" : "MỞ KHÓA / KÍCH HOẠT LẠI";
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} sản phẩm [${product.title}] không?`)) return;
    
    try {
      const resultAction = await dispatch(deleteProduct(product._id));
      if (deleteProduct.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "Cập nhật trạng thái sản phẩm thành công");
        fetchProductsList(); 
      } else {
        toast.error(resultAction.payload?.message || "Thao tác thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống không mong muốn");
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/admin/product-detail/${productId}`);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      
      {/* Header đầu trang */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý hàng hóa sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng số sản phẩm tìm thấy: {totalProducts}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/new-product"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm sản phẩm
          </Link>
          <button
            onClick={() => fetchProductsList(1)}
            className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Tải lại
          </button>
        </div>
      </div>

      {/* THANH ĐIỀU KHIỂN BỘ LỌC ĐA NĂNG & SẮP XẾP MỚI */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* 1. Thanh tìm kiếm */}
        <div className="relative w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 2. Bộ lọc trạng thái kinh doanh */}
        <div className="flex items-center gap-2 text-sm w-full">
          <span className="font-semibold text-gray-500 whitespace-nowrap">Trạng thái:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border rounded-lg p-2 font-medium text-sm outline-none text-gray-700 bg-gray-50 cursor-pointer focus:border-blue-500 transition"
          >
            <option value="active">Đang mở bán (Hoạt động)</option>
            <option value="inactive">Đã ẩn / Ngừng kinh doanh</option>
            <option value="all">Tất cả sản phẩm</option>
          </select>
        </div>

        {/* 3. Bộ lọc tiêu chí Sắp xếp sản phẩm */}
        <div className="flex items-center gap-2 text-sm w-full">
          <span className="font-semibold text-gray-500 whitespace-nowrap">Sắp xếp:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full border rounded-lg p-2 font-medium text-sm outline-none text-gray-700 bg-gray-50 cursor-pointer focus:border-blue-500 transition"
          >
            <option value="default">Mới tiếp nhận (Mặc định)</option>
            <option value="price_asc">Giá bán: Thấp đến Cao</option>
            <option value="price_desc">Giá bán: Cao đến Thấp</option>
            <option value="sold_desc">Sản lượng bán: Bán chạy nhất</option>
            <option value="quantity_asc">Tồn kho: Sắp hết hàng (Tăng dần)</option>
            <option value="quantity_desc">Tồn kho: Khối lượng lớn (Giảm dần)</option>
          </select>
        </div>
      </div>

      {/* Bảng hiển thị kết quả */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading && products.length === 0 ? (
          <div className="py-20"><Loading /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              {products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5 text-left">#</th>
                      <th className="px-6 py-3.5 text-left">Sản phẩm</th>
                      <th className="px-6 py-3.5 text-left">Giá cơ bản</th>
                      <th className="px-6 py-3.5 text-center">Tổng tồn kho</th>
                      <th className="px-6 py-3.5 text-center">Trạng thái hiển thị</th>
                      <th className="px-6 py-3.5 text-right w-36">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-700 font-medium">
                    {products.map((product, idx) => (
                      <tr key={product._id} className={`hover:bg-gray-50/50 transition ${product.isActive === false ? "bg-gray-50/70 text-gray-400" : ""}`}>
                        <td className="px-6 py-4 text-gray-400">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-4">
                            <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 flex-shrink-0">
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt={product.title} className="h-full w-full object-contain" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400 bg-gray-50">No Img</div>
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <button
                                onClick={() => handleViewProduct(product._id)}
                                className={`font-bold text-gray-900 hover:text-blue-600 hover:underline text-left line-clamp-1 ${product.isActive === false ? "text-gray-400 font-medium italic" : ""}`}
                              >
                                {product.title}
                              </button>
                              <span className="text-xs text-gray-400 font-normal mt-0.5">Thương hiệu: {product.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">{formatPrice(product.basePrice)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.variants?.reduce((sum, v) => sum + v.quantity, 0) > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {product.variants?.reduce((sum, v) => sum + v.quantity, 0) || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            product.isActive === false
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {product.isActive === false ? "Đang ẩn / Đóng" : "Đang mở bán"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2.5">
                            <button onClick={() => handleViewProduct(product._id)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition" title="Xem chi tiết">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => navigate(`/admin/edit-product/${product._id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Sửa thông tin">
                              <PencilLine size={16} />
                            </button>
                            {product.isActive === false ? (
                              <button onClick={() => handleToggleActiveProduct(product)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Mở khóa kinh doanh lại">
                                <MdLockOutline size={18} />
                              </button>
                            ) : (
                              <button onClick={() => handleToggleActiveProduct(product)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Khóa sản phẩm">
                                <MdLockOpen size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Khối thanh phân trang số */}
            {totalProducts > 0 && (
              <div className="flex items-center justify-between border-t px-4 py-3 bg-white">
                <div className="text-sm text-gray-700 font-medium">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalProducts)} trên {totalProducts} sản phẩm
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-semibold border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-1 text-sm font-bold text-gray-600">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-semibold border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;