import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrder } from "../../../features/adminSlice/orders/orderSlice";

const Orders = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orders, loading, error } = useSelector((state) => state.orderAdmin);
  const currentUser = useSelector((state) => state.auth.user);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("vi-VN", options);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    if (currentUser?.token) {
      dispatch(getAllOrder(currentUser.token));
    } else {
      toast.error("User not authenticated");
    }
  };

  // Filter by order ID or customer name
  const filteredOrders = search.trim()
    ? orders.filter((ord) => 
        ord._id.toLowerCase().includes(search.toLowerCase()) || 
        ord.customerInfo?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Not Processed":
        return "bg-gray-600";
      case "Processing":
        return "bg-blue-600";
      case "Shipped":
        return "bg-cyan-600";
      case "Delivered":
        return "bg-teal-600";
      case "Completed":
        return "bg-green-600";
      case "Cancelled":
        return "bg-red-600";
      case "Refunded":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  // Function to get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "not_paid":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Orders Management</h1>
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => getOrders()}
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Refresh
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID or Customer Name"
          className="ml-auto rounded border px-3 py-2 focus:outline-none"
        />
      </div>
      
      <div className="card">
        {loading ? (
          <Loading className="flex items-center justify-center" />
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            Error loading orders
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">#</th>
                    <th className="table-head">Order ID</th>
                    <th className="table-head">Customer</th>
                    <th className="table-head">Phone</th>
                    <th className="table-head">Total</th>
                    <th className="table-head">Date/Time</th>
                    <th className="table-head">Payment</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord, index) => (
                      <tr
                        key={ord._id}
                        className="table-row cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                        onClick={() => navigate(`/admin/order-detail/${ord._id}`)}
                      >
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell font-mono text-sm">
                          {ord._id.substring(0, 8)}...
                        </td>
                        <td className="table-cell">
                          <div>
                            <div className="font-medium">{ord.customerInfo?.name || "N/A"}</div>
                            <div className="text-xs text-gray-500">
                              {ord.customerInfo?.address || "No address"}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">{ord.customerInfo?.phone || "N/A"}</td>
                        <td className="table-cell font-semibold">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="table-cell">
                          {formatDate(ord.createdAt)}
                        </td>
                        <td className="table-cell">
                          <div className=" gap-1">
                            <span
                              className={`text-nowrap rounded-md px-2 py-1 text-center text-xs text-white ${getPaymentStatusColor(ord.paymentStatus)}`}
                            >
                              {ord.paymentStatus === "paid" ? "Paid" : 
                               ord.paymentStatus === "not_paid" ? "Not Paid" : 
                               ord.paymentStatus?.charAt(0).toUpperCase() + ord.paymentStatus?.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {ord.paymentMethod === "momo" ? "Momo" : 
                               ord.paymentMethod === "cod" ? "COD" : 
                               ord.paymentMethod?.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span
                            className={`text-nowrap rounded-md px-3 py-1 text-white ${getStatusColor(ord.orderStatus)}`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-gray-500"
                      >
                        {search.trim() ? "No orders found matching your search." : "No orders found."}
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