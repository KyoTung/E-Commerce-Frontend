import React, { useEffect, useState } from "react";
import { topProducts } from "@/constants";
import { PencilLine, Trash } from "lucide-react";
import axiosClient from "../../../axios-client";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../compoments/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getUsers();
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };
        return new Date(dateString).toLocaleString("en-GB", options).replace(",", "");
    };

    const getUsers = () => {
        setIsLoading(true);
        axiosClient
            .get("/users")
            .then(({ data }) => {
                setIsLoading(false);
                setUsers(data.data);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };
    const filteredUsers = search.trim()
        ? users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()))
        : users;

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setHasSearched(true); // Đánh dấu đã tìm kiếm
    };

    const onDelete = (user) => {
        if (!window.confirm("Are you sure you want to delete this user ?")) {
            return;
        }
        axiosClient.delete(`/users/${user.id}`).then(() => {
            getUsers();
        });
    };

    return (
        <div>
            <ToastContainer />
            <h1 className="title mb-6">Users</h1>
            <div className="card">
                <div className="card-header">
                    <Link
                        to="/admin/new-user"
                        class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                        Add new
                    </Link>
                    <button
                        onClick={() => getUsers()}
                        class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
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
                                    {filteredUsers.length > 0
                                        ? filteredUsers.map((user, index) => (
                                              <tr
                                                  key={user.id}
                                                  className="table-row"
                                              >
                                                  <td className="table-cell">{(index += 1)}</td>
                                                  <td className="table-cell">
                                                      <div className="flex w-max gap-x-4">
                                                          <div className="flex flex-col">
                                                              <p>{user.name}</p>
                                                          </div>
                                                      </div>
                                                  </td>
                                                  <td className="table-cell">{user.email}</td>
                                                  <td className="table-cell">{user.phone ? user.phone : " --------"}</td>
                                                  <td className="table-cell">{user.address ? user.address : " --------"}</td>
                                                  <td className="table-cell">{formatDate(user.created_at)}</td>
                                                  <td className="table-cell">
                                                      {user.role === 0 ? "User" : user.role === 1 ? "Staff" : user.role === 2 ? "Admin" : "Unknown"}
                                                  </td>
                                                  <td className="table-cell">
                                                      <div className="flex items-center gap-x-4">
                                                          <button
                                                              onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                                                              className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-800"
                                                          >
                                                              <PencilLine size={20} />
                                                          </button>
                                                          <button
                                                              onClick={(e) => onDelete(user)}
                                                              className="text-red-500 hover:text-red-800"
                                                          >
                                                              <Trash size={20} />
                                                          </button>
                                                      </div>
                                                  </td>
                                              </tr>
                                          ))
                                        : search.trim() && (
                                              <tr>
                                                  <td
                                                      colSpan={8}
                                                      className="py-8 text-center text-gray-500"
                                                  >
                                                      Không tìm thấy kết quả phù hợp.
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
