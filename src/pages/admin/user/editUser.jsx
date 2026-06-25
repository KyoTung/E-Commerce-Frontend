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
        toast.success("Cập nhật người dùng thành công!");
        setTimeout(() => {
          navigate("/admin/users");
        }, 1000);
      } else {
        const errorMsg = resultAction.payload?.message || "Cập nhật thất bại!";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi không mong muốn!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserEdit((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa người dùng</h1>
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={userEdit.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập họ tên"
              />
            </div>

            {/* Email (chỉ đọc) */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
                value={userEdit.email}
              />
            </div>

            {/* Vai trò */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Vai trò
              </label>
              <select
                name="role"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={userEdit.role}
                onChange={handleChange}
              >
                <option value="user">Khách hàng</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            {/* Địa chỉ */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={userEdit.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Số điện thoại */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={userEdit.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại, vd: 0912345678"
              />
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;