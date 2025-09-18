import React, { useEffect, useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import axiosClient from "../../../axios-client";
import Loading from "../../../compoments/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DiscountCode = () => {
    const [editingCode, setEditingCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [codes, setCodes] = useState([]);
    const [editCode, setEditCode] = useState({ name: "", value: "", start_date: "", end_date: "" });
    const [newCode, setNewCode] = useState({ name: "", value: "", start_date: "", end_date: "" });

    useEffect(() => {
        getCodes();
    }, []);

    const getCodes = () => {
        setIsLoading(true);
        axiosClient
            .get("/discount-codes")
            .then(({ data }) => {
                setIsLoading(false);
                setCodes(data.data);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post("/discount-codes", newCode);
            if (response.status === 200) {
                toast.success(response.data.message || "Added discount code successfully");
                setTimeout(() => {
                    getCodes();
                    setNewCode({
                        name: "",
                        value: "",
                        start_date: "",
                        end_date: "",
                    });
                }, 1200);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                toast.error(Object.values(error.response.data.errors).join(" | "));
            } else {
                toast.error(error.response?.data?.message || "Error adding discount code");
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.put(`/discount-codes/${editingCode.id}`, editCode);
            if (response.status === 200) {
                toast.success("Discount code updated successfully");
                setEditingCode(null);
                getCodes();
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                toast.error(Object.values(error.response.data.errors).join(" | "));
            } else {
                toast.error(error.response?.data?.message || "Error updating discount code");
            }
        }
    };

    const startEdit = (code) => {
        setEditingCode(code);
        setEditCode({
            name: code.name || "",
            value: code.value || "",
            start_date: code.start_date || "",
            end_date: code.end_date || "",
        });
    };

    const onDelete = (code) => {
        if (!window.confirm("Are you sure you want to delete this discount code?")) {
            return;
        }
        axiosClient
            .delete(`/discount-codes/${code.id}`)
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data?.message || "Discount code deleted successfully");
                    getCodes();
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Delete failed");
            });
    };

    return (
        <div>
            <ToastContainer />
            <h1 className="title mb-6">Discount Codes</h1>
            <div className="flex">
                <form
                    className="flex"
                    onSubmit={handleSubmit}
                >
                    <div className="mr-2">
                        <label className="mb-1 block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={newCode.name}
                            onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            placeholder="Enter new discount code"
                        />
                    </div>
                    <div className="mr-2">
                        <label className="mb-1 block text-sm font-medium">Value</label>
                        <input
                            type="number"
                            id="value"
                            value={newCode.value}
                            onChange={(e) => setNewCode({ ...newCode, value: e.target.value })}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            placeholder="Discount value"
                        />
                    </div>
                    <div className="mr-2">
                        <label className="mb-1 block text-sm font-medium">Start date</label>
                        <input
                            type="date"
                            id="start_date"
                            value={newCode.start_date}
                            onChange={(e) => setNewCode({ ...newCode, start_date: e.target.value })}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                        />
                    </div>
                    <div className="mr-2">
                        <label className="mb-1 block text-sm font-medium">End date</label>
                        <input
                            type="date"
                            id="end_date"
                            value={newCode.end_date}
                            onChange={(e) => setNewCode({ ...newCode, end_date: e.target.value })}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mr-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                        Add new
                    </button>
                </form>
                <button
                    onClick={() => getCodes()}
                    className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                >
                    Refresh
                </button>
            </div>
            <div className="card">
                <div className="card-header"></div>
                {isLoading ? (
                    <Loading className="flex items-center justify-center text-center" />
                ) : (
                    <div className="card-body p-0">
                        <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                            <table className="table">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-head">#</th>
                                        <th className="table-head">Name</th>
                                        <th className="table-head">Value</th>
                                        <th className="table-head">Start Date</th>
                                        <th className="table-head">End Date</th>
                                        <th className="table-head">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {codes.map((code, index) => (
                                        <tr
                                            key={code.id}
                                            className="table-row"
                                        >
                                            <td className="table-cell">{index + 1}</td>
                                            <td className="table-cell">{code.name}</td>
                                            <td className="table-cell">{code.value * 100} %</td>
                                            <td className="table-cell">{code.start_date}</td>
                                            <td className="table-cell">{code.end_date}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-x-4">
                                                    <button
                                                        onClick={() => startEdit(code)}
                                                        className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-800"
                                                    >
                                                        <PencilLine size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(code)}
                                                        className="text-red-500 hover:text-red-800"
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {/* Edit discount code popup menu */}
            {editingCode && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-96 rounded-lg bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">Edit Discount Code</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={editCode.name}
                                    onChange={(e) => setEditCode({ ...editCode, name: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Discount code"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Value</label>
                                <input
                                    type="number"
                                    value={editCode.value}
                                    onChange={(e) => setEditCode({ ...editCode, value: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Discount value"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Start date</label>
                                <input
                                    type="date"
                                    value={editCode.start_date}
                                    onChange={(e) => setEditCode({ ...editCode, start_date: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Start date"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">End date</label>
                                <input
                                    type="date"
                                    value={editCode.end_date}
                                    onChange={(e) => setEditCode({ ...editCode, end_date: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="End date"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingCode(null)}
                                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountCode;
