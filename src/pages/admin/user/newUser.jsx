import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { createUser } from "../../../features/adminSlice/customerSlice/customerSlice";

const NewUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newUser.password !== newUser.password_confirmation) {
      toast.error("Xác nhận mật khẩu không khớp!");
      setErrors((prev) => ({ ...prev, password_confirmation: ["Không khớp"] }));
      return;
    }

    setIsSubmitting(true);

    try {
      const { password_confirmation, ...userData } = newUser;
      const resultAction = await dispatch(createUser(userData));

      if (createUser.fulfilled.match(resultAction)) {
        toast.success("Tạo người dùng thành công!");
        setTimeout(() => {
          navigate("/admin/users");
        }, 1000);
      } else {
        const errorPayload = resultAction.payload;
        if (errorPayload?.errors) {
          setErrors(errorPayload.errors);
        } else {
          toast.error(errorPayload?.message || "Tạo người dùng thất bại!");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi không mong muốn!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thêm người dùng mới</h1>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl">
            {/* Họ tên */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.fullName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={newUser.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập họ tên"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName[0]}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={newUser.email}
                onChange={handleChange}
                required
                placeholder="example@domain.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={newUser.phone}
                onChange={handleChange}
                required
                placeholder="Nhập số điện thoại, vd: 0912345678"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone[0]}</p>
              )}
            </div>

         

            {/* Mật khẩu và xác nhận */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  value={newUser.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Tối thiểu 6 ký tự"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.password_confirmation
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  value={newUser.password_confirmation}
                  onChange={handleChange}
                  required
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password_confirmation[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo người dùng"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUser;