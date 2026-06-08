import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaEye as FaEyeIcon } from "react-icons/fa";
import {
  fetchOverview,
  fetchRevenueChart,
  fetchTopProducts,
  fetchLowStock,
} from "../../../features/adminSlice/dashboard/dashboardSlice";
import { getAllOrder } from "../../../features/adminSlice/orders/orderSlice";
import { getAllProducts } from "../../../features/adminSlice/products/productSlice";
import trafficService from "../../../features/traffic/trafficService";
import Loading from "../../../components/Loading";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { overview, revenueChart, topProducts, lowStockItems, loading } = useSelector(
    (state) => state.dashboard
  );
  const { orders, loading: orderLoading } = useSelector((state) => state.orderAdmin);
  const { products } = useSelector((state) => state.productAdmin);
  const [period, setPeriod] = useState("week");
  const [visitCount, setVisitCount] = useState(0);

  // Lấy thêm đơn hàng và sản phẩm nếu cần (đã có trong dashboard slice, nhưng orderAdmin có thể chưa có)
  useEffect(() => {
    dispatch(fetchOverview({ period }));
    dispatch(fetchRevenueChart({ period, range: period === "week" ? 7 : period === "month" ? 30 : 12 }));
    dispatch(fetchTopProducts({ limit: 5, by: "quantity", period }));
    dispatch(fetchLowStock(5));
    dispatch(getAllOrder({ page: 1, limit: 100, search: "" }));
    dispatch(getAllProducts());
    const fetchStats = async () => {
      const data = await trafficService.getTrafficStats();
      if (data) setVisitCount(data.totalVisits);
    };
    fetchStats();
  }, [dispatch, period]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);
  const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);

  // Tính tổng tồn kho từ variants
  const getTotalQuantity = (product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
    }
    return product.quantity || 0;
  };

  // Tổng số sản phẩm đã bán (tính từ đơn hàng đã thanh toán)
  const totalSoldProducts = React.useMemo(() => {
    if (!orders) return 0;
    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
    return paidOrders.reduce((total, order) => {
      return total + order.products.reduce((sum, item) => sum + (item.count || 0), 0);
    }, 0);
  }, [orders]);

  // Thống kê trạng thái đơn hàng
  const getOrderStats = React.useMemo(() => {
    const stats = { notProcessed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    if (orders && orders.length) {
      orders.forEach((order) => {
        switch (order.orderStatus) {
          case "Not Processed": stats.notProcessed++; break;
          case "Processing": stats.processing++; break;
          case "Shipped": case "Dispatched": stats.shipped++; break;
          case "Delivered": case "Completed": stats.delivered++; break;
          case "Cancelled": stats.cancelled++; break;
          default: break;
        }
      });
    }
    return stats;
  }, [orders]);

  // Top sản phẩm bán chạy (lấy từ dashboard slice)
  const topProductsList = topProducts || [];

  // Dữ liệu pie chart cho phân bổ đơn (có thể cải tiến từ API)
  const orderStatusData = [
    { name: "Hoàn thành", value: getOrderStats.delivered, color: "#22c55e" },
    { name: "Đang xử lý", value: getOrderStats.processing, color: "#f59e0b" },
    { name: "Đã hủy", value: getOrderStats.cancelled, color: "#ef4444" },
    { name: "Đang giao", value: getOrderStats.shipped, color: "#3b82f6" },
    { name: "Chưa xử lý", value: getOrderStats.notProcessed, color: "#9ca3af" },
  ].filter(item => item.value > 0);

  // Đơn hàng gần đây (5 mới nhất)
  const recentOrders = React.useMemo(() => {
    if (!orders) return [];
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        customer: order.customerInfo?.name || "Khách",
        amount: order.total,
        status: order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
      }));
  }, [orders]);

  // Đơn hàng chờ xử lý (pending)
  const pendingOrders = React.useMemo(() => {
    if (!orders) return [];
    return orders
      .filter((o) => o.orderStatus === "Not Processed" || o.orderStatus === "Processing")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        customer: order.customerInfo?.name || "Khách",
        amount: order.total,
        status: order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
        paymentMethod: order.paymentMethod,
      }));
  }, [orders]);

  const formatYAxis = (value) => {
    if (value >= 1e9) return (value / 1e9).toFixed(1) + " tỷ";
    if (value >= 1e6) return (value / 1e6).toFixed(0) + " tr";
    return value.toLocaleString();
  };

  const chartData = (revenueChart.data || []).map((item) => ({
    name: item._id,
    doanhThu: item.revenue || 0,
    soDon: item.orders || 0,
  }));

  const getStatusBadge = (status) => {
    const map = {
      "Not Processed": "bg-gray-100 text-gray-800",
      Processing: "bg-yellow-100 text-yellow-800",
      Shipped: "bg-blue-100 text-blue-800",
      Delivered: "bg-green-100 text-green-800",
      Completed: "bg-teal-100 text-teal-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    const className = map[status] || "bg-gray-100 text-gray-800";
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{status}</span>;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500 mt-1">Home / Dashboard</div>
      </div>

      {/* Cards hàng 1 - KPI chính */}
      {loading && !overview.totalRevenue ? (
        <div className="h-40 flex justify-center"><Loading /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-500">Tổng doanh thu</p><p className="text-2xl font-bold">{formatCurrency(overview.totalRevenue)}</p></div>
              <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="text-green-600" size={22} /></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">+12.5% so với tuần trước</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-500">Tổng đơn hàng</p><p className="text-2xl font-bold">{formatNumber(overview.totalOrders)}</p></div>
              <div className="p-2 bg-blue-100 rounded-lg"><ShoppingBag className="text-blue-600" size={22} /></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">+8.2% so với tuần trước</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-500">Sản phẩm đã bán</p><p className="text-2xl font-bold">{formatNumber(totalSoldProducts)}</p></div>
              <div className="p-2 bg-indigo-100 rounded-lg"><TrendingUp className="text-indigo-600" size={22} /></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">Tổng số lượng bán ra</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex justify-between items-start">
              <div><p className="text-sm text-gray-500">Lượt truy cập</p><p className="text-2xl font-bold">{formatNumber(visitCount)}</p></div>
              <div className="p-2 bg-purple-100 rounded-lg"><FaEyeIcon className="text-purple-600" size={22} /></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">Toàn bộ thời gian</div>
          </div>
        </div>
      )}

      {/* Cards hàng 2 - bổ sung */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-start">
            <div><p className="text-sm text-gray-500">Khách hàng mới</p><p className="text-2xl font-bold">{formatNumber(overview.newCustomers)}</p></div>
            <div className="p-2 bg-pink-100 rounded-lg"><Users className="text-pink-600" size={22} /></div>
          </div>
          <div className="mt-3 text-xs text-red-500">-3.4% so với tuần trước</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-start">
            <div><p className="text-sm text-gray-500">Sản phẩm tồn kho thấp</p><p className="text-2xl font-bold">{formatNumber(overview.lowStockCount)}</p></div>
            <div className="p-2 bg-yellow-100 rounded-lg"><AlertTriangle className="text-yellow-600" size={22} /></div>
          </div>
          <div className="mt-3 text-xs text-yellow-600">Cần nhập hàng</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-start">
            <div><p className="text-sm text-gray-500">Giá trị đơn TB</p><p className="text-2xl font-bold">{formatCurrency(overview.averageOrderValue)}</p></div>
            <div className="p-2 bg-emerald-100 rounded-lg"><TrendingUp className="text-emerald-600" size={22} /></div>
          </div>
          <div className="mt-3 text-xs text-gray-500">AOV</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-start">
            <div><p className="text-sm text-gray-500">Tỷ lệ hoàn thành</p><p className="text-2xl font-bold">{overview.totalOrders ? Math.round((getOrderStats.delivered / overview.totalOrders) * 100) : 0}%</p></div>
            <div className="p-2 bg-teal-100 rounded-lg"><CheckCircle className="text-teal-600" size={22} /></div>
          </div>
          <div className="mt-3 text-xs text-gray-500">Đơn đã giao / Tổng</div>
        </div>
      </div>

      {/* Biểu đồ doanh thu + Pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Biến động doanh thu</h3>
            <div className="flex gap-2">
              <button onClick={() => setPeriod("week")} className={`px-3 py-1 text-xs rounded-md ${period === "week" ? "bg-[#d70018] text-white" : "bg-gray-100"}`}>7 ngày</button>
              <button onClick={() => setPeriod("month")} className={`px-3 py-1 text-xs rounded-md ${period === "month" ? "bg-[#d70018] text-white" : "bg-gray-100"}`}>30 ngày</button>
              <button onClick={() => setPeriod("year")} className={`px-3 py-1 text-xs rounded-md ${period === "year" ? "bg-[#d70018] text-white" : "bg-gray-100"}`}>12 tháng</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="doanhThu" name="Doanh thu" stroke="#d70018" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-bold mb-4">Phân bổ đơn hàng</h3>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {orderStatusData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatNumber(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="text-center py-10 text-gray-500">Chưa có dữ liệu</div>}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-xs"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng gần đây và chờ xử lý */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Đơn hàng gần đây</h3><button onClick={() => navigate("/admin/orders")} className="text-sm text-red-600 hover:underline">Xem tất cả</button></div>
          {orderLoading ? <Loading /> : recentOrders.length === 0 ? <div className="text-center py-8 text-gray-400">Chưa có đơn hàng</div> : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div><div className="font-medium">#{order.id.slice(-6)} - {order.customer}</div><div className="text-xs text-gray-500">{order.date}</div></div>
                  <div className="text-right"><div className="font-bold text-red-600">{formatCurrency(order.amount)}</div>{getStatusBadge(order.status)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Đơn hàng chờ xử lý</h3><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Cần xử lý</span></div>
          {pendingOrders.length === 0 ? <div className="text-center py-8 text-green-600">✅ Không có đơn chờ xử lý</div> : (
            <div className="space-y-3">
              {pendingOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div><div className="font-medium">#{order.id.slice(-6)} - {order.customer}</div><div className="text-xs text-gray-500">{order.date} - {order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}</div></div>
                  <div className="text-right"><div className="font-bold text-red-600">{formatCurrency(order.amount)}</div>{getStatusBadge(order.status)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top sản phẩm và cảnh báo tồn kho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-bold mb-4">Top sản phẩm bán chạy</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-xs uppercase"><tr><th className="p-2 text-left">Sản phẩm</th><th className="p-2 text-center">Đã bán</th><th className="p-2 text-right">Doanh thu</th></tr></thead>
              <tbody>
                {topProductsList.slice(0,5).map((item, idx) => (
                  <tr key={idx} className="border-t"><td className="p-2 flex items-center gap-2"><img src={item._id?.image} className="w-8 h-8 object-contain border rounded" /><span className="text-sm">{item._id?.title}</span></td><td className="p-2 text-center font-semibold">{item.totalQuantity}</td><td className="p-2 text-right text-red-600">{formatCurrency(item.totalRevenue)}</td></tr>
                ))}
                {topProductsList.length === 0 && <tr><td colSpan="3" className="text-center py-4 text-gray-400">Chưa có dữ liệu</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">⚠️ Sản phẩm tồn kho thấp</h3>
          {lowStockItems.length === 0 ? <div className="text-center py-6 text-green-600">✅ Không có sản phẩm nào dưới ngưỡng</div> : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50"><tr><th className="p-2 text-left">Sản phẩm</th><th className="p-2 text-left">Phân loại</th><th className="p-2 text-center">Tồn</th></tr></thead>
                <tbody>
                  {lowStockItems.map((item, idx) => (
                    <tr key={idx} className="border-t"><td className="p-2 flex items-center gap-2"><img src={item.image} className="w-8 h-8 object-contain border rounded" /><span>{item.productTitle}</span></td><td className="p-2">{item.color} - {item.storage}</td><td className="p-2 text-center"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">{item.quantity}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer Order Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-bold mb-4">Tổng quan trạng thái đơn hàng</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="border rounded-lg p-3 text-center"><div className="text-sm text-gray-500">Chưa xử lý</div><div className="text-2xl font-bold">{getOrderStats.notProcessed}</div></div>
          <div className="border rounded-lg p-3 text-center"><div className="text-sm text-gray-500">Đang xử lý</div><div className="text-2xl font-bold">{getOrderStats.processing}</div></div>
          <div className="border rounded-lg p-3 text-center"><div className="text-sm text-gray-500">Đang giao</div><div className="text-2xl font-bold">{getOrderStats.shipped}</div></div>
          <div className="border rounded-lg p-3 text-center"><div className="text-sm text-gray-500">Đã giao</div><div className="text-2xl font-bold">{getOrderStats.delivered}</div></div>
          <div className="border rounded-lg p-3 text-center"><div className="text-sm text-gray-500">Đã hủy</div><div className="text-2xl font-bold">{getOrderStats.cancelled}</div></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;