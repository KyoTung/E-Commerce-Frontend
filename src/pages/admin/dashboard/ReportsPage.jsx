import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, RefreshCw } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import Loading from "../../../components/Loading";
import {
  fetchRevenueChart,
  fetchTopProducts,
} from "../../../features/adminSlice/dashboard/dashboardSlice";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { revenueChart, topProducts, loading } = useSelector((state) => state.dashboard);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState("revenue"); // 'revenue', 'product'

  useEffect(() => {
    const start = format(startDate, "yyyy-MM-dd");
    const end = format(endDate, "yyyy-MM-dd");
    dispatch(fetchRevenueChart({ period: "day", startDate: start, endDate: end }));
    dispatch(fetchTopProducts({ limit: 10, by: "quantity", startDate: start, endDate: end }));
  }, [dispatch, startDate, endDate]);

  const handleExportExcel = () => {
    let data = [];
    if (reportType === "revenue") {
      data = (revenueChart.data || []).map((item) => ({
        "Kỳ": item._id,
        "Doanh thu (VNĐ)": item.revenue || 0,
        "Số đơn hàng": item.orders || 0,
      }));
    } else {
      data = topProducts.map((item) => ({
        "Sản phẩm": item._id?.title,
        "Màu sắc": item._id?.color,
        "Dung lượng": item._id?.storage,
        "Số lượng bán": item.totalQuantity,
        "Doanh thu (VNĐ)": item.totalRevenue,
      }));
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BaoCao");
    XLSX.writeFile(wb, `BaoCao_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo kinh doanh</h1>
        <p className="text-sm text-gray-500 mt-1">Phân tích doanh thu và sản phẩm theo thời gian</p>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              className="border rounded-lg px-3 py-2 text-sm w-40"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              className="border rounded-lg px-3 py-2 text-sm w-40"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="revenue">Doanh thu theo ngày</option>
              <option value="product">Sản phẩm bán chạy</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              <Download size={16} /> Xuất Excel
            </button>
            <button
              onClick={() => {
                const start = format(startDate, "yyyy-MM-dd");
                const end = format(endDate, "yyyy-MM-dd");
                dispatch(fetchRevenueChart({ period: "day", startDate: start, endDate: end }));
                dispatch(fetchTopProducts({ limit: 10, by: "quantity", startDate: start, endDate: end }));
              }}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              <RefreshCw size={16} /> Làm mới
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex justify-center items-center"><Loading /></div>
      ) : (
        <>
          {/* Biểu đồ */}
          <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {reportType === "revenue" ? "Biểu đồ doanh thu theo ngày" : "Top sản phẩm theo doanh thu"}
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              {reportType === "revenue" ? (
                <LineChart data={revenueChart.data || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis tickFormatter={(v) => formatCurrency(v).replace("₫", "")} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#d70018" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" name="Số đơn hàng" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={topProducts.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id.title" />
                  <YAxis tickFormatter={(v) => formatCurrency(v).replace("₫", "")} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="totalRevenue" name="Doanh thu" fill="#d70018" />
                  <Bar dataKey="totalQuantity" name="Số lượng bán" fill="#3b82f6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Bảng dữ liệu */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {reportType === "revenue" ? "Chi tiết doanh thu" : "Chi tiết sản phẩm bán chạy"}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {reportType === "revenue" ? (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase">Kỳ</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase">Doanh thu</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase">Số đơn</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase">Sản phẩm</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase">Phân loại</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase">SL bán</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase">Doanh thu</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportType === "revenue" ? (
                    (revenueChart.data || []).map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-2 text-sm">{item._id}</td>
                        <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(item.revenue)}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.orders}</td>
                      </tr>
                    ))
                  ) : (
                    topProducts.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm font-medium">{item._id?.title}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item._id?.color} - {item._id?.storage}</td>
                        <td className="px-4 py-2 text-sm text-center">{item.totalQuantity}</td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-red-600">{formatCurrency(item.totalRevenue)}</td>
                      </tr>
                    ))
                  )}
                  {(reportType === "revenue" && (!revenueChart.data || revenueChart.data.length === 0)) && (
                    <tr><td colSpan="3" className="text-center py-8 text-gray-400">Không có dữ liệu</td></tr>
                  )}
                  {(reportType !== "revenue" && topProducts.length === 0) && (
                    <tr><td colSpan="4" className="text-center py-8 text-gray-400">Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;