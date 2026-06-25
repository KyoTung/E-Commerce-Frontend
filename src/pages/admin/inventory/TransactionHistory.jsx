import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  RefreshCw,
  Eye,
  XCircle,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getTransactions,
  getTransactionById,
  cancelTransaction,
} from "../../../features/adminSlice/inventory/inventorySlice";
import Loading from "../../../components/Loading";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const {
    transactions,
    totalPages,
    currentPage,
    loading,
    currentTransaction,
  } = useSelector((state) => state.inventory);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Debounce tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset về trang 1 khi gõ tìm kiếm mới
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Gọi API lấy danh sách khi các tham số thay đổi
  useEffect(() => {
    dispatch(
      getTransactions({
        page,
        limit: 10,
        search: debouncedSearch,
        type: filterType !== "all" ? filterType : undefined,
      })
    );
  }, [dispatch, page, debouncedSearch, filterType]);

  const handleRefresh = () => {
    dispatch(
      getTransactions({
        page,
        limit: 10,
        search: debouncedSearch,
        type: filterType !== "all" ? filterType : undefined,
      })
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleViewDetail = async (id) => {
    const result = await dispatch(getTransactionById(id));
    if (getTransactionById.fulfilled.match(result)) {
      setShowDetailModal(true);
    } else {
      toast.error("Không thể lấy chi tiết giao dịch");
    }
  };

  const handleCancelTransaction = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy phiếu nhập này? Số lượng kho sẽ được hoàn trả ngược lại.")) {
      const result = await dispatch(cancelTransaction(id));
      if (cancelTransaction.fulfilled.match(result)) {
        handleRefresh();
      }
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const getTypeBadge = (type) => {
    switch (type) {
      case "IMPORT":
        return {
          label: "Nhập kho",
          className: "bg-emerald-100 text-emerald-800",
          icon: <TrendingUp size={14} className="inline mr-1" />,
        };
      case "EXPORT":
        return {
          label: "Xuất kho",
          className: "bg-amber-100 text-amber-800",
          icon: <TrendingDown size={14} className="inline mr-1" />,
        };
      case "SALE":
        return {
          label: "Bán hàng",
          className: "bg-blue-100 text-blue-800",
          icon: <Package size={14} className="inline mr-1" />,
        };
      default:
        return {
          label: type,
          className: "bg-gray-100 text-gray-800",
          icon: <ArrowLeftRight size={14} className="inline mr-1" />,
        };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Thành công";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chờ xử lý";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử giao dịch kho</h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi tất cả hoạt động nhập kho, xuất kho điều chỉnh và bán lẻ sản phẩm
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-white border shadow-sm px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition self-start sm:self-center"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Bộ lọc và Tìm kiếm */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm giao dịch (Mã phiếu, tên sản phẩm...)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50/50"
          />
        </div>
        <div className="flex gap-2">
          {["all", "IMPORT", "EXPORT", "SALE"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "all"
                ? "Tất cả"
                : type === "IMPORT"
                ? "Nhập kho"
                : type === "EXPORT"
                ? "Xuất kho"
                : "Bán lẻ"}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng dữ liệu chính */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading && transactions.length === 0 ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Mã phiếu</th>
                  <th className="px-6 py-3.5">Thời gian</th>
                  <th className="px-6 py-3.5">Loại giao dịch</th>
                  <th className="px-6 py-3.5 text-right">Tổng giá trị</th>
                  <th className="px-6 py-3.5 text-center">Trạng thái</th>
                  <th className="px-6 py-3.5 text-center w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {transactions.length > 0 ? (
                  transactions.map((t) => {
                    const badge = getTypeBadge(t.transactionType);
                    return (
                      <tr key={t._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-mono text-xs text-blue-600 font-semibold">
                          #{t._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {t.createdAt
                            ? format(new Date(t.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.icon}
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          {t.totalValue ? formatPrice(t.totalValue) : "—"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(t.status)}`}>
                            {getStatusLabel(t.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetail(t._id)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            {t.transactionType === "IMPORT" && t.status === "completed" && (
                              <button
                                onClick={() => handleCancelTransaction(t._id)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                title="Hủy phiếu nhập kho"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">
                      Không tìm thấy giao dịch nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4 rounded-lg shadow-sm">
          <div className="flex flex-1 justify-between sm:justify-end gap-2 items-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" /> Trước
            </button>
            <span className="text-sm text-gray-700">
              Trang <strong>{currentPage}</strong> / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sau <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Modal chi tiết giao dịch */}
      {showDetailModal && currentTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Chi tiết giao dịch #{currentTransaction._id.slice(-8).toUpperCase()}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Loại: {getTypeBadge(currentTransaction.transactionType).label} | Trạng thái:{" "}
                  {getStatusLabel(currentTransaction.status)}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Thông tin chung */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="text-gray-400">Người thực hiện:</span>
                  <p className="font-semibold text-gray-700">
                    {currentTransaction.user?.fullName} 
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Thời gian tạo:</span>
                  <p className="font-semibold text-gray-700">
                    {currentTransaction.createdAt
                      ? format(new Date(currentTransaction.createdAt), "dd/MM/yyyy HH:mm:ss")
                      : "—"}
                  </p>
                </div>
                {currentTransaction.supplier && (
                  <div className="col-span-2 border-t pt-2 mt-2">
                    <span className="text-gray-400">Nhà cung cấp:</span>
                    <p className="font-semibold text-blue-700">{currentTransaction.supplier.name}</p>
                  </div>
                )}
                {currentTransaction.note && (
                  <div className="col-span-2 border-t pt-2 mt-2">
                    <span className="text-gray-400">Ghi chú:</span>
                    <p className="text-gray-600 italic">"{currentTransaction.note}"</p>
                  </div>
                )}
              </div>

              {/* Danh sách sản phẩm thuộc phiếu */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Package size={16} /> Danh sách mặt hàng
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                      <tr>
                        <th className="px-4 py-2">Sản phẩm</th>
                        <th className="px-4 py-2">Phân loại</th>
                        <th className="px-4 py-2 text-center">Số lượng</th>
                        <th className="px-4 py-2 text-right">Đơn giá</th>
                        <th className="px-4 py-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-600">
                      {currentTransaction.items?.map((item, idx) => {
                        // SỬA LỖI GIÁ: Chọn trường giá tương thích theo loại giao dịch
                        const actualPrice = item.importPrice || item.price || item.exportPrice || 0;
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-4 py-2.5 font-medium text-gray-800">
                              {item.product?.title || "Sản phẩm đã bị xóa"}
                            </td>
                            <td className="px-4 py-2 text-xs">
                              {item.color} / {item.storage}
                            </td>
                            <td className="px-4 py-2 text-center font-semibold">{item.quantity}</td>
                            <td className="px-4 py-2 text-right">
                              {actualPrice > 0 ? formatPrice(actualPrice) : "—"}
                            </td>
                            <td className="px-4 py-2 text-right font-medium text-gray-900">
                              {actualPrice > 0 ? formatPrice(actualPrice * item.quantity) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="text-base font-bold">
                    Tổng giá trị:{" "}
                    <span className="text-[#d70018]">
                      {currentTransaction.totalValue
                        ? formatPrice(currentTransaction.totalValue)
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg bg-gray-200 px-5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;