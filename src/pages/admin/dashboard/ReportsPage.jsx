// src/pages/admin/reports/ReportsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, RefreshCw, Calendar, TrendingUp, ShoppingBag, Layers, Award } from "lucide-react";
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
  const { revenueChart, topProducts = [], brandData = [], categoryData = [], loading } = useSelector(
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

  // Tính toán nhanh số liệu tổng hợp hiển thị lên KPI Cards
  const summaryStats = useMemo(() => {
    const revData = revenueChart?.data || [];
    const totalRev = revData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalOrders = revData.reduce((sum, item) => sum + (item.orders || 0), 0);
    const totalItemsSold = topProducts.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
    
    return { totalRev, totalOrders, totalItemsSold };
  }, [revenueChart, topProducts]);

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

  const COLORS = ["#d70018", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec489a", "#06b6d4"];

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
      {/* Tiêu đề trang */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Báo cáo phân tích kinh doanh</h1>
          <p className="text-sm text-slate-500 mt-0.5">Theo dõi dòng tiền, hiệu suất sản phẩm và phân phối danh mục thị trường</p>
        </div>
      </div>

      {/* Thanh công cụ / Bộ lọc tinh gọn */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Từ ngày</span>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-red-500 transition">
                <Calendar size={16} className="text-slate-400 mr-2" />
                <DatePicker selected={startDate} onChange={setStartDate} className="bg-transparent text-sm text-slate-700 outline-none w-24" dateFormat="dd/MM/yyyy" />
              </div>
            </div>
            <div className="relative">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Đến ngày</span>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-red-500 transition">
                <Calendar size={16} className="text-slate-400 mr-2" />
                <DatePicker selected={endDate} onChange={setEndDate} className="bg-transparent text-sm text-slate-700 outline-none w-24" dateFormat="dd/MM/yyyy" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button onClick={handleRefresh} className="flex items-center justify-center p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition active:scale-95" title="Làm mới dữ liệu">
              <RefreshCw size={18} />
            </button>
            <button onClick={handleExportExcel} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-600/10 transition active:scale-95">
              <Download size={16} /> Xuất tập tin Excel
            </button>
          </div>
        </div>
      </div>

      {/* Hàng Khối Thẻ Tóm Tắt Nhanh (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-50 text-[#d70018]"><TrendingUp size={24} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng doanh thu kỳ này</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{formatCurrency(summaryStats.totalRev)}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng lượng đơn phát sinh</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{formatNumber(summaryStats.totalOrders)} đơn</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><Layers size={24} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Khối lượng sản phẩm bán lẻ</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{formatNumber(summaryStats.totalItemsSold)} sản phẩm</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Hiện Đại */}
      <div className="flex p-1 bg-slate-200/60 rounded-xl mb-6 max-w-2xl overflow-x-auto [scrollbar-width:none]">
        {[
          { key: "revenue", label: "Biến động doanh thu" },
          { key: "product", label: "Hiệu suất sản phẩm" },
          { key: "brand", label: "Thống kê hãng" },
          { key: "category", label: "Cơ cấu danh mục" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 whitespace-nowrap text-center py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-[#d70018] shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Khu vực Biểu đồ & Bảng chi tiết */}
      {loading ? (
        <div className="h-80 flex justify-center items-center bg-white border rounded-2xl shadow-sm"><Loading /></div>
      ) : (
        <div className="space-y-6">
          {/* REVENUE TAB */}
          {activeTab === "revenue" && (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">Biểu đồ đường dòng tiền kinh doanh</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueChart.data || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis tickFormatter={(v) => formatYAxis(v)} tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
                    <Tooltip formatter={(v, name) => [name === "Doanh thu" ? formatCurrency(v) : `${v} đơn`, name]} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#d70018" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="orders" name="Số đơn hàng" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-base font-bold text-slate-800">Chi tiết doanh thu thống kê</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr><th className="px-6 py-3">Mốc thời gian</th><th className="px-6 py-3 text-right">Tổng doanh thu phát sinh</th><th className="px-6 py-3 text-right">Sản lượng đơn</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {(revenueChart.data || []).map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-3 font-semibold text-slate-700">{item._id}</td>
                          <td className="px-6 py-3 text-right text-emerald-600 font-bold">{formatCurrency(item.revenue)}</td>
                          <td className="px-6 py-3 text-right">{formatNumber(item.orders)} đơn</td>
                        </tr>
                      ))}
                      {(!revenueChart.data || revenueChart.data.length === 0) && (
                        <tr><td colSpan="3" className="text-center py-12 text-slate-400 font-normal">Hệ thống chưa ghi nhận dữ liệu trong khoảng thời gian này.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* PRODUCT TAB */}
          {activeTab === "product" && (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-base font-bold text-slate-800 mb-4">Cột doanh thu & sản lượng top sản phẩm</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topProducts.slice(0, 8)} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="_id.title" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tickFormatter={(v) => formatYAxis(v)} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(v, name) => name === "Doanh thu" ? formatCurrency(v) : `${v} sản phẩm`} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalRevenue" name="Doanh thu" fill="#d70018" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="right" dataKey="totalQuantity" name="Số lượng bán" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-base font-bold text-slate-800">Bảng theo dõi cấu hình bán chạy</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr><th className="px-6 py-3">Tên hàng hóa</th><th className="px-6 py-3">Thuộc tính phân loại</th><th className="px-6 py-3 text-center">Sản lượng bán lẻ</th><th className="px-6 py-3 text-right">Tổng doanh thu</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {topProducts.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-3 font-semibold text-slate-800 flex items-center gap-2"><Award size={16} className={idx < 3 ? "text-amber-500" : "text-slate-300"} />{item._id?.title}</td>
                          <td className="px-6 py-3 text-slate-500">{item._id?.color} • {item._id?.storage}</td>
                          <td className="px-6 py-3 text-center font-bold text-slate-700">{formatNumber(item.totalQuantity)}</td>
                          <td className="px-6 py-3 text-right text-[#d70018] font-bold">{formatCurrency(item.totalRevenue)}</td>
                        </tr>
                      ))}
                      {topProducts.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-12 text-slate-400 font-normal">Chưa thu thập được dữ liệu bán lẻ.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* BRAND TAB */}
          {activeTab === "brand" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-base font-bold text-slate-800 mb-4">Cơ cấu thị phần doanh số theo hãng</h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={brandData} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={85} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                        {brandData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-base font-bold text-slate-800 mb-4">Tổng số sản phẩm bán lẻ theo hãng</h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brandData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip formatter={(v) => formatNumber(v)} />
                      <Bar dataKey="quantity" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-base font-bold text-slate-800">Bảng phân phối tổng hợp thương hiệu</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr><th className="px-6 py-3">Nhãn hàng</th><th className="px-6 py-3 text-right">Tổng giá trị doanh số</th><th className="px-6 py-3 text-right">Tổng sản lượng tiêu thụ</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {brandData.map((b, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-3 font-semibold text-slate-800">{b._id || "Nhãn hàng khác"}</td>
                          <td className="px-6 py-3 text-right text-emerald-600 font-bold">{formatCurrency(b.revenue)}</td>
                          <td className="px-6 py-3 text-right">{formatNumber(b.quantity)} sản phẩm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY TAB */}
          {activeTab === "category" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-base font-bold text-slate-800 mb-4">Cơ cấu thị phần doanh số theo nhóm ngành</h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={85} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                        {categoryData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-base font-bold text-slate-800 mb-4">Tổng số sản phẩm bán lẻ theo nhóm ngành</h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip formatter={(v) => formatNumber(v)} />
                      <Bar dataKey="quantity" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-base font-bold text-slate-800">Bảng phân phối tổng hợp danh mục ngành hàng</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr><th className="px-6 py-3">Danh mục phân loại</th><th className="px-6 py-3 text-right">Tổng giá trị doanh số</th><th className="px-6 py-3 text-right">Tổng sản lượng tiêu thụ</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {categoryData.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-3 font-semibold text-slate-800">{c._id || "Danh mục khác"}</td>
                          <td className="px-6 py-3 text-right text-emerald-600 font-bold">{formatCurrency(c.revenue)}</td>
                          <td className="px-6 py-3 text-right">{formatNumber(c.quantity)} sản phẩm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Hàm định dạng gọn các giá trị trục tung Y-Axis lớn (ví dụ: 10.000.000 -> 10 tr)
const formatYAxis = (value) => {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + " tỷ";
  if (value >= 1e6) return (value / 1e6).toFixed(0) + " tr";
  return value.toLocaleString();
};

export default ReportsPage;