import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiLock,
  FiLogOut,
  FiCamera,
} from "react-icons/fi";
import { toast } from "react-toastify";

import { updateInfor, getUser } from "../../features/guestSlice/user/userSlice";
import { logout } from "../../features/authSlice/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);

  const { user: userProfile, isLoading } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    } else {
      dispatch(getUser(authUser._id || authUser.id));
    }
  }, [dispatch, authUser, navigate]);

  useEffect(() => {
    if (userProfile) {
      setValue(
        "fullName",
        userProfile.fullName ||
          userProfile.firstname + " " + userProfile.lastname ||
          ""
      );
      setValue("email", userProfile.email || "");
      setValue("phone", userProfile.phone || userProfile.mobile || "");
      setValue("address", userProfile.address || "");
    }
  }, [userProfile, setValue]);

  const onSubmit = async (data) => {
    const { email, ...updateData } = data;

    dispatch(
      updateInfor({ userData: updateData, id: authUser._id || authUser.id })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden">
                  {userProfile?.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (userProfile?.fullName?.charAt(0) || "U").toUpperCase()
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-gray-100 p-1.5 rounded-full border border-white hover:bg-gray-200 transition">
                  <FiCamera size={14} className="text-gray-600" />
                </button>
              </div>
              <h3 className="font-bold text-gray-800">
                {userProfile?.fullName || userProfile?.firstname}
              </h3>
              <p className="text-xs text-gray-500">{userProfile?.email}</p>
            </div>

            {/* Menu Links */}
            <nav className="p-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 bg-red-50 text-[#d70018] font-medium rounded-lg mb-1"
              >
                <FiUser size={18} /> Thông tin tài khoản
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg mb-1 transition"
              >
                <FiShoppingBag size={18} /> Quản lý đơn hàng
              </Link>
              <Link
                to="/change-password"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg mb-1 transition"
              >
                <FiLock size={18} /> Đổi mật khẩu
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition text-left"
              >
                <FiLogOut size={18} /> Đăng xuất
              </button>
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Hồ sơ của tôi
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    {...register("fullName", {
                      required: "Vui lòng nhập họ và tên",
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#d70018] focus:ring-1 focus:ring-[#d70018] outline-none transition"
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    *Email không thể thay đổi
                  </p>
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Vui lòng nhập SĐT",
                      pattern: {
                        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#d70018] focus:ring-1 focus:ring-[#d70018] outline-none transition"
                    placeholder="0912345678"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Vui lòng nhập địa chỉ",
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#d70018] focus:ring-1 focus:ring-[#d70018] outline-none transition"
                    placeholder="Số nhà, tên đường, phường/xã..."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`rounded-lg bg-[#d70018] px-8 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#b30014] transition-all ${
                    isLoading ? "opacity-70 cursor-wait" : ""
                  }`}
                >
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
