import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { RefreshCw, Search, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { getStock } from "../../../features/adminSlice/inventory/inventorySlice";
import Loading from "../../../components/Loading";

const StockOverview = () => {
  const dispatch = useDispatch();
  const { stockItems = [], totalStock, loading } = useSelector((state) => state.inventory);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(getStock({ search: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  const handleRefresh = () => {
    dispatch(getStock({ search: debouncedSearch }));
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num || 0);
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 0) return { label: "Hết hàng", className: "bg-red-100 text-red-800" };
    if (quantity < 5) return { label: "Sắp hết", className: "bg-orange-100 text-orange-800" };
    return { label: "Còn hàng", className: "bg-green-100 text-green-800" };
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tồn kho hiện tại</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng số biến thể: {formatNumber(totalStock)}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
        >
          <RefreshCw size={18} /> Tải lại
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 w-full md:w-80">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm..."
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Bảng tồn kho */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {stockItems?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy sản phẩm nào.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Ảnh</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Màu sắc</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Dung lượng</th>
                    <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Tồn kho</th>
                    <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Đã bán</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {stockItems.map((item, idx) => {
                    const status = getStockStatus(item.quantity);
                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="whitespace-nowrap px-6 py-4">
                          <img
                            src={item.image}
                            alt={item.productTitle}
                            className="w-12 h-12 object-contain border rounded bg-white p-1"
                          />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {item.productTitle}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{item.color}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{item.storage}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold text-gray-800">
                          {formatNumber(item.quantity)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                          {formatNumber(item.sold)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
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

      {/* Ghi chú */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-700 flex items-start gap-3">
        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>Lưu ý:</strong> Danh sách hiển thị tất cả biến thể sản phẩm. Nếu muốn điều chỉnh tồn kho thủ công, hãy sử dụng chức năng{" "}
          <span className="font-semibold">Xuất kho</span> với loại "Điều chỉnh giảm (kiểm kê)".
        </div>
      </div>
    </div>
  );
};

export default StockOverview;