import React, { useEffect, useState } from "react";
import { topProducts } from "@/constants";
import { PencilLine, Trash } from "lucide-react";
import axiosClient from "../../../axios-client";
import { useNavigate, Link, useParams } from "react-router-dom";
import Loading from "../../../compoments/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderDetail = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [items, setTtems] = useState(null);
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            
        });
    };

    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = () => {
        setIsLoading(true);
        axiosClient
            .get(`/orders/${id}`)
            .then(({ data }) => {
                setOrder(data.data);
                setTtems(data.data.items);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error("Failed to load order details");
            });
    };
    const getProduct = () => {
        setIsLoading(true);
        axiosClient
            .get(`/products/${id}`)
            .then(({ data }) => {
                setOrder(data.data);
                setTtems(data.data.items);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error("Failed to load order details");
            });
    };
    console.log("order ", order);

    const handleStatusChange = (newStatus) => {
        setOrder((prev) => ({ ...prev, status: newStatus }));
    };

    const handlePayMentStatusChange = (newStatus) => {
        setOrder((prev) => ({ ...prev, payment_status: newStatus }));
    };

    const handleSaveChanges = async () => {
        try {
            await axiosClient.put(`/orders/${order.id}`, order);
            toast.success("Update successful");
            setTimeout(() => {
                getOrder();
            }, 1000);
        } catch (error) {
            const msg = error?.response?.data?.message || "Update failed";
            toast.error(msg);
        }
    };

    

    if (isLoading || !order) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto bg-white px-4 py-8">
            <div className="mb-6 flex justify-start">
                <button
                    onClick={() => navigate(-1)}
                    className="btn rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
                >
                    ← Back
                </button>
                <button
                    onClick={() => getOrder()}
                    className="btn rounded-lg ml-10 bg-green-500 px-4 py-2 transition-colors hover:bg-green-600"
                >
                     Refresh
                </button>
            </div>
            <ToastContainer />
            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Order ID #{order.id}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Order Date: {formatDate(order.created_at)}</span>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/*  Product List */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Product List</h2>
                        <div className="space-y-4">
                            {items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-4 border-b pb-4"
                                >
                                    <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                                        <img
                                            src={item.product.image_url || "/placeholder-product.jpg"}
                                            alt={item.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">Name Order: {item.name}</h3>
                                        <h3 className="font-medium">Product Infomation</h3>
                                        <div className="mt-1 text-sm text-gray-600">
                                            <p>{item.product.name}</p>
                                            <p>RAM: {item.ram}</p>
                                            <p>Storage: {item.storage_capacity}</p>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-gray-600">Quantity: {item.qty}</span>
                                            <span className="font-medium">{formatPrice(item.unit_price * item.qty)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/*  Customer Information */}
                    <div className="space-y-6 border-l-2 pl-6">
                        <h2 className="text-lg font-semibold">Customer Information</h2>
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4">
                                <h3 className="mb-2 font-medium">Contact Details</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>Name: {order.name}</p>
                                    <p>Email: {order.email}</p>
                                    <p>Phone: {order.phone}</p>
                                </div>
                            </div>

                            <div className="rounded-lg border p-4">
                                <h3 className="mb-2 font-medium">Shipping Address</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>{order.address}</p>
                                    <p>
                                        {order.commune}, {order.district}, {order.city}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border p-4">
                                <h3 className="mb-2 font-medium">Payment Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(order.sub_total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping Fee:</span>
                                        <span>{formatPrice(order.shipping)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount:</span>
                                        <span>-{formatPrice(order.discount * order.sub_total)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 font-semibold">
                                        <span>Total:</span>
                                        <span>{formatPrice(order.grand_total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Order Management */}
                    <div className="space-y-6 border-l-2 pl-6">
                        <h2 className="text-lg font-semibold">Order Management</h2>
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4">
                                <div className="flex justify-between">
                                    <h3 className="mb-2 font-medium">Payment method</h3>
                                    <h3 className="mb-2 font-medium">{order.payment_method}</h3>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h3 className="mb-2 font-medium">Order Status</h3>
                                    <span
                                        className={`btn rounded-md p-2 text-white ${
                                            order.status === "pending"
                                                ? "bg-yellow-600"
                                                : order.status === "processing"
                                                  ? "bg-cyan-600"
                                                  : order.status === "shipped"
                                                    ? "bg-blue-600"
                                                    : order.status === "cancelled"
                                                      ? "bg-red-600"
                                                      : order.status === "delivered"
                                                        ? "bg-teal-600"
                                                        : order.status === "completed"
                                                          ? "bg-green-600"
                                                          : order.status === "refunded"
                                                            ? "bg-orange-600"
                                                            : ""
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <h3 className="mb-2 font-medium">Payment Status</h3>
                                    <span
                                        className={`text-nowrap rounded-md px-4 py-2 text-white ${order.payment_status === "paid" ? "bg-green-600" : "bg-red-600"}`}
                                    >
                                        {order.payment_status}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-lg border p-4">
                                <h3 className="mb-2 text-xl font-bold">Update Status</h3>
                                <select
                                    className="w-full rounded border p-2"
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                            <div className="rounded-lg border p-4">
                                <h3 className="mb-2 text-xl font-bold">Update Payment Status</h3>
                                <select
                                    className="w-full rounded border p-2"
                                    value={order.payment_status}
                                    onChange={(e) => handlePayMentStatusChange(e.target.value)}
                                >
                                    <option value="paid">paid</option>
                                    <option value="not paid">not Paid</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <button
                                    className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                                    onClick={handleSaveChanges}
                                >
                                    Save Changes
                                </button>

                                {/* <button
                                    className="w-full rounded border border-gray-300 py-2 hover:bg-gray-50"
                                    // onClick={handleDownloadInvoice}
                                >
                                    Download Invoice
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
