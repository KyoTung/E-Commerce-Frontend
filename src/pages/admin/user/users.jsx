import React, { useEffect, useState } from "react";
import { PencilLine, Trash } from "lucide-react";
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
        dispatch(getAllUser());
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
        toast.success(
          resultAction.payload?.message || "User blocked successfully"
        );
        dispatch(getAllUser());
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
        toast.success(
          resultAction.payload?.message || "User unblocked successfully"
        );
        dispatch(getAllUser());
      } else {
        toast.error(resultAction.payload?.message || "Failed to unblock user");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  console.log("allUsers:", allUsers);

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Users Management</h1>
      <div className="card">
        <div className="card-header flex flex-col md:flex-row items-center gap-4">
          <div className="flex gap-2">
            <Link
              to="/admin/new-user"
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 transition"
            >
              Add New
            </Link>
            <button
              onClick={() => dispatch(getAllUser())}
              className="rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700 transition"
            >
              Refresh
            </button>
          </div>

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name, email, phone..."
            className="w-full md:ml-auto md:w-auto rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isLoading ? (
          <div className="p-8">
            <Loading className="flex items-center justify-center" />
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="relative w-full overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone</th>
                    {/* <th className="px-6 py-3">Address</th> */}
                    <th className="px-6 py-3">Created At</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user._id || user.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {user.fullName ||
                            user.firstname + " " + user.lastname}
                        </td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          {user.mobile || user.phone || "---"}
                        </td>
                        {/* <td className="px-6 py-4 truncate max-w-[150px]" title={user.address}>
                          {user.address || "---"}
                        </td> */}
                        <td className="px-6 py-4">
                          {formatDate(user.createdAt || user.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/admin/edit-user/${user._id || user.id}`
                                )
                              }
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilLine size={18} />
                            </button>

                            {user.isBlock ? (
                              <button
                                title="Unblock"
                                onClick={() => onUnBlockUser(user)}
                                className="text-amber-600 hover:text-amber-900"
                              >
                                <MdLockOutline size={20} />
                              </button>
                            ) : (
                              <button
                                title="Block"
                                onClick={() => onBlockUser(user)}
                                className=" text-green-600 hover:text-green-900"
                              >
                                <MdLockOpen size={20} />
                              </button>
                            )}

                            <button
                              title="Delete"
                              onClick={() => onDelete(user)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-gray-500 italic"
                      >
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
