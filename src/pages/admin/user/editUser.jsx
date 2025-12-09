import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserInfo,
  updateUser,
} from "../../../features/adminSlice/customerSlice/customerSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const userInfo = useSelector((state) => state.customer.userSelector);

  const [userEdit, setUserEdit] = useState({
    id: null,
    fullName: "",
    email: "",
    role: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(getUserInfo(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (userInfo) {
      setUserEdit({
        id: userInfo._id || userInfo.id,
        fullName: userInfo.name || userInfo.fullName || "",
        email: userInfo.email || "",
        role: userInfo.role || "user",
        address: userInfo.address || "",
        phone: userInfo.mobile || userInfo.phone || "",
      });
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        updateUser({
          userId: userEdit.id,
          userData: {
            fullName: userEdit.fullName,
            email: userEdit.email,
            role: userEdit.role,
            address: userEdit.address,
            phone: userEdit.phone,
          },
        })
      );

      if (updateUser.fulfilled.match(resultAction)) {
        toast.success("Updated user successfully!");
        setTimeout(() => {
          navigate("/admin/users");
        }, 1000);
      } else {
        const errorMsg = resultAction.payload?.message || "Update failed!";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("Unexpected error occurred!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserEdit((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Edit User</h1>
      <div className="card">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl">
            {/* Name */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                type="text"
                name="fullName"
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={userEdit.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email (Read only) */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                readOnly
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-500 cursor-not-allowed"
                value={userEdit.email}
              />
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select
                name="role"
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={userEdit.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={userEdit.address}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={userEdit.phone}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 border border-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
