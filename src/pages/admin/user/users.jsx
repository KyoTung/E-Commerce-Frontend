import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  PencilLine,
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
  blockUser,
  unBlockUser,
  updateUser,
} from "../../../features/adminSlice/customerSlice/customerSlice";

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUsers = [], isLoading, total = 0, page = 1, limit = 10, totalPages = 1 } = useSelector(
    (state) => state.customer
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("all");
  
  // MẶC ĐỊNH NGHIỆP VỤ: Chỉ hiển thị các thành viên đang mở (isBlock = false)
  // Các giá trị: "active" (Đang mở), "blocked" (Bị khóa), "all" (Tất cả)
  const [filterStatus, setFilterStatus] = useState("active"); 
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Debounce search giảm tải lượng gọi API liên tục khi gõ chữ
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm từ khóa mới
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Hàm tập trung chịu trách nhiệm gọi API lấy dữ liệu kèm theo các bộ lọc đa năng
  const fetchUsersList = () => {
    dispatch(
      getAllUser({ 
        page: currentPage, 
        limit, 
        search: debouncedSearch.trim(),
        role: filterRole !== "all" ? filterRole : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined // Gửi trạng thái đóng mở lên backend
      })
    );
  };

  // Theo dõi sự thay đổi của các bộ lọc để tự động nạp lại bảng dữ liệu
  useEffect(() => {
    fetchUsersList();
  }, [dispatch, currentPage, limit, debouncedSearch, filterRole, filterStatus]);

  // Định dạng thời gian hiển thị chuẩn Việt Nam
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "");
  };

  // Chuyển đổi số trang phân trang mượt mà
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Hành động: Khóa tài khoản (isBlock -> true dưới DB)
  const onBlockUser = async (user) => {
    const userName = user.name || user.fullName || user.email;
    if (!window.confirm(`Bạn có chắc chắn muốn KHÓA tài khoản của thành viên [${userName}]?`)) return;
    try {
      await dispatch(blockUser(user._id)).unwrap();
      toast.success("Đã khóa tài khoản thành công");
      fetchUsersList();
    } catch (err) {
      toast.error(err?.message || "Thao tác khóa thất bại");
    }
  };

  // Hành động: Mở khóa tài khoản (isBlock -> false dưới DB)
  const onUnBlockUser = async (user) => {
    const userName = user.name || user.fullName || user.email;
    if (!window.confirm(`Bạn có chắc chắn muốn MỞ KHÓA tài khoản cho thành viên [${userName}]?`)) return;
    try {
      await dispatch(unBlockUser(user._id)).unwrap();
      toast.success("Đã mở khóa tài khoản thành công");
      fetchUsersList();
    } catch (err) {
      toast.error(err?.message || "Thao tác mở khóa thất bại");
    }
  };

  // Hành động: Thay đổi vai trò quyền lực (Admin / Staff / User)
  const handleRoleChange = async (user, newRole) => {
    const roleLabels = { admin: "Quản trị viên", staff: "Nhân viên", user: "Khách hàng" };
    const userName = user.name || user.fullName || `${user.firstname} ${user.lastname}`;
    
    if (window.confirm(`Bạn có chắc muốn đổi vai trò của [${userName}] sang [${roleLabels[newRole]}]?`)) {
      setUpdatingUserId(user._id);
      try {
        const result = await dispatch(
          updateUser({
            userId: user._id,
            userData: { role: newRole },
          })
        );

        if (updateUser.fulfilled.match(result)) {
          toast.success("Cập nhật phân quyền thành công!");
          fetchUsersList();
        } else {
          toast.error(result.payload?.message || "Cập nhật phân quyền thất bại!");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi hệ thống!");
      } finally {
        setUpdatingUserId(null);
      }
    }
  };

  // Gán class màu sắc động cho Select phân quyền nổi bật trực quan
  const getRoleSelectClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-50 text-red-700 border-red-200 focus:ring-red-500/20";
      case "staff":
        return "bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500/20";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500/20";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      
      {/* Khối tiêu đề đầu trang */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý thành viên</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng số kết quả tìm thấy: {total}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/new-user"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Thêm người dùng
          </Link>
          <button
            onClick={fetchUsersList}
            className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} /> Tải lại
          </button>
        </div>
      </div>

      {/* Bộ thanh công cụ tìm kiếm và lọc dữ liệu nâng cao */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          {/* Ô nhập từ khóa tìm kiếm nhanh */}
          <div className="w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* BỘ LỌC TRẠNG THÁI ĐÓNG / MỞ (ĐƯỢC BỔ SUNG CHUẨN NGHIỆP VỤ) */}
          <div className="flex items-center gap-2 text-sm w-full md:w-auto justify-end">
            <span className="font-semibold text-gray-500 whitespace-nowrap">Trạng thái tài khoản:</span>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // Quay về trang 1 khi thay đổi trạng thái lọc
              }}
              className="border rounded-lg p-2 font-medium text-sm outline-none text-gray-700 bg-gray-50 cursor-pointer focus:border-blue-500 transition"
            >
              <option value="active">Đang mở (Hoạt động)</option>
              <option value="blocked">Đang đóng (Bị khóa)</option>
              <option value="all">Tất cả tài khoản</option>
            </select>
          </div>
        </div>

        {/* Khối các tab lọc nhanh theo từng Vai trò */}
        <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] border-t pt-3">
          {[
            { key: "all", label: "Tất cả vai trò" },
            { key: "admin", label: "Quản trị viên" },
            { key: "staff", label: "Nhân viên" },
            { key: "user", label: "Khách hàng" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setFilterRole(item.key);
                setCurrentPage(1); // Quay về trang 1 khi đổi bộ lọc vai trò
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterRole === item.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng hiển thị thông tin danh sách thành viên */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {isLoading && allUsers.length === 0 ? (
          <div className="py-20"><Loading /></div>
        ) : (
          <div className="overflow-x-auto">
            {allUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy người dùng nào phù hợp với điều kiện lọc hiện tại.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 text-left">#</th>
                    <th className="px-6 py-3.5 text-left">Tên thành viên</th>
                    <th className="px-6 py-3.5 text-left">Email</th>
                    <th className="px-6 py-3.5 text-left">Số điện thoại</th>
                    <th className="px-6 py-3.5 text-left">Ngày tạo</th>
                    <th className="px-6 py-3.5 text-center w-48">Phân quyền</th>
                    <th className="px-6 py-3.5 text-center">Trạng thái</th>
                    <th className="px-6 py-3.5 text-right w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-700 font-medium">
                  {allUsers.map((user, idx) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition">
                      {/* Số thứ tự liên tiếp dựa theo số phân trang */}
                      <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                        {(currentPage - 1) * limit + idx + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">
                        {user.name || user.fullName || `${user.firstname} ${user.lastname}`}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-gray-500">{user.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {user.mobile || user.phone || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      
                      {/* Cột Dropdown Phân quyền chức vụ */}
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <select
                            value={user.role || "user"}
                            disabled={updatingUserId === user._id}
                            onChange={(e) => handleRoleChange(user, e.target.value)}
                            className={`border text-xs rounded-lg px-2.5 py-1.5 font-bold focus:ring-2 outline-none cursor-pointer transition ${getRoleSelectClass(user.role)}`}
                          >
                            <option value="user" className="bg-white text-gray-700">Khách hàng</option>
                            <option value="staff" className="bg-white text-gray-700">Nhân viên</option>
                            <option value="admin" className="bg-white text-gray-700">Quản trị viên</option>
                          </select>
                          {updatingUserId === user._id && (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                      </td>

                      {/* Cột hiển thị Badge trạng thái tương ứng biến user.isBlock */}
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.isBlock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}>
                          {user.isBlock ? "Bị khóa" : "Hoạt động"}
                        </span>
                      </td>
                      
                      {/* Cột Thao tác hành động (ĐÃ LOẠI BỎ ICON THÙNG RÁC XÓA CỨNG) */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => navigate(`/admin/edit-user/${user._id}`)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition"
                            title="Chỉnh sửa thông tin"
                          >
                            <PencilLine size={16} />
                          </button>
                          {user.isBlock ? (
                            <button 
                              onClick={() => onUnBlockUser(user)} 
                              className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 transition" 
                              title="Mở khóa tài khoản"
                            >
                              <MdLockOutline size={18} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => onBlockUser(user)} 
                              className="rounded-lg p-2 text-green-600 hover:bg-green-50 transition" 
                              title="Khóa tài khoản"
                            >
                              <MdLockOpen size={18} />
                            </button>
                          )}
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

      {/* Hệ thống thanh điều hướng phân trang số */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-4 rounded-lg shadow-sm gap-4">
          <div className="text-sm text-gray-700 font-medium">
            Hiển thị từ <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> đến{" "}
            <span className="font-semibold">{Math.min(currentPage * limit, total)}</span> trong tổng số{" "}
            <span className="font-semibold">{total}</span> thành viên
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" /> Trước
            </button>

            {/* Các ô số trang nhanh trên màn hình rộng máy tính */}
            <div className="hidden md:flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <span className="text-sm text-gray-700 md:hidden font-semibold">
              Trang {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
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