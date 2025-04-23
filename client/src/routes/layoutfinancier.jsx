import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";

import { HeaderF } from "@/layouts/HeaderF";
import SidebarF from "@/layouts/SidebarF";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
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
        <div className="flex min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            {/* Sidebar */}
            <div
                className={cn(
                    "fixed z-40 h-full transition-all duration-300",
                    collapsed ? "w-[70px]" : "w-[240px]"
                )}
                ref={sidebarRef}
            >
                <SidebarF collapsed={collapsed} />
            </div>

            {/* Overlay (mobile only) */}
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 z-30 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:opacity-30"
                )}
            />

            {/* Main content area */}
            <div
                className={cn(
                    "flex flex-col flex-1 transition-all duration-300 ml-0",
                    isDesktopDevice && (collapsed ? "md:ml-[70px]" : "md:ml-[240px]")
                )}
            >
                {/* Header */}
                <HeaderF collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
