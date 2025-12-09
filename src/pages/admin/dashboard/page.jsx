import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Package,
  CreditCard,
  DollarSign,
  Users,
  FileText,
  Tag,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/admin/footer";
import { getAllCoupon } from "../../../features/adminSlice/coupons/couponSlice";
import { getAllBlog } from "../../../features/adminSlice/blog/blogSlice";
import { getAllOrder } from "../../../features/adminSlice/orders/orderSlice";
import { getAllProducts } from "../../../features/adminSlice/products/productSlice";
import { getAllUser } from "../../../features/adminSlice/customerSlice/customerSlice";

const DashboardPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const { products } = useSelector((state) => state.productAdmin);
  const { orders } = useSelector((state) => state.orderAdmin);
  const { allUsers } = useSelector((state) => state.customer);
  const { blogs } = useSelector((state) => state.blogAdmin);
  const { coupons } = useSelector((state) => state.couponAdmin);

  useEffect(() => {
    getCoupons();
    getBlogs();
    getOrders();
    getProducts();
    getUsers();
  }, []);

  const getCoupons = async () => {
    dispatch(getAllCoupon({ token: currentUser.token }));
  };

  const getBlogs = () => {
    if (currentUser?.token) {
      dispatch(getAllBlog({ token: currentUser.token }));
    }
  };

  const getOrders = () => {
    if (currentUser?.token) {
      dispatch(getAllOrder(currentUser.token));
    }
  };

  const getProducts = () => {
    dispatch(getAllProducts({ token: currentUser?.token }));
  };

  const getUsers = () => {
    dispatch(getAllUser(currentUser.token));
  };

  // Tính toán các thống kê
  const dashboardStats = useMemo(() => {
    if (!products || !orders || !allUsers || !blogs || !coupons) {
      return {
        totalProducts: 0,
        totalSoldProducts: 0,
        lowStockProducts: 0,
        totalCoupons: 0,
        totalOrders: 0,
        totalPaidOrders: 0,
        totalRevenue: 0,
        totalBlogs: 0,
        totalUsers: 0,
        topSaleProducts: [],
        recentOrders: [],
        lowStockProductsList: [],
        pendingOrders: [],
      };
    }

    // 1. Tổng số sản phẩm
    const totalProducts = products.length;

    // 2. Tổng số sản phẩm đã bán (từ các đơn hàng đã thanh toán)
    const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
    const totalSoldProducts = paidOrders.reduce((total, order) => {
      return (
        total + order.products.reduce((sum, item) => sum + (item.count || 0), 0)
      );
    }, 0);

    // 3. Sản phẩm sắp hết hàng (stock < 10)
    const lowStockProductsList = products.filter(
      (product) => product.quantity < 10
    );
    const lowStockProducts = lowStockProductsList.length;

    // 4. Tổng số coupon
    const totalCoupons = coupons.length;

    // 5. Tổng số đơn hàng
    const totalOrders = orders.length;

    // 6. Tổng số đơn hàng đã thanh toán
    const totalPaidOrdersCount = paidOrders.length;

    // 7. Tổng doanh thu từ đơn hàng đã thanh toán
    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    // 8. Tổng số blog
    const totalBlogs = blogs.length;

    // 9. Tổng số người dùng
    const totalUsers = allUsers.length;

    // 10. Top sản phẩm bán chạy
    const productSales = {};

    // Tính tổng số lượng bán cho mỗi sản phẩm
    paidOrders.forEach((order) => {
      order.products.forEach((item) => {
        const productId = item.product?._id || item.product;
        const productName =
          item.product?.title ||
          `Product ${item.product?._id?.substring(0, 8)}`;
        const productImage = item.product?.images?.[0]?.url;
        const productPrice = item.product?.price || item.price;
        const count = item.count || 0;

        if (!productSales[productId]) {
          productSales[productId] = {
            product: {
              _id: productId,
              name: productName,
              image_url: productImage,
              price: productPrice,
              status: item.product?.status || 1,
              description: item.product?.description || "",
              quantity: item.product?.quantity || 0,
            },
            total_sold: 0,
          };
        }
        productSales[productId].total_sold += count;
      });
    });

    // Chuyển object thành mảng và sắp xếp theo số lượng bán
    const topSaleProducts = Object.values(productSales)
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, 10);

    // 11. Đơn hàng gần đây (5 đơn mới nhất)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        customer: order.customerInfo?.name || "Unknown",
        amount: order.total,
        status: order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
        paymentStatus: order.paymentStatus,
      }));

    // 12. Đơn hàng đang chờ xử lý
    const pendingOrders = orders
      .filter(
        (order) =>
          order.orderStatus === "Not Processed" ||
          order.orderStatus === "Processing"
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        customer: order.customerInfo?.name || "Unknown",
        amount: order.total,
        status: order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
        paymentMethod: order.paymentMethod,
      }));

    return {
      totalProducts,
      totalSoldProducts,
      lowStockProducts,
      lowStockProductsList,
      totalCoupons,
      totalOrders,
      totalPaidOrdersCount,
      totalRevenue,
      totalBlogs,
      totalUsers,
      topSaleProducts,
      recentOrders,
      pendingOrders,
    };
  }, [products, orders, allUsers, blogs, coupons]);

  const formatNumber = (num) => {
    return num.toLocaleString("vi-VN");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Not Processed": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      Processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Completed: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Refunded: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Confirmed: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Dispatched: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      Returned: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    };

    const className = statusConfig[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {status}
      </span>
    );
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod": return "COD";
      case "bank_transfer": return "Bank Transfer";
      case "momo": return "MoMo";
      case "vnpay": return "VNPay";
      case "paypal": return "PayPal";
      default: return method;
    }
  };

  // Tính thống kê nhanh
  const getOrderStats = useMemo(() => {
    const stats = {
      notProcessed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    if (orders && orders.length > 0) {
      orders.forEach(order => {
        switch (order.orderStatus) {
          case "Not Processed":
            stats.notProcessed++;
            break;
          case "Processing":
            stats.processing++;
            break;
          case "Shipped":
          case "Dispatched":
            stats.shipped++;
            break;
          case "Delivered":
          case "Completed":
            stats.delivered++;
            break;
          case "Cancelled":
            stats.cancelled++;
            break;
        }
      });
    }

    return stats;
  }, [orders]);

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid - 8 cards (4 columns, 2 rows) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Products */}
        <div className="rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboardStats.totalProducts)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">
              {dashboardStats.lowStockProducts} low stock
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900">
              <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboardStats.totalOrders)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">
              {getOrderStats.delivered} delivered
            </span>
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(dashboardStats.totalRevenue)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            From {dashboardStats.totalPaidOrdersCount} paid orders
          </div>
        </div>

        {/* Card 4: Total Users */}
        <div className="rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-pink-100 p-3 dark:bg-pink-900">
              <Users className="h-6 w-6 text-pink-600 dark:text-pink-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboardStats.totalUsers)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Registered customers
          </div>
        </div>

        {/* Card 5: Sold Products */}
        <div className="rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Sold Products
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboardStats.totalSoldProducts)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Total units sold
          </div>
        </div>

        {/* Card 6: Low Stock Products */}
        <div className="rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Low Stock
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboardStats.lowStockProducts)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Products with quantity &lt; 10
          </div>
        </div>

        {/* Card 7: Active Coupons */}
        <div className="rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
              <Tag className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Coupons
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboardStats.totalCoupons)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Available discounts
          </div>
        </div>

        {/* Card 8: Total Blogs */}
        <div className="rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
              <FileText className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Blogs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboardStats.totalBlogs)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Published articles
          </div>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Top Selling Products */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Selling Products
              </h2>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Top 10
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Product
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Price
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Sold
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {dashboardStats.topSaleProducts.length > 0 ? (
                    dashboardStats.topSaleProducts.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={
                                  item.product.image_url ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={item.product.name}
                              />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.product.name.length > 20
                                  ? `${item.product.name.substring(0, 20)}...`
                                  : item.product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatPrice(item.product.price)}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatNumber(item.total_sold)}
                          </div>
                        </td>
                        <td className="py-3">
                          {item.product.quantity > 0 ? (
                            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-300">
                              {formatNumber(item.product.quantity)}
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-300">
                              Out of stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No sales data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Low Stock Products
              </h2>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Quantity &lt; 10
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Product
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Price
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Stock
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {dashboardStats.lowStockProductsList.length > 0 ? (
                    dashboardStats.lowStockProductsList.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={
                                  product.images?.[0]?.url ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={product.title}
                              />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.title.length > 20
                                  ? `${product.title.substring(0, 20)}...`
                                  : product.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {product.brand || "No brand"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatPrice(product.price)}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-2 rounded-full bg-yellow-500"
                                style={{ width: `${(product.quantity / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                              {product.quantity}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          {product.quantity <= 5 ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-300">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Critical
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Low
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                        <p className="mt-2">All products have sufficient stock</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Orders */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Latest 5
              </span>
            </div>
            <div className="space-y-4">
              {dashboardStats.recentOrders.length > 0 ? (
                dashboardStats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                          <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900 dark:text-white">
                            Order #{order.id.substring(0, 8)}...
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {order.customer} • {order.date}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatPrice(order.amount)}
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="mx-auto h-8 w-8" />
                  <p className="mt-2">No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Orders */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pending Orders
              </h2>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Needs Attention
              </span>
            </div>
            <div className="space-y-4">
              {dashboardStats.pendingOrders.length > 0 ? (
                dashboardStats.pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900">
                          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900 dark:text-white">
                            Order #{order.id.substring(0, 8)}...
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {order.customer} • {order.date}
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Method: {getPaymentMethodText(order.paymentMethod)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatPrice(order.amount)}
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                  <p className="mt-2">No pending orders</p>
                  <p className="text-sm">All orders have been processed</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Order Status Overview
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-lg border p-4 text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Processed</div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{getOrderStats.notProcessed}</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing</div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{getOrderStats.processing}</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Shipped</div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{getOrderStats.shipped}</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{getOrderStats.delivered}</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{getOrderStats.cancelled}</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;