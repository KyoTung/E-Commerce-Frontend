import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiShoppingBag, FiLock, FiLogOut } from "react-icons/fi";

import { updatePassword } from "../../features/authSlice/authSlice";
import { logout } from "../../features/authSlice/authSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
   
    await dispatch(updatePassword({ password: data.password }));
    reset(); 
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
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 mb-3">
                {(user?.firstname?.charAt(0) || "U").toUpperCase()}
              </div>
              <h3 className="font-bold text-gray-800">{user?.firstname} {user?.lastname}</h3>
            </div>
            <nav className="p-2 space-y-1">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"><FiUser /> Tài khoản</Link>
                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"><FiShoppingBag /> Đơn hàng</Link>
                <Link to="/change-password" className="flex items-center gap-3 px-4 py-3 bg-red-50 text-[#d70018] font-medium rounded-lg"><FiLock /> Đổi mật khẩu</Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg"><FiLogOut /> Đăng xuất</button>
            </nav>
          </div>
        </div>

        
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    {...register("password", { required: "Vui lòng nhập mật khẩu mới", minLength: { value: 6, message: "Tối thiểu 6 ký tự" } })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#d70018] focus:ring-1 focus:ring-[#d70018] outline-none"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
                  <input
                    type="password"
                    {...register("confirmPassword", { 
                        required: "Vui lòng xác nhận mật khẩu",
                        validate: value => value === password || "Mật khẩu không khớp"
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#d70018] focus:ring-1 focus:ring-[#d70018] outline-none"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#d70018] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#b00117] transition disabled:opacity-70"
                >
                  {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChangePassword;