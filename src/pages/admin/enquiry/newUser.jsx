import React, { useEffect, useState } from "react";
import Axios from "../../../Axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../../features/adminSlice/customerSlice/customerSlice";

const NewUser = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newUser.password !== newUser.password_confirmation) {
      setErrors({ password: ["Password confirmation does not match!"] });
      return;
    }

    try {
      const resultAction = await dispatch(createUser(newUser));

      if (createUser.fulfilled.match(resultAction)) {
        toast.success("Created user successfully!");
        setTimeout(() => {
          navigate("/admin/users", { replace: true });
        }, 1000);
        
      } else if (createUser.rejected.match(resultAction)) {
        const errorData = resultAction.payload;
        setErrors(errorData?.errors || {});
        toast.error("Error: Create user failed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unexpected error occurred!");
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
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className={`w-full rounded border p-2 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
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
                  className={`w-full rounded border p-2 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  className={`w-full rounded border p-2 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password[0]}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Password confirm
                </label>
                <input
                  type="password"
                  className={`w-full rounded border p-2 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  value={newUser.password_confirmation}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      password_confirmation: e.target.value,
                    })
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

export default NewUser;
