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
  const { overview, revenueChart, topProducts, lowStockItems, loading } =
    useSelector((state) => state.dashboard);
  const { orders, loading: orderLoading } = useSelector(
    (state) => state.orderAdmin,
  );
  const { products } = useSelector((state) => state.productAdmin);
  const [period, setPeriod] = useState("week");
  const [visitCount, setVisitCount] = useState(0);

  // Lấy thêm đơn hàng và sản phẩm nếu cần
  useEffect(() => {
    dispatch(fetchOverview({ period }));
    dispatch(
      fetchRevenueChart({
        period,
        range: period === "week" ? 7 : period === "month" ? 30 : 12,
      }),
    );
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

  useEffect(() => {
    if (period === "week") {
      dispatch(fetchRevenueChart({ period: "day", range: 7 }));
    } else if (period === "month") {
      dispatch(fetchRevenueChart({ period: "month", range: null }));
    } else if (period === "year") {
      dispatch(fetchRevenueChart({ period: "year", range: null }));
    }
  }, [dispatch, period]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  const formatNumber = (value) =>
    new Intl.NumberFormat("vi-VN").format(value || 0);

  // Helper chuyển đổi text hiển thị của period hiện tại
  const getPeriodText = () => {
    if (period === "week") return "7 ngày qua";
    if (period === "month") return "30 ngày qua";
    return "12 tháng qua";
  };

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
    const paidOrders = orders.filter(
      (o) => o.paymentStatus === "paid" || o.paymentStatus === "Paid",
    );
    return paidOrders.reduce((total, order) => {
      return (
        total + order.products.reduce((sum, item) => sum + (item.count || 0), 0)
      );
    }, 0);
  }, [orders]);

  // Thống kê trạng thái đơn hàng (Bao gồm chuẩn hóa chữ hoa/thường)
  const getOrderStats = React.useMemo(() => {
    const stats = {
      notProcessed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    if (orders && orders.length) {
      orders.forEach((order) => {
        const status = order.orderStatus?.toLowerCase();
        switch (status) {
          case "not processed":
            stats.notProcessed++;
            break;
          case "processing":
            stats.processing++;
            break;
          case "shipped":
          case "dispatched":
            stats.shipped++;
            break;
          case "delivered":
          case "completed":
            stats.delivered++;
            break;
          case "cancelled":
            stats.cancelled++;
            break;
          default:
            break;
        }
      });
    }
    return stats;
  }, [orders]);

  // Top sản phẩm bán chạy
  const topProductsList = topProducts || [];

  // Dữ liệu biểu đồ hình tròn cho phân bổ đơn
  const orderStatusData = [
    { name: "Hoàn thành", value: getOrderStats.delivered, color: "#22c55e" },
    { name: "Đang xử lý", value: getOrderStats.processing, color: "#f59e0b" },
    { name: "Đã hủy", value: getOrderStats.cancelled, color: "#ef4444" },
    { name: "Đang giao", value: getOrderStats.shipped, color: "#3b82f6" },
    { name: "Chưa xử lý", value: getOrderStats.notProcessed, color: "#9ca3af" },
  ].filter((item) => item.value > 0);

  // Đơn hàng gần đây (5 mới nhất)
  const recentOrders = React.useMemo(() => {
    if (!orders) return [];
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        customer: order.customerInfo?.name || "Khách vãng lai",
        amount: order.total,
        status: order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
      }));
  }, [orders]);

  // Đơn hàng chờ xử lý
  const pendingOrders = React.useMemo(() => {
    if (!orders) return [];
    return orders
      .filter(
        (o) =>
          o.orderStatus?.toLowerCase() === "not processed" ||
          o.orderStatus?.toLowerCase() === "processing",
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        customer: order.customerInfo?.name || "Khách vãng lai",
        amount: order.total,
        status: order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
        paymentMethod:
          order.paymentMethod === "cod"
            ? "Thanh toán khi nhận hàng (COD)"
            : "Chuyển khoản ngân hàng",
      }));
  }, [orders]);

  const formatYAxis = (value) => {
    if (value >= 1e9) return (value / 1e9).toFixed(1) + " tỷ";
    if (value >= 1e6) return (value / 1e6).toFixed(0) + " tr";
    return value.toLocaleString();
  };

  const chartData = (revenueChart.data || []).map((item) => {
    const id = String(item._id);
    let displayName = id;

    if (id.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [, month, day] = id.split("-");
      displayName = `${day}/${month}`;
    } else if (id.match(/^\d{4}-\d{2}$/)) {
      const [year, month] = id.split("-");
      displayName = `Tháng ${parseInt(month)}/${year}`;
    } else if (id.match(/^\d{4}$/)) {
      displayName = `Năm ${id}`;
    } else if (id.match(/^\d{4}-\d{2}$/) && period === "week") {
      const [year, week] = id.split("-");
      displayName = `Tuần ${week}/${year}`;
    }

    return {
      name: displayName,
      doanhThu: item.revenue || 0,
      soDon: item.orders || 0,
    };
  });

  // Chuyển đổi nhãn trạng thái Tiếng Việt trực quan
  const getStatusBadge = (status) => {
    const map = {
      "Not Processed": {
        text: "Chưa xử lý",
        class: "bg-gray-100 text-gray-800",
      },
      Processing: {
        text: "Đang xử lý",
        class: "bg-yellow-100 text-yellow-800",
      },
      Confirmed: {
        text: "Đã xác nhận",
        class: "bg-blue-100 text-blue-800",
      },
      Shipped: { text: "Đang giao", class: "bg-blue-100 text-blue-800" },
      Dispatched: { text: "Đang giao", class: "bg-blue-100 text-blue-800" },
      Delivered: { text: "Đã giao hàng", class: "bg-green-100 text-green-800" },
      Completed: { text: "Hoàn thành", class: "bg-teal-100 text-teal-800" },
      Cancelled: { text: "Đã hủy", class: "bg-red-100 text-red-800" },
    };

    const config = map[status] || {
      text: status,
      class: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.text}
      </span>
    );
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod === "week") {
      dispatch(fetchRevenueChart({ period: "day", range: 7 }));
    } else if (newPeriod === "month") {
      dispatch(fetchRevenueChart({ period: "month" }));
    } else {
      dispatch(fetchRevenueChart({ period: "year" }));
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Tiêu đề điều hướng */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển tổng quan</h1>
          <div className="text-sm text-gray-500 mt-1">
            Trang chủ / Thống kê kinh doanh số
          </div>
        </div>

        {/* Thanh điều khiển bộ lọc thời gian toàn cục của các KPI */}
        <div className="flex bg-gray-200/80 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => handlePeriodChange("week")}
            className={`px-4 py-1.5 text-xs rounded-lg font-bold transition-all ${period === "week" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Tuần này
          </button>
          <button
            onClick={() => handlePeriodChange("month")}
            className={`px-4 py-1.5 text-xs rounded-lg font-bold transition-all ${period === "month" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Tháng này
          </button>
          <button
            onClick={() => handlePeriodChange("year")}
            className={`px-4 py-1.5 text-xs rounded-lg font-bold transition-all ${period === "year" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Năm này
          </button>
        </div>
      </div>

      {/* KPI Hàng 1 */}
      {loading && !overview.totalRevenue ? (
        <div className="h-40 flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden">
            <span className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
              {getPeriodText()}
            </span>
            <div className="flex justify-between items-start mt-1">
              <div>
                <p className="text-sm text-gray-500">Tổng doanh thu</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(overview.totalRevenue)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={22} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">Số liệu chu kỳ đã chọn</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden">
            <span className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
              {getPeriodText()}
            </span>
            <div className="flex justify-between items-start mt-1">
              <div>
                <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">
                  {formatNumber(overview.totalOrders)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="text-blue-600" size={22} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">Số lượng đơn phát sinh</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden">
            <span className="absolute top-0 right-0 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
              Toàn thời gian
            </span>
            <div className="flex justify-between items-start mt-1">
              <div>
                <p className="text-sm text-gray-500">Sản phẩm đã bán</p>
                <p className="text-2xl font-bold">
                  {formatNumber(totalSoldProducts)}
                </p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="text-indigo-600" size={22} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">Tổng sản phẩm tiêu thụ tích lũy</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden">
            <span className="absolute top-0 right-0 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
              Toàn thời gian
            </span>
            <div className="flex justify-between items-start mt-1">
              <div>
                <p className="text-sm text-gray-500">Lượt truy cập</p>
                <p className="text-2xl font-bold">{formatNumber(visitCount)}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaEyeIcon className="text-purple-600" size={22} />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">Tổng lượt xem hệ thống</div>
          </div>
        </div>
      )}

      {/* KPI Hàng 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden">
          <span className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
            {getPeriodText()}
          </span>
          <div className="flex justify-between items-start mt-1">
            <div>
              <p className="text-sm text-gray-500">Khách hàng mới</p>
              <p className="text-2xl font-bold">
                {formatNumber(overview.newCustomers)}
              </p>
            </div>
            <div className="p-2 bg-pink-100 rounded-lg">
              <Users className="text-pink-600" size={22} />
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400">Tài khoản mới kích hoạt</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden">
          <span className="absolute top-0 right-0 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
            Thời gian thực
          </span>
          <div className="flex justify-between items-start mt-1">
            <div>
              <p className="text-sm text-gray-500">Sản phẩm tồn kho thấp</p>
              <p className="text-2xl font-bold">
                {formatNumber(overview.lowStockCount)}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={22} />
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-600 font-medium">Cần lập kế hoạch nhập hàng</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden">
          <span className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
            {getPeriodText()}
          </span>
          <div className="flex justify-between items-start mt-1">
            <div>
              <p className="text-sm text-gray-500">Giá trị đơn trung bình</p>
              <p className="text-2xl font-bold">
                {formatCurrency(overview.averageOrderValue)}
              </p>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="text-emerald-600" size={22} />
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400">Giá trị AOV trong kỳ</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden">
          <span className="absolute top-0 right-0 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
            Toàn thời gian
          </span>
          <div className="flex justify-between items-start mt-1">
            <div>
              <p className="text-sm text-gray-500">Tỷ lệ hoàn thành đơn</p>
              <p className="text-2xl font-bold">
                {overview.totalOrders
                  ? Math.round(
                      (getOrderStats.delivered / overview.totalOrders) * 100,
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="p-2 bg-teal-100 rounded-lg">
              <CheckCircle className="text-teal-600" size={22} />
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400">Đơn thành công / Tổng đơn hệ thống</div>
        </div>
      </div>

      {/* Biểu đồ Doanh thu & Hình tròn */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Biến động doanh thu</h3>
              <p className="text-xs text-gray-400 mt-0.5">Biểu đồ hiển thị chi tiết theo: <span className="font-semibold text-red-600">{getPeriodText()}</span></p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="doanhThu"
                name="Doanh thu bán hàng"
                stroke="#d70018"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-bold text-gray-800">Tỷ lệ trạng thái đơn hàng</h3>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">Thống kê dữ liệu: <span className="font-semibold text-slate-600">Toàn bộ đơn hệ thống</span></p>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {orderStatusData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatNumber(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Chưa ghi nhận dữ liệu đơn hàng
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách Đơn hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Đơn hàng mới nhất</h3>
              <p className="text-xs text-gray-400 mt-0.5">Hiển thị <span className="font-semibold text-slate-600">5 đơn hàng vừa phát sinh</span> thời gian thực</p>
            </div>
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-sm text-red-600 hover:underline font-medium"
            >
              Xem tất cả
            </button>
          </div>
          {orderLoading ? (
            <Loading />
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Chưa có đơn hàng nào được tạo
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/admin/order-detail/${order.id}`)}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      #{order.id.slice(-6)} — {order.customer}
                    </div>
                    <div className="text-xs text-gray-500">{order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      {formatCurrency(order.amount)}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Đơn hàng chờ xử lý</h3>
              <p className="text-xs text-gray-400 mt-0.5">Danh sách tồn đọng cần xử lý gấp</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
              Yêu cầu xử lý
            </span>
          </div>
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8 text-green-600 font-medium">
              ✅ Tuyệt vời! Không có đơn hàng tồn đọng
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/admin/order-detail/${order.id}`)}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      #{order.id.slice(-6)} — {order.customer}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.date} • {order.paymentMethod}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      {formatCurrency(order.amount)}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm bán chạy & Tồn kho thấp */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-bold text-gray-800">Top 5 sản phẩm bán chạy nhất</h3>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">Xếp hạng theo sản lượng bán: <span className="font-semibold text-red-600">{getPeriodText()}</span></p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                <tr>
                  <th className="p-2 text-left">Sản phẩm</th>
                  <th className="p-2 text-left">Cấu hình / Màu</th>
                  <th className="p-2 text-center">Đã bán</th>
                  <th className="p-2 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topProductsList.slice(0, 5).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="p-2 flex items-center gap-2">
                      <img
                        src={item._id?.image}
                        className="w-8 h-8 object-contain border rounded bg-white"
                        alt=""
                      />
                      <span className="font-medium text-gray-800 line-clamp-1">
                        {item._id?.title}
                      </span>
                    </td>
                    <td className="p-2 text-gray-600">
                      {item._id?.storage} — {item._id?.color}
                    </td>
                    <td className="p-2 text-center font-bold text-gray-900">
                      {item.totalQuantity}
                    </td>
                    <td className="p-2 text-right font-bold text-red-600">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                  </tr>
                ))}
                {topProductsList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">
                      Chưa có thống kê sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-amber-600">
            ⚠️ Cảnh báo sản phẩm sắp hết hàng
          </h3>
          <p className="text-xs text-gray-400 mb-4">Trạng thái kho thực tế hiện tại (Tồn kho &lt; 5)</p>
          {lowStockItems.length === 0 ? (
            <div className="text-center py-6 text-green-600 font-medium">
              ✅ An toàn! Không có sản phẩm nào dưới ngưỡng tối thiểu
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                  <tr>
                    <th className="p-2 text-left">Sản phẩm</th>
                    <th className="p-2 text-left">Phân loại</th>
                    <th className="p-2 text-center">Tồn kho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lowStockItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="p-2 flex items-center gap-2">
                        <img
                          src={item.image}
                          className="w-8 h-8 object-contain border rounded bg-white"
                          alt=""
                        />
                        <span className="font-medium text-gray-800 line-clamp-1">
                          {item.productTitle}
                        </span>
                      </td>
                      <td className="p-2 text-gray-600">
                        {item.color} — {item.storage}
                      </td>
                      <td className="p-2 text-center">
                        <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          {item.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Khối Tổng kết dưới chân trang */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-bold text-gray-800">
          Tổng quan số lượng theo trạng thái đơn
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 mb-4">Số lượng lũy kế trên <span className="font-semibold text-slate-600">tất cả dữ liệu đơn hàng</span> thu thập được</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="border border-gray-100 rounded-lg p-3 text-center bg-gray-50/50">
            <div className="text-gray-500">Chưa xử lý</div>
            <div className="text-2xl font-bold text-gray-700 mt-1">
              {getOrderStats.notProcessed}
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center bg-gray-50/50">
            <div className="text-gray-500">Đang xử lý</div>
            <div className="text-2xl font-bold text-amber-500 mt-1">
              {getOrderStats.processing}
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center bg-gray-50/50">
            <div className="text-gray-500">Đang giao hàng</div>
            <div className="text-2xl font-bold text-blue-500 mt-1">
              {getOrderStats.shipped}
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center bg-gray-50/50">
            <div className="text-gray-500">Đã giao thành công</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {getOrderStats.delivered}
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center bg-gray-50/50">
            <div className="text-gray-500">Đã hủy đơn</div>
            <div className="text-2xl font-bold text-red-500 mt-1">
              {getOrderStats.cancelled}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;