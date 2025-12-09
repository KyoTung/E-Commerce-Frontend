import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";

import { getAllOrder } from "../../../features/adminSlice/orders/orderSlice";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux State
  const { orders, loading, error } = useSelector((state) => state.orderAdmin);
  
  // Local State
  const [search, setSearch] = useState("");

  // 1. Fetch Orders
  useEffect(() => {
    dispatch(getAllOrder()); 
  }, [dispatch]);

  // Helpers
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("vi-VN", options);
  };

  // 2. Client-side Search
  const filteredOrders = search.trim()
    ? orders.filter((ord) => 
        ord._id?.toLowerCase().includes(search.toLowerCase()) || 
        ord.customerInfo?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  // Status Badge Colors
  const getStatusColor = (status) => {
    const colors = {
      "Not Processed": "bg-gray-100 text-gray-700",
      "Processing": "bg-blue-100 text-blue-700",
      "Shipped": "bg-cyan-100 text-cyan-700",
      "Delivered": "bg-teal-100 text-teal-700",
      "Completed": "bg-green-100 text-green-700",
      "Cancelled": "bg-red-100 text-red-700",
      "Refunded": "bg-orange-100 text-orange-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      "paid": "bg-green-100 text-green-700",
      "pending": "bg-yellow-100 text-yellow-700",
      "not_paid": "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Orders Management</h1>
      
      <div className="card">
        {/* --- TOOLBAR --- */}
        <div className="card-header flex flex-col md:flex-row items-center gap-4 py-4 px-6 border-b border-gray-100">
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => dispatch(getAllOrder())}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition w-full md:w-auto"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          <div className="w-full md:ml-auto md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order ID or Customer..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* --- TABLE --- */}
        {loading ? (
          <div className="p-12">
            <Loading className="flex items-center justify-center" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 italic">
            Error loading orders. Please try refreshing.
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative w-full overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3 w-16 text-center">#</th>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Payment</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord, index) => (
                      <tr
                        key={ord._id}
                        onClick={() => navigate(`/admin/order-detail/${ord._id}`)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-center text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-600">
                          #{ord._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {ord.customerInfo?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-400 truncate max-w-[150px]" title={ord.customerInfo?.address}>
                              {ord.customerInfo?.address || "No address"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{ord.customerInfo?.phone || "N/A"}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {formatDate(ord.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(ord.paymentStatus)}`}>
                              {ord.paymentStatus === "paid" ? "Paid" : 
                               ord.paymentStatus === "not_paid" ? "Not Paid" : 
                               ord.paymentStatus}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase font-semibold pl-1">
                              {ord.paymentMethod}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ord.orderStatus)}`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-500 italic">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;