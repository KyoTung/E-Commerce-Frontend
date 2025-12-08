import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { createUser } from "../../../features/adminSlice/customerSlice/customerSlice";

const NewUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State form
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "user", 
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    // Clear lỗi khi user gõ lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (newUser.password !== newUser.password_confirmation) {
      toast.error("Password confirmation does not match!");
      setErrors((prev) => ({ ...prev, password_confirmation: ["Does not match"] }));
      return;
    }

    setIsSubmitting(true);

    try {
    
      const { password_confirmation, ...userData } = newUser;

      const resultAction = await dispatch(createUser(userData));

      if (createUser.fulfilled.match(resultAction)) {
        toast.success("Created user successfully!");
        setTimeout(() => {
          navigate("/admin/users");
        }, 1000);
      } else {
      
        const errorPayload = resultAction.payload;
       
        if (errorPayload?.errors) {
             setErrors(errorPayload.errors);
        } else {
             toast.error(errorPayload?.message || "Create user failed!");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">New User</h1>
      <div className="card">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl">
            {/* Full Name */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                className={`w-full rounded border p-2 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                value={newUser.fullName}
                onChange={handleChange}
                required
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName[0]}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className={`w-full rounded border p-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                value={newUser.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email[0]}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Phone Number</label>
              <input
                type="number"
                name="phone"
                className={`w-full rounded border p-2 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                value={newUser.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone[0]}</p>
              )}
            </div>

            {/* Role (Optional) */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select 
                name="role"
                value={newUser.role}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 p-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input
                    type="password"
                    name="password"
                    className={`w-full rounded border p-2 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    value={newUser.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password[0]}</p>
                )}
                </div>

                <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                <input
                    type="password"
                    name="password_confirmation"
                    className={`w-full rounded border p-2 ${
                    errors.password_confirmation ? "border-red-500" : "border-gray-300"
                    }`}
                    value={newUser.password_confirmation}
                    onChange={handleChange}
                    required
                />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUser;