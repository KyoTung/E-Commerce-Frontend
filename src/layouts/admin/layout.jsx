import { useNavigate, Outlet } from "react-router-dom";

import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";

import { Sidebar } from "@/layouts/admin/sidebar";
import { Header } from "@/layouts/admin/header";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 

const AdminLayout = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth);
    const currentUser =  useSelector((state) => state.user.user);
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);

    if(!user?.token && currentUser?.role !== 'admin'){
        navigate("/")
    }

    const sidebarRef = useRef(null);

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
                )}
            />
            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
            />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
