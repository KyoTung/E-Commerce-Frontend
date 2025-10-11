import React, { useEffect, useState } from "react";
import Axios from "../../../Axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserInfo,
  updateUser,
} from "../../../features/adminSlice/customerSlice/customerSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const userInfo = useSelector((state) => state.customer.userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEdit, setUserEdit] = useState({
    id: null,
    fullName: "",
    email: "",
    role: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const { id } = useParams();

  if (id) {
    useEffect(() => {
      dispatch(getUserInfo({ userId: id, token: currentUser.token }));
    }, []);
  }
  useEffect(() => {
    if (userInfo) {
      setUserEdit({
        id: userInfo._id || userInfo.id,
        fullName: userInfo.fullName || "",
        email: userInfo.email || "",
        role: userInfo.role || "",
        address: userInfo.address || "",
        phone: userInfo.phone || "",
      });
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        updateUser({
          userId: userEdit.id,
          userData: userEdit,
          token: currentUser.token,
        })
      );

      if (updateUser.fulfilled.match(resultAction)) {
        toast.success("Updated user successfully!");

        setTimeout(() => {
          navigate("/admin/users", { replace: true });
        }, 1000);
      } else {
        toast.error("Error: Update user failed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unexpected error occurred!");
    }
  };

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
                  className={`w-full rounded border p-2 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  value={userEdit?.fullName}
                  onChange={(e) =>
                    setUserEdit({ ...userEdit, fullName: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name[0]}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  readOnly
                  className={`w-full rounded border p-2 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  value={userEdit?.email}
                  onChange={(e) =>
                    setUserEdit({ ...userEdit, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Role</label>
                <select
                  className="w-full rounded border p-2"
                  value={userEdit?.role}
                  onChange={(e) =>
                    setUserEdit({ ...userEdit, role: e.target.value })
                  }
                >
                  <option value={userEdit.role}>{userEdit.role}</option>
                  {userEdit?.role == "user" && (
                    <option value="admin">Admin</option>
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Address
                </label>
                <input
                  type="text"
                  className={`w-full rounded border p-2 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={userEdit?.address}
                  onChange={(e) =>
                    setUserEdit({ ...userEdit, address: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password[0]}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="number"
                  className={`w-full rounded border p-2 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={userEdit?.phone}
                  onChange={(e) =>
                    setUserEdit({ ...userEdit, phone: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password[0]}</p>
                )}
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
