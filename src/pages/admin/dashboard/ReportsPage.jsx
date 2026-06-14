// src/pages/admin/reports/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, RefreshCw } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import Loading from "../../../components/Loading";
import {
  fetchRevenueChart,
  fetchTopProducts,
  fetchRevenueByBrand,
  fetchRevenueByCategory,
} from "../../../features/adminSlice/dashboard/dashboardSlice";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { revenueChart, topProducts, brandData, categoryData, loading } = useSelector(
    (state) => state.dashboard
  );
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("revenue");

  useEffect(() => {
    const start = format(startDate, "yyyy-MM-dd");
    const end = format(endDate, "yyyy-MM-dd");
    dispatch(fetchRevenueChart({ period: "day", startDate: start, endDate: end }));
    dispatch(fetchTopProducts({ limit: 10, by: "quantity", startDate: start, endDate: end }));

    if (activeTab === "brand") {
      dispatch(fetchRevenueByBrand({ startDate: start, endDate: end }));
    } else if (activeTab === "category") {
      dispatch(fetchRevenueByCategory({ startDate: start, endDate: end }));
    }
  }, [dispatch, startDate, endDate, activeTab]);

  const handleExportExcel = () => {
    let data = [];
    if (activeTab === "revenue") {
      data = (revenueChart.data || []).map((item) => ({
        "Kỳ": item._id,
        "Doanh thu (VNĐ)": item.revenue || 0,
        "Số đơn hàng": item.orders || 0,
      }));
    } else if (activeTab === "product") {
      data = topProducts.map((item) => ({
        "Sản phẩm": item._id?.title,
        "Màu sắc": item._id?.color,
        "Dung lượng": item._id?.storage,
        "Số lượng bán": item.totalQuantity,
        "Doanh thu (VNĐ)": item.totalRevenue,
      }));
    } else if (activeTab === "brand") {
      data = brandData.map((item) => ({
        "Thương hiệu": item._id || "Khác",
        "Doanh thu (VNĐ)": item.revenue,
        "Số lượng bán": item.quantity,
      }));
    } else if (activeTab === "category") {
      data = categoryData.map((item) => ({
        "Danh mục": item._id || "Khác",
        "Doanh thu (VNĐ)": item.revenue,
        "Số lượng bán": item.quantity,
      }));
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BaoCao");
    XLSX.writeFile(wb, `BaoCao_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`);
  };

  const handleRefresh = () => {
    const start = format(startDate, "yyyy-MM-dd");
    const end = format(endDate, "yyyy-MM-dd");
    dispatch(fetchRevenueChart({ period: "day", startDate: start, endDate: end }));
    dispatch(fetchTopProducts({ limit: 10, by: "quantity", startDate: start, endDate: end }));
    if (activeTab === "brand") {
      dispatch(fetchRevenueByBrand({ startDate: start, endDate: end }));
    } else if (activeTab === "category") {
      dispatch(fetchRevenueByCategory({ startDate: start, endDate: end }));
    }
  };

  const COLORS = ["#d70018", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec489a", "#06b6d4"];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo kinh doanh</h1>
        <p className="text-sm text-gray-500 mt-1">Phân tích doanh thu, sản phẩm, thương hiệu và danh mục</p>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <DatePicker selected={startDate} onChange={setStartDate} className="border rounded-lg px-3 py-2 text-sm w-40" dateFormat="dd/MM/yyyy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <DatePicker selected={endDate} onChange={setEndDate} className="border rounded-lg px-3 py-2 text-sm w-40" dateFormat="dd/MM/yyyy" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportExcel} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              <Download size={16} /> Xuất Excel
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
              <RefreshCw size={16} /> Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { key: "revenue", label: "Doanh thu theo ngày" },
          { key: "product", label: "Sản phẩm bán chạy" },
          { key: "brand", label: "Theo thương hiệu" },
          { key: "category", label: "Theo danh mục" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 flex justify-center items-center"><Loading /></div>
      ) : (
        <>
          {/* Revenue Tab */}
          {activeTab === "revenue" && (
            <>
              <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Biểu đồ doanh thu theo ngày</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueChart.data || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis tickFormatter={(v) => formatCurrency(v).replace("₫", "")} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#d70018" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" name="Số đơn hàng" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Chi tiết doanh thu</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Kỳ</th><th className="px-4 py-3 text-right">Doanh thu</th><th className="px-4 py-3 text-right">Số đơn</th></tr></thead>
                    <tbody>
                      {(revenueChart.data || []).map((item) => (
                        <tr key={item._id}><td className="px-4 py-2">{item._id}</td><td className="px-4 py-2 text-right">{formatCurrency(item.revenue)}</td><td className="px-4 py-2 text-right">{item.orders}</td></tr>
                      ))}
                      {(!revenueChart.data || revenueChart.data.length === 0) && <tr><td colSpan="3" className="text-center py-8">Không có dữ liệu</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Product Tab */}
          {activeTab === "product" && (
            <>
              <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Top sản phẩm theo doanh thu</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topProducts.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id.title" />
                    <YAxis tickFormatter={(v) => formatCurrency(v).replace("₫", "")} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="totalRevenue" name="Doanh thu" fill="#d70018" />
                    <Bar dataKey="totalQuantity" name="Số lượng bán" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Chi tiết sản phẩm bán chạy</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"><tr><th>Sản phẩm</th><th>Phân loại</th><th className="text-center">SL bán</th><th className="text-right">Doanh thu</th></tr></thead>
                    <tbody>
                      {topProducts.map((item, idx) => (
                        <tr key={idx}><td>{item._id?.title}</td><td>{item._id?.color} - {item._id?.storage}</td><td className="text-center">{item.totalQuantity}</td><td className="text-right">{formatCurrency(item.totalRevenue)}</td></tr>
                      ))}
                      {topProducts.length === 0 && <tr><td colSpan="4" className="text-center py-8">Không có dữ liệu</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Brand Tab */}
          {activeTab === "brand" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Doanh thu theo thương hiệu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={brandData} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                      {brandData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Số lượng bán theo thương hiệu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={brandData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip formatter={(v) => formatNumber(v)} />
                    <Bar dataKey="quantity" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Bảng tổng hợp thương hiệu</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full"><thead className="bg-gray-50"><tr><th>Thương hiệu</th><th className="text-right">Doanh thu</th><th className="text-right">Số lượng bán</th></tr></thead>
                    <tbody>{brandData.map((b, i) => (<tr key={i}><td>{b._id || "Khác"}</td><td className="text-right">{formatCurrency(b.revenue)}</td><td className="text-right">{formatNumber(b.quantity)}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Category Tab */}
          {activeTab === "category" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Doanh thu theo danh mục</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                      {categoryData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Số lượng bán theo danh mục</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip formatter={(v) => formatNumber(v)} />
                    <Bar dataKey="quantity" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Bảng tổng hợp danh mục</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full"><thead className="bg-gray-50"><tr><th>Danh mục</th><th className="text-right">Doanh thu</th><th className="text-right">Số lượng bán</th></tr></thead>
                    <tbody>{categoryData.map((c, i) => (<tr key={i}><td>{c._id || "Khác"}</td><td className="text-right">{formatCurrency(c.revenue)}</td><td className="text-right">{formatNumber(c.quantity)}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;