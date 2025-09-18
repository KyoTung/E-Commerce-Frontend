import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { useNavigate } from "react-router-dom";
import Loading from "../../../compoments/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        return new Date(dateString).toLocaleString("en-GB", options).replace(",", "");
    };

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = () => {
        setIsLoading(true);
        axiosClient
            .get("/orders")
            .then(({ data }) => {
                setIsLoading(false);
                setOrders(data.data);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    // Filter by id or customer name
    const filteredOrders = search.trim()
        ? orders.filter((ord) => ord.id.toString().includes(search.trim()) || (ord.name && ord.name.toLowerCase().includes(search.toLowerCase())))
        : orders;

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
                {isLoading ? (
                    <Loading className="flex items-center justify-center" />
                ) : (
                    <div className="card-body p-0">
                        <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                            <table className="table">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-head">Order ID</th>
                                        <th className="table-head">Customer</th>
                                        <th className="table-head">Total</th>
                                        <th className="table-head">Date/Time</th>
                                        <th className="table-head">Payment</th>
                                        <th className="table-head">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {filteredOrders.length > 0
                                        ? filteredOrders.map((ord, index) => (
                                              <tr
                                                  key={ord.id}
                                                  className="table-row cursor-pointer transition-colors duration-200 "
                                                  onClick={() => navigate(`/admin/order-detail/${ord.id}`)}
                                              >
                                                  <td className="table-cell">{ord.id}</td>
                                                  <td className="table-cell">{ord.name}</td>
                                                  <td className="table-cell">{formatPrice(ord.grand_total)}</td>
                                                  <td className="table-cell">{formatDate(ord.created_at)}</td>
                                                  <td>
                                                      <span
                                                          className={`text-nowrap rounded-md p-2 text-white ${
                                                              ord.payment_status === "paid" ? "bg-green-600" : "bg-red-600"
                                                          }`}
                                                      >
                                                          {ord.payment_status}
                                                      </span>
                                                  </td>
                                                  <td className="table-cell">
                                                      <button
                                                          className={`btn cursor-default rounded-md p-2 text-white ${
                                                              ord.status === "pending"
                                                                  ? "bg-yellow-600"
                                                                  : ord.status === "processing"
                                                                    ? "bg-cyan-600"
                                                                    : ord.status === "shipped"
                                                                      ? "bg-blue-600"
                                                                      : ord.status === "delivered"
                                                                        ? "bg-teal-600"
                                                                        : ord.status === "completed"
                                                                          ? "bg-green-600"
                                                                          : ord.status === "cancelled"
                                                                            ? "bg-red-600"
                                                                            : ord.status === "refunded"
                                                                              ? "bg-orange-600"
                                                                              : "bg-white"
                                                          }`}
                                                      >
                                                          {ord.status === "pending"
                                                              ? "Pending"
                                                              : ord.status === "processing"
                                                                ? "Processing"
                                                                : ord.status === "shipped"
                                                                  ? "Shipped"
                                                                  : ord.status === "delivered"
                                                                    ? "Delivered"
                                                                    : ord.status === "cancelled"
                                                                      ? "Cancelled"
                                                                      : ord.status === "completed"
                                                                        ? "Completed"
                                                                        : ord.status === "refunded"
                                                                          ? "Refunded"
                                                                          : "Unknown"}
                                                      </button>
                                                  </td>
                                              </tr>
                                          ))
                                        : search.trim() && (
                                              <tr>
                                                  <td
                                                      colSpan={6}
                                                      className="py-8 text-center text-gray-500"
                                                  >
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
