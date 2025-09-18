import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { overviewData, recentSalesData, topProducts as demoTopProducts } from "@/constants";
import { Footer } from "@/layouts/admin/footer";
import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";

const DashboardPage = () => {
    const { theme } = useTheme();
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPaidOrders, setTotalPaidOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalSaleProduct, setTotalSaleProduct] = useState(0);
    const [topSaleProducts, setTopSaleProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Tạo các promise để fetch đồng thời
        setLoading(true);
        Promise.all([
            axiosClient.get("/total-products"), // Tổng số lượng sản phẩm còn hàng
            axiosClient.get("/total-paid-product"), // Tổng tiền đã bán
            axiosClient.get("/total-users"), // Tổng số user
            axiosClient.get("/total-sale-product"), // Tổng số lượng sản phẩm đã bán
            axiosClient.get("/top-sale-product"), // Top 5 sản phẩm bán chạy nhất
        ])
            .then(([products, paidOrders, users, saleProduct, topProducts]) => {
                setTotalProducts(products.data.total_quantity || 0);
                setTotalPaidOrders(paidOrders.data.total_revenue || 0);
                setTotalUsers(users.data.total_user || 0);
                setTotalSaleProduct(saleProduct.data.total_sold_product_quantity || 0);
                setTopSaleProducts(topProducts.data.data || []);
            })
            .catch((err) => {
                // Xử lý lỗi, có thể toast hoặc log
            })
            .finally(() => setLoading(false));
    }, []);

    console.log(topSaleProducts);
    const formatNumber = (num) => num.toLocaleString();

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Total Products</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {loading ? "..." : formatNumber(totalProducts) + " Products"}
                        </p>
                        
                        
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Total Paid Orders</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {loading ? "..." : `${totalPaidOrders.toLocaleString()}₫`}
                        </p>
                        
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Users size={26} />
                        </div>
                        <p className="card-title">Total Members</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {loading ? "..." : formatNumber(totalUsers)}
                        </p>
                        
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <CreditCard size={26} />
                        </div>
                        <p className="card-title">Sold</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {loading ? "..." : formatNumber(totalSaleProduct) + " Products"} 
                        </p>
                       
                    </div>
                </div>
            </div>
   
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Top Orders</p>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Product</th>
                                    <th className="table-head">Price</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Sold</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {(loading ? demoTopProducts : topSaleProducts).map((product, idx) => (
                                    <tr
                                        key={product.product_id || product.number || idx}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{idx + 1}</td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                <img
                                                    src={product.product?.image_url || product.image}
                                                    alt={product.product?.name || product.name}
                                                    className="size-14"
                                                />
                                                <div className="flex flex-col">
                                                    <p>{product.product?.name || product.name}</p>
                                                    <p className="font-normal text-slate-600 dark:text-slate-400">
                                                        {product.product?.short_description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">{`${product.product?.price.toLocaleString()}₫ ` || product.price}</td>
                                        <td className="table-cell">{product.product?.status === 1 ? "In stock" : "Out of stock"}</td>
                                        <td className="table-cell">
                                           {product.total_sold}
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
