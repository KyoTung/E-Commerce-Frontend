import React, { useEffect, useState } from "react";
import { PencilLine, Trash, Plus, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUser,
  deleteUser,
  blockUser,
  unBlockUser,
} from "../../../features/adminSlice/customerSlice/customerSlice";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdLockOutline, MdLockOpen } from "react-icons/md";

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const { allUsers, isLoading } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(dateString)
      .toLocaleString("vi-VN", options)
      .replace(",", "");
  };

  const filteredUsers = search.trim()
    ? allUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          user.mobile?.includes(search)
      )
    : allUsers;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onDelete = async (user) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      const id = user._id || user.id;
      const resultAction = await dispatch(deleteUser(id));
      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success("Xóa người dùng thành công");
        // Redux sẽ tự cập nhật danh sách (slice đã xử lý)
      } else {
        toast.error(resultAction.payload?.message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  const onBlockUser = async (user) => {
    if (!window.confirm("Bạn có chắc chắn muốn khóa người dùng này?")) return;
    try {
      const id = user._id || user.id;
      const resultAction = await dispatch(blockUser(id));
      if (blockUser.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "Khóa người dùng thành công");
      } else {
        toast.error(resultAction.payload?.message || "Khóa thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  const onUnBlockUser = async (user) => {
    if (!window.confirm("Bạn có chắc chắn muốn mở khóa người dùng này?")) return;
    try {
      const id = user._id || user.id;
      const resultAction = await dispatch(unBlockUser(id));
      if (unBlockUser.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "Mở khóa người dùng thành công");
      } else {
        toast.error(resultAction.payload?.message || "Mở khóa thất bại");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/new-user"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm người dùng
          </Link>
          <button
            onClick={() => dispatch(getAllUser())}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} /> Tải lại
          </button>
        </div>
      </div>

      {/* Ô tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:w-80"
        />
      </div>

      {/* Bảng người dùng */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy người dùng nào.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Tên</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Số điện thoại</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Ngày tạo</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black-500">Vai trò</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-black-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.map((user, idx) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {user.name || user.fullName || (user.firstname + " " + user.lastname)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {user.mobile || user.phone || "---"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt || user.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "user"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role === "admin" ? "Quản trị viên" : user.role === "user" ? "Khách hàng" : "Nhân viên"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => navigate(`/admin/edit-user/${user._id}`)}
                            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition"
                            title="Sửa"
                          >
                            <PencilLine size={16} />
                          </button>
                          {user.isBlock ? (
                            <button
                              onClick={() => onUnBlockUser(user)}
                              className="rounded-md p-1.5 text-amber-600 hover:bg-amber-50 transition"
                              title="Mở khóa"
                            >
                              <MdLockOutline size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => onBlockUser(user)}
                              className="rounded-md p-1.5 text-green-600 hover:bg-green-50 transition"
                              title="Khóa"
                            >
                              <MdLockOpen size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(user)}
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 transition"
                            title="Xóa"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default User;