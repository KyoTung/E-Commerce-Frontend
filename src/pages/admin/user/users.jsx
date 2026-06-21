import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  PencilLine,
  Trash,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MdLockOutline, MdLockOpen } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading";
import {
  getAllUser,
  deleteUser,
  blockUser,
  unBlockUser,
} from "../../../features/adminSlice/customerSlice/customerSlice";

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUsers, isLoading, total, page, limit, totalPages } = useSelector(
    (state) => state.customer
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch khi page hoặc search thay đổi
  useEffect(() => {
    dispatch(getAllUser({ page: currentPage, limit, search: debouncedSearch }));
  }, [dispatch, currentPage, limit, debouncedSearch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Các handler CRUD (giữ nguyên, đã dùng toast trong component)
  const onDelete = async (user) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await dispatch(deleteUser(user._id)).unwrap();
      toast.success("Xóa người dùng thành công");
      dispatch(getAllUser({ page: currentPage, limit, search: debouncedSearch }));
    } catch (err) {
      toast.error(err?.message || "Xóa thất bại");
    }
  };

  const onBlockUser = async (user) => {
    if (!window.confirm("Bạn có chắc muốn khóa người dùng này?")) return;
    try {
      await dispatch(blockUser(user._id)).unwrap();
      toast.success("Khóa người dùng thành công");
      dispatch(getAllUser({ page: currentPage, limit, search: debouncedSearch }));
    } catch (err) {
      toast.error(err?.message || "Khóa thất bại");
    }
  };

  const onUnBlockUser = async (user) => {
    if (!window.confirm("Bạn có chắc muốn mở khóa người dùng này?")) return;
    try {
      await dispatch(unBlockUser(user._id)).unwrap();
      toast.success("Mở khóa người dùng thành công");
      dispatch(getAllUser({ page: currentPage, limit, search: debouncedSearch }));
    } catch (err) {
      toast.error(err?.message || "Mở khóa thất bại");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <ToastContainer />
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
            onClick={() =>
              dispatch(getAllUser({ page: currentPage, limit, search: debouncedSearch }))
            }
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} /> Tải lại
          </button>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:w-80"
        />
      </div>

      {/* Bảng */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="py-20"><Loading /></div>
        ) : (
          <div className="overflow-x-auto">
            {allUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy người dùng nào.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Tên</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">SĐT</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Ngày tạo</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Vai trò</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {allUsers.map((user, idx) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {user.name || user.fullName || user.firstname + " " + user.lastname}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {user.mobile || user.phone || "---"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" :
                          user.role === "user" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {user.role === "admin" ? "Quản trị viên" :
                           user.role === "user" ? "Khách hàng" : "Nhân viên"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => navigate(`/admin/edit-user/${user._id}`)}
                            className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"
                          >
                            <PencilLine size={16} />
                          </button>
                          {user.isBlock ? (
                            <button onClick={() => onUnBlockUser(user)} className="rounded-md p-1.5 text-amber-600 hover:bg-amber-50">
                              <MdLockOutline size={18} />
                            </button>
                          ) : (
                            <button onClick={() => onBlockUser(user)} className="rounded-md p-1.5 text-green-600 hover:bg-green-50">
                              <MdLockOpen size={18} />
                            </button>
                          )}
                          <button onClick={() => onDelete(user)} className="rounded-md p-1.5 text-red-600 hover:bg-red-50">
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

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4 rounded-lg shadow-sm">
          <div className="flex flex-1 justify-between sm:justify-end gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" /> Trước
            </button>
            <span className="text-sm text-gray-700 py-2">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sau <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;