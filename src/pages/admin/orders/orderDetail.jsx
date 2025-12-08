import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, RefreshCw, Printer } from "lucide-react"; // Icon mới

// Import API & Thunks chuẩn
import { getOrder, updateOrder } from "../../../features/adminSlice/orders/orderSlice";
import Loading from "../../../components/Loading";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, loading: orderLoading, error: orderError } = useSelector(
    (state) => state.orderAdmin
  );

  // 1. Fetch Data
  useEffect(() => {
    if (id) {
      dispatch(getOrder(id));
    }
  }, [id, dispatch]);

  // Helpers
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      price || 0
    );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status Colors Helpers
  const getStatusColor = (status) => {
    const map = {
      "Not Processed": "bg-gray-100 text-gray-800",
      "Confirmed": "bg-blue-100 text-blue-800",
      "Processing": "bg-yellow-100 text-yellow-800",
      "Dispatched": "bg-indigo-100 text-indigo-800",
      "Delivered": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800",
      "Returned": "bg-orange-100 text-orange-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const map = {
      paid: "bg-green-100 text-green-800",
      not_paid: "bg-red-100 text-red-800",
      failed: "bg-red-200 text-red-900",
      refunded: "bg-orange-100 text-orange-800",
      authorized: "bg-blue-100 text-blue-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  // 2. Handle Update Logic
  const handleUpdate = async (field, value) => {
    try {
      // Chuẩn bị payload động
      const updatePayload = {
        orderId: id,
        orderData: {
          status: field === "status" ? value : order.orderStatus,
          paymentStatus: field === "paymentStatus" ? value : order.paymentStatus,
        },
      };

      const result = await dispatch(updateOrder(updatePayload)).unwrap();
      
      toast.success("Updated successfully");
      dispatch(getOrder(id));
      
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Update failed");
    }
  };

  // 3. Computed Summary
  const orderSummary = useMemo(() => {
    if (!order?.products) return { count: 0, total: 0 };
    return {
      count: order.products.reduce((acc, item) => acc + (item.count || 0), 0),
      total: order.products.reduce(
        (acc, item) => acc + (item.price || 0) * (item.count || 0),
        0
      ),
    };
  }, [order]);

  if (orderLoading) return <Loading />;
  
  if (orderError || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500 mb-4">Error loading order details.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ToastContainer />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" /> Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Order #{order._id?.substring(0, 8)}
            <span className={`text-base font-normal px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Printer size={18} /> Print
          </button>
          <button 
            onClick={() => dispatch(getOrder(id))}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PRODUCTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-semibold text-gray-800">Order Items ({orderSummary.count})</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.products?.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row gap-4 items-start">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={item.product?.images?.[0]?.url || "https://via.placeholder.com/150"} 
                      alt={item.product?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate" title={item.product?.title}>
                      {item.product?.title || "Product Unavailable"}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                      {item.color && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs border">
                          Color: {item.color}
                        </span>
                      )}
                      {/* Thêm size/storage nếu có trong model */}
                    </div>
                  </div>

                  {/* Price & Qty */}
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{formatPrice(item.price)}</div>
                    <div className="text-sm text-gray-500">Qty: {item.count}</div>
                    <div className="font-semibold text-gray-900 mt-1">
                      {formatPrice((item.price || 0) * (item.count || 0))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(orderSummary.total)}</span>
              </div>
              {/* <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{formatPrice(0)}</span>
              </div> */}
              <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INFO & ACTIONS */}
        <div className="space-y-6">
          
          {/* Status Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Order Actions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleUpdate("status", e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition"
                >
                  <option value="Not Processed">Not Processed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => handleUpdate("paymentStatus", e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition"
                >
                  <option value="not_paid">Not Paid</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Customer Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {(order.customerInfo?.name?.[0] || "U").toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.customerInfo?.name || "Guest User"}</p>
                  <p className="text-gray-500">{order.user?.email || "No Email"}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 my-3"></div>
              
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact</span>
                <p className="text-gray-700">{order.customerInfo?.phone || "N/A"}</p>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Shipping Address</span>
                <p className="text-gray-700 leading-relaxed">
                  {order.customerInfo?.address || "No shipping address provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Payment Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Method</span>
                <span className="font-medium uppercase">{order.paymentMethod || "COD"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
             
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;