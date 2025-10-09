import React, { useEffect, useState } from "react";
import { topProducts } from "@/constants";
import { PencilLine, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../../features/adminSlice/customerSlice/customerSlice";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; 

const User = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
 
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const allUsers = useSelector((state) => state.customer?.allUsers || []);

  console.log("allUsers", allUsers);

  const getUsers = () => {
    dispatch(getAllUser(currentUser.token));
  };

  useEffect(() => {
    getUsers();
  }, [currentUser, dispatch]);

  const formatDate = (dateString) => {
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
          user.email?.toLowerCase().includes(search.toLowerCase())
      )
    : allUsers;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setHasSearched(true);
  };

  const onDelete = async (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await axios.delete(`/users/${user._id || user.id}`);
      getUsers(); 
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title mb-6">Users</h1>
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <Link
            to="/admin/new-user"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Add new
          </Link>
          <button
            onClick={getUsers} 
            className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700" 
          >
            Refresh
          </button>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email"
            className="ml-auto rounded border px-3 py-2 focus:outline-none"
          />
        </div>
        {isLoading ? (
          <Loading className="flex items-center justify-center" />
        ) : (
          <div className="card-body p-0">
            <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
              <table className="table">
                <thead className="table-header">
                  <tr className="table-row">
                    <th className="table-head">#</th>
                    <th className="table-head">Name</th>
                    <th className="table-head">Email</th>
                    <th className="table-head">Phone</th>
                    <th className="table-head">Address</th>
                    <th className="table-head">Created at</th>
                    <th className="table-head">Role</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>

                <tbody className="table-body">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id || user.id} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">
                          <div className="flex w-max gap-x-4">
                            <div className="flex flex-col">
                              <p>{user.name || user.fullName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">{user.email}</td>
                        <td className="table-cell">
                          {user.phone || " --------"}
                        </td>
                        <td className="table-cell">
                          {user.address || " --------"}
                        </td>
                        <td className="table-cell">
                          {formatDate(user.created_at || user.createdAt)}
                        </td>
                        <td className="table-cell">{user.role}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-x-4">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/edit-user/${user._id || user.id}`
                                )
                              }
                              className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-800"
                            >
                              <PencilLine size={20} />
                            </button>
                            <button
                              onClick={() => onDelete(user)}
                              className="text-red-500 hover:text-red-800"
                            >
                              <Trash size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-gray-500"
                      >
                        {search.trim() ? "Không tìm thấy kết quả phù hợp." : "No users found."}
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