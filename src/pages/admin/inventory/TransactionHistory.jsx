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
    totalTransactions,
    currentPage,
    limit,
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
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(
      getTransactions({
        page,
        limit: 10,
        search: debouncedSearch,
        type: filterType === "all" ? undefined : filterType,
      })
    );
  }, [dispatch, page, debouncedSearch, filterType]);

  const handleRefresh = () => {
    dispatch(
      getTransactions({
        page,
        limit: 10,
        search: debouncedSearch,
        type: filterType === "all" ? undefined : filterType,
      })
    );
  };

  const handleViewDetail = (id) => {
    dispatch(getTransactionById(id));
    setShowDetailModal(true);
  };

  const handleCancelTransaction = async (id) => {
    if (window.confirm("Bạn có chắc muốn hủy phiếu nhập này? Hành động sẽ hoàn lại số lượng đã nhập.")) {
      await dispatch(cancelTransaction(id));
      handleRefresh();
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  const getTransactionTypeLabel = (type) => {
    const map = {
      import: { label: "Nhập kho", icon: TrendingUp, className: "bg-green-100 text-green-800" },
      export: { label: "Xuất kho", icon: TrendingDown, className: "bg-red-100 text-red-800" },
      return: { label: "Trả hàng", icon: ArrowLeftRight, className: "bg-yellow-100 text-yellow-800" },
      adjustment: { label: "Điều chỉnh", icon: AlertTriangle, className: "bg-blue-100 text-blue-800" },
    };
    return map[type] || { label: type, icon: Package, className: "bg-gray-100 text-gray-800" };
  };

  const getExportTypeLabel = (exportType) => {
    const map = {
      return_to_supplier: "Trả NCC",
      internal_use: "Dùng nội bộ",
      damage: "Hỏng/Mất",
      adjustment: "Điều chỉnh",
    };
    return map[exportType] || exportType;
  };

  const totalPages = Math.ceil(totalTransactions / 10);

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Lịch sử giao dịch kho</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
        >
          <RefreshCw size={18} /> Tải lại
        </button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả giao dịch</option>
            <option value="import">Nhập kho</option>
            <option value="export">Xuất kho</option>
            <option value="return">Trả hàng</option>
            <option value="adjustment">Điều chỉnh</option>
          </select>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo mã phiếu hoặc tên nhà cung cấp..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bảng giao dịch */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy giao dịch nào.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Mã phiếu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Nhà cung cấp / Đối tác
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                      Tổng giá trị
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {transactions.map((tx) => {
                    const typeInfo = getTransactionTypeLabel(tx.transactionType);
                    const TypeIcon = typeInfo.icon;
                    const isImport = tx.transactionType === "import";
                    const canCancel = isImport && tx.status !== "cancelled"; // backend cần có status field
                    return (
                      <tr key={tx._id} className="hover:bg-gray-50 transition">
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-gray-600">
                          #{tx._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.className}`}
                          >
                            <TypeIcon size={12} /> {typeInfo.label}
                          </span>
                          {tx.transactionType === "export" && tx.exportType && (
                            <span className="ml-2 text-xs text-gray-400">
                              ({getExportTypeLabel(tx.exportType)})
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {tx.supplier?.name || (tx.transactionType === "export" ? "Xuất nội bộ" : "—")}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(tx.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                          {tx.totalValue ? formatPrice(tx.totalValue) : "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetail(tx._id)}
                              className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            {canCancel && (
                              <button
                                onClick={() => handleCancelTransaction(tx._id)}
                                className="rounded-md p-1.5 text-red-600 hover:bg-red-50 transition"
                                title="Hủy phiếu nhập"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4 rounded-lg shadow-sm">
          <div className="flex flex-1 justify-between sm:justify-end gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                page === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Trước
            </button>
            <span className="text-sm text-gray-700 py-2">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                page === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modal chi tiết giao dịch */}
      {showDetailModal && currentTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-xl font-bold text-gray-800">
                Chi tiết phiếu #{currentTransaction._id.slice(-8).toUpperCase()}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Loại giao dịch:</span>
                  <p className="font-medium">
                    {getTransactionTypeLabel(currentTransaction.transactionType).label}
                    {currentTransaction.transactionType === "export" &&
                      currentTransaction.exportType &&
                      ` (${getExportTypeLabel(currentTransaction.exportType)})`}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Nhà cung cấp:</span>
                  <p className="font-medium">
                    {currentTransaction.supplier?.name || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Ngày tạo:</span>
                  <p className="font-medium">{formatDate(currentTransaction.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Người tạo:</span>
                  <p className="font-medium">
                    {currentTransaction.createdBy?.name || "Admin"}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Ghi chú:</span>
                  <p className="font-medium text-gray-700">
                    {currentTransaction.note || "Không có"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Danh sách sản phẩm</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Sản phẩm</th>
                        <th className="px-4 py-2 text-left">Phân loại</th>
                        <th className="px-4 py-2 text-center">SL</th>
                        <th className="px-4 py-2 text-right">Đơn giá</th>
                        <th className="px-4 py-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentTransaction.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={item.product?.images?.[0]?.url}
                                className="w-8 h-8 object-contain border rounded"
                                alt=""
                              />
                              <span>{item.product?.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2">{item.color} - {item.storage}</td>
                          <td className="px-4 py-2 text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">
                            {item.importPrice ? formatPrice(item.importPrice) : "—"}
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {item.importPrice
                              ? formatPrice(item.importPrice * item.quantity)
                              : "—"}
                          </td>
                        </tr>
                      ))}
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