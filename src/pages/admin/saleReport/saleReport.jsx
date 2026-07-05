import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TrendingUp,
  DollarSign,
  Package,
  CreditCard,
  Users,
  AlertOctagon,
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/admin/footer";
import { getAllCoupon } from "../../../features/adminSlice/coupons/couponSlice";
import { getAllOrder } from "../../../features/adminSlice/orders/orderSlice";
import { getAllProducts } from "../../../features/adminSlice/products/productSlice";
import { getAllUser } from "../../../features/adminSlice/customerSlice/customerSlice";

const SaleReport = () => {
  const { theme } = useTheme();
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const { products } = useSelector((state) => state.productAdmin);
  const { orders } = useSelector((state) => state.orderAdmin);
  const { allUsers } = useSelector((state) => state.customer);
  
  useEffect(() => {
    if (currentUser?.token) {
      dispatch(getAllOrder(currentUser.token));
      dispatch(getAllProducts({ token: currentUser.token }));
      dispatch(getAllUser(currentUser.token));
      dispatch(getAllCoupon({ token: currentUser.token }));
    }
  }, [dispatch, currentUser]);

  // Hàm format 
  const formatNumber = (num) => num.toLocaleString("vi-VN");
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  // Tính toán dữ liệu báo cáo chuyên sâu
  const reportData = useMemo(() => {
    if (!products || !orders || !allUsers) {
      return null;
    }

    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
    const cancelledOrders = orders.filter((o) => o.orderStatus === "Cancelled");

    // 1. Chỉ số Tài chính Cơ bản
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lostRevenue = cancelledOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // Average Order Value (AOV) - Giá trị trung bình mỗi đơn hàng
    const aov = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    // Tổng giá trị hàng tồn kho (Vốn kẹt trong kho)
    const totalInventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0);

    // 2. Thống kê phương thức thanh toán
    const paymentMethodsStats = paidOrders.reduce((acc, order) => {
      const method = order.paymentMethod || "unknown";
      if (!acc[method]) acc[method] = { count: 0, revenue: 0 };
      acc[method].count += 1;
      acc[method].revenue += (order.total || 0);
      return acc;
    }, {});

    const paymentList = Object.entries(paymentMethodsStats)
      .map(([method, data]) => ({ method, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    // 3. Phân tích Khách hàng (Top Spenders)
    const customerStats = paidOrders.reduce((acc, order) => {
      const customerId = order.orderby?._id || order.orderby;
      const customerName = order.customerInfo?.name || "Khách vãng lai";
      const phone = order.customerInfo?.phone || "";
      
      if (!acc[customerId]) {
        acc[customerId] = { id: customerId, name: customerName, phone, totalSpent: 0, orderCount: 0 };
      }
      acc[customerId].totalSpent += (order.total || 0);
      acc[customerId].orderCount += 1;
      return acc;
    }, {});

    const topCustomers = Object.values(customerStats)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // 4. Phân tích Sản phẩm mang lại Doanh thu cao nhất
    const productRevenueStats = {};
    paidOrders.forEach((order) => {
      order.products.forEach((item) => {
        const productId = item.product?._id || item.product;
        const productName = item.product?.title || `Product ${String(productId).substring(0, 8)}`;
        const count = item.count || 0;
        const price = item.product?.price || item.price || 0;
        const revenue = count * price;

        if (!productRevenueStats[productId]) {
          productRevenueStats[productId] = {
            id: productId,
            name: productName,
            totalSold: 0,
            totalRevenue: 0,
            stock: item.product?.quantity || 0
          };
        }
        productRevenueStats[productId].totalSold += count;
        productRevenueStats[productId].totalRevenue += revenue;
      });
    });

    const topProductsByRevenue = Object.values(productRevenueStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    return {
      totalRevenue,
      lostRevenue,
      aov,
      totalInventoryValue,
      paymentList,
      topCustomers,
      topProductsByRevenue,
      conversionRate: allUsers.length > 0 ? ((paidOrders.length / allUsers.length) * 100).toFixed(1) : 0
    };
  }, [products, orders, allUsers]);

  const getPaymentMethodText = (method) => {
    switch (method?.toLowerCase()) {
      case "cod": return "Thanh toán khi nhận hàng (COD)";
      case "bank_transfer": return "Chuyển khoản ngân hàng";
      case "momo": return "Ví MoMo";
      case "vnpay": return "VNPay";
      case "paypal": return "PayPal";
      default: return method;
    }
  };

  if (!reportData) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu báo cáo...</div>;

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Báo Cáo Kinh Doanh
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Phân tích chuyên sâu về doanh thu, khách hàng và hiệu suất sản phẩm.
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Giá Trị Trung Bình/Đơn (AOV)</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(reportData.aov)}</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng Giá Trị Tồn Kho</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(reportData.totalInventoryValue)}</p>
            </div>
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tỷ Lệ Chuyển Đổi</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{reportData.conversionRate}%</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">Đơn thành công / Tổng User</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Thất Thoát (Đơn Hủy)</p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">{formatPrice(reportData.lostRevenue)}</p>
            </div>
            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
              <AlertOctagon className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Payment Methods & Top Customers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Methods */}
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cơ Cấu Thanh Toán</h2>
          </div>
          <div className="space-y-4">
            {reportData.paymentList.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{getPaymentMethodText(item.method)}</p>
                  <p className="text-sm text-gray-500">{item.count} đơn hàng</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{formatPrice(item.revenue)}</p>
                  <p className="text-sm text-gray-500">
                    {((item.revenue / reportData.totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Khách Hàng Chi Tiêu Cao Nhất</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-gray-500 dark:border-gray-700">
                <tr>
                  <th className="pb-3 font-medium">Khách hàng</th>
                  <th className="pb-3 font-medium text-center">Số đơn</th>
                  <th className="pb-3 font-medium text-right">Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {reportData.topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.phone || "N/A"}</p>
                    </td>
                    <td className="py-3 text-center text-gray-900 dark:text-gray-300">{customer.orderCount}</td>
                    <td className="py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {formatPrice(customer.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Section: Detailed Product Revenue */}
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hiệu Suất Sản Phẩm Theo Doanh Thu</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
              <tr>
                <th className="p-3 font-medium">Tên sản phẩm</th>
                <th className="p-3 font-medium text-center">Đã bán</th>
                <th className="p-3 font-medium text-center">Tồn kho</th>
                <th className="p-3 font-medium text-right">Doanh thu mang lại</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {reportData.topProductsByRevenue.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="p-3 text-center text-gray-600 dark:text-gray-300">
                    {formatNumber(product.totalSold)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock < 10 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {formatNumber(product.stock)}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(product.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SaleReport;