import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PencilLine, Trash, Plus, RefreshCw, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";
import { getAllProducts, deleteProduct } from "../../../features/adminSlice/products/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, totalProducts, totalPages, currentPage } = useSelector(
    (state) => state.productAdmin
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const itemsPerPage = 10;

  // Debounce tìm kiếm (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Gọi API khi page, itemsPerPage, debouncedSearch thay đổi
  useEffect(() => {
    dispatch(
      getAllProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, debouncedSearch]);

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      dispatch(
        getAllProducts({
          page: 1,
          limit: itemsPerPage,
          search: debouncedSearch,
        })
      );
    }
  }, [debouncedSearch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(
        getAllProducts({
          page: newPage,
          limit: itemsPerPage,
          search: debouncedSearch,
        })
      );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      const resultAction = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(resultAction)) {
        toast.success("Xóa sản phẩm thành công");
        dispatch(
          getAllProducts({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
          })
        );
      } else {
        toast.error(resultAction.payload?.message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/admin/product-detail/${productId}`);
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/new-product"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm sản phẩm
          </Link>
          <button
            onClick={() =>
              dispatch(
                getAllProducts({
                  page: 1,
                  limit: itemsPerPage,
                  search: debouncedSearch,
                })
              )
            }
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} /> Tải lại
          </button>
        </div>
      </div>

      <div className="mb-4 relative w-full md:w-80">
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

      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20"><Loading /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              {products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Không tìm thấy sản phẩm nào.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Sản phẩm</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Giá cơ bản</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Tồn kho</th>
                      <th className="px-6 py-3 text-right text-xs font-bold uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {products.map((product, idx) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-4">
                            <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt={product.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Img</div>
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <button
                                onClick={() => handleViewProduct(product._id)}
                                className="font-medium text-gray-900 hover:text-blue-600 hover:underline text-left"
                              >
                                {product.title}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{formatPrice(product.basePrice)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                            {product.variants?.reduce((sum, v) => sum + v.quantity, 0) || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => handleViewProduct(product._id)} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => navigate(`/admin/edit-product/${product._id}`)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <PencilLine size={18} />
                            </button>
                            <button onClick={() => onDelete(product._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Phân trang */}
            {totalProducts > 0 && (
              <div className="flex items-center justify-between border-t px-4 py-3">
                <div className="text-sm text-gray-700">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalProducts)} trên {totalProducts} sản phẩm
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    <ChevronLeft size={16} /> Trước
                  </button>
                  <span className="px-3 py-1">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Sau <ChevronRight size={16} />
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