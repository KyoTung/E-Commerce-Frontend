import React, { useEffect, useState } from "react";
import { PencilLine, Trash, Plus, RefreshCw } from "lucide-react"; // Thêm icon
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
      .toLocaleString("en-GB", options)
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
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      const id = user._id || user.id;
      const resultAction = await dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success("User deleted successfully");
        // dispatch(getAllUser()); // KHÔNG CẦN GỌI LẠI
      } else {
        const errorMsg =
          resultAction.payload?.message || "Failed to delete user";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const onBlockUser = async (user) => {
    if (!window.confirm("Are you sure you want to block this user?")) {
      return;
    }
    try {
      const id = user._id || user.id;
      const resultAction = await dispatch(blockUser(id));

      if (blockUser.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "User blocked successfully");
        // dispatch(getAllUser()); // KHÔNG CẦN GỌI LẠI
      } else {
        toast.error(resultAction.payload?.message || "Failed to block user");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const onUnBlockUser = async (user) => {
    if (!window.confirm("Are you sure you want to unblock this user?")) {
      return;
    }
    try {
      const id = user._id || user.id;
      const resultAction = await dispatch(unBlockUser(id));

      if (unBlockUser.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "User unblocked successfully");
        // dispatch(getAllUser()); // KHÔNG CẦN GỌI LẠI
      } else {
        toast.error(resultAction.payload?.message || "Failed to unblock user");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Users Management</h1>
      
      <div className="card">
        {/* --- TOOLBAR --- */}
        <div className="card-header flex flex-col md:flex-row items-center gap-4 py-4 px-6 border-b border-gray-100">
          <div className="flex gap-2 w-full md:w-auto">
            <Link
              to="/admin/new-user"
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition w-full md:w-auto"
            >
              <Plus size={18} />
              Add New
            </Link>
            <button
              onClick={() => dispatch(getAllUser())}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          <div className="w-full md:ml-auto md:w-80">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search user..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* --- TABLE --- */}
        {isLoading ? (
          <div className="p-12">
            <Loading className="flex items-center justify-center" />
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative w-full overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3 w-16 text-center">#</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Created At</th>
                    <th className="px-6 py-3 text-center">Role</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user._id || user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-center text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {user.name || user.fullName || user.firstname + " " + user.lastname}
                        </td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {user.mobile || user.phone || "---"}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {formatDate(user.createdAt || user.created_at)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            {/* Edit */}
                            <button
                              onClick={() =>
                                navigate(`/admin/edit-user/${user._id || user.id}`)
                              }
                              className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                              title="Edit"
                            >
                              <PencilLine size={18} />
                            </button>

                            {/* Block / Unblock */}
                            {user.isBlock ? (
                              <button
                                onClick={() => onUnBlockUser(user)}
                                className="rounded p-1 text-amber-600 hover:bg-amber-50 hover:text-amber-800 transition"
                                title="Unblock (Click to activate)"
                              >
                                <MdLockOutline size={20} />
                              </button>
                            ) : (
                              <button
                                onClick={() => onBlockUser(user)}
                                className="rounded p-1 text-green-600 hover:bg-green-50 hover:text-green-800 transition"
                                title="Block (Click to deactivate)"
                              >
                                <MdLockOpen size={20} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => onDelete(user)}
                              className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800 transition"
                              title="Delete"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500 italic">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;