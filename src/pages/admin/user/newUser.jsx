import React, { useEffect, useState } from "react";
import Axios from "../../../Axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewUser = () => {
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        address: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const id = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios.post("/register", newUser);
            toast.success("Added user successfully!");
            setTimeout(() => {
                navigate("/admin/users", { replace: true });
            }, 1500);
        } catch (err) {
            setErrors(err.response.data);
            console.log(err.response.data);
            toast.error("Create failed. Please try again.");
        }
    };

    const onClose = () => {
        navigate("/admin/users");
    };
    console.log(newUser);
    return (
        <div>
            <ToastContainer />
            <h1 className="title mb-6">New User</h1>
            <div className="card">
                <div className="card-header">
                    <p className="card-title"></p>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        {/* {errors && (
                            <div className="alert">
                                {Object.keys(errors).map((key) => (
                                    <p key={key}>{errors[key][0]}</p>
                                ))}
                            </div>
                        )} */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    className={`w-full rounded border p-2 ${errors.name ? "border-red-500" : ""}`}
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className={`w-full rounded border p-2 ${errors.email ? "border-red-500" : ""}`}
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    className={`w-full rounded border p-2 ${errors.password ? "border-red-500" : ""}`}
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Password confirm</label>
                                <input
                                    type="password"
                                    className={`w-full rounded border p-2 ${errors.password ? "border-red-500" : ""}`}
                                    value={newUser.password_confirmation}
                                    onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                            </div>
                            {/* <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium">Role</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="0">User</option>
                                    <option value="1">Staff</option>
                                </select>
                            </div> */}
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

export default NewUser;
