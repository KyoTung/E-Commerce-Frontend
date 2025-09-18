import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../../contexts/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
    const navigate = useNavigate();
    const [userEdit, setUserEdit] = useState({
        id: null,
        name: "",
        email: "",
        role: "",
        password: "",
        password_confirmation: "",
        address: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({});

    const { id } = useParams();

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setUserEdit(data);
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err);
                });
        }, []);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.put(`/users/${userEdit.id}`, userEdit);
            toast.success("Updated user successfully!");
            setTimeout(() => {
                navigate("/admin/users", { replace: true });
            }, 1500);
        } catch (error) {
            console.log(error);
            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
            toast.error("Error: Update user failed! ");
        }
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    const onClose = () => {
        navigate("/admin/users");
    };
    return (
        <div>
            <ToastContainer />
            <h1 className="title mb-6">Edit User</h1>
            <div className="card">
                <div className="card-header">
                    <p className="card-title"></p>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    className={`w-full rounded border p-2 ${errors.name ? "border-red-500" : ""}`}
                                    value={userEdit.name}
                                    onChange={(e) => setUserEdit({ ...userEdit, name: e.target.value })}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className={`w-full rounded border p-2 ${errors.email ? "border-red-500" : ""}`}
                                    value={userEdit.email}
                                    onChange={(e) => setUserEdit({ ...userEdit, email: e.target.value })}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Role</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={userEdit.role}
                                    onChange={(e) => setUserEdit({ ...userEdit, role: e.target.value })}
                                >
                                    <option value="0">User</option>
                                    {user.role == 2 && <option value="1">Staff</option>}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    className={`w-full rounded border p-2 ${errors.password ? "border-red-500" : ""}`}
                                    value={userEdit.address}
                                    onChange={(e) => setUserEdit({ ...userEdit, address: e.target.value })}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Phone Number</label>
                                <input
                                    type="number"
                                    className={`w-full rounded border p-2 ${errors.password ? "border-red-500" : ""}`}
                                    value={userEdit.phone}
                                    onChange={(e) => setUserEdit({ ...userEdit, phone: e.target.value })}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
