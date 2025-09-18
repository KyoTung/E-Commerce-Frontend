import { useTheme } from "@/hooks/use-theme";
import { useRef, useState, useEffect } from "react";
import { Bell, ChevronsLeft, Moon, Search, Sun, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import profileImg from "@/assets/profile-image.jpg";

import PropTypes from "prop-types";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axios-client";

export const Header = ({ collapsed, setCollapsed }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const { theme, setTheme } = useTheme();
    const { user, setUser, setToken, token } = useStateContext();
    const navigate = useNavigate();
    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleLogout = async () => {
        const response = await axiosClient.post("/logout");
        console.log(response);
        if (response.status === 200) {
            setUser(null);
            setToken(null);
            navigate("/");
        }
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                    />
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>
                {/* <button className="size-10 overflow-hidden rounded-full">
                    <img
                        src={profileImg}
                        alt="profile image"
                        className="size-full object-cover"
                    />
                </button> */}
                <div
                    className="relative"
                    ref={menuRef}
                >
                    <button
                        ref={buttonRef}
                        className="size-10 overflow-hidden rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu người dùng"
                    >
                        <img
                            src={profileImg}
                            alt="Ảnh đại diện"
                            className="size-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-avatar.png";
                            }}
                        />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg">
                            <div className="border-b px-4 py-2 text-sm text-gray-700">
                                <p className="font-medium">{user.name}</p>
                                <p className="truncate text-gray-500">{user.email}</p>
                            </div>

                            <ul className="text-sm text-gray-700">
                                <li>
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                        onClick={() => console.log("Xem thông tin")}
                                    >
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                        onClick={() => console.log("Cập nhật thông tin")}
                                    >
                                        Update Profile
                                    </button>
                                </li>
                            </ul>

                            <div className="mt-2 flex items-center border-t">
                                <LogOut className="ml-4 text-red-600" />
                                <button
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
