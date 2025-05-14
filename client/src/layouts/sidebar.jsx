import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaChartBar, FaFileAlt, FaUsers, FaUserPlus, FaUserCheck, FaBox, FaBoxOpen, FaShoppingBag, FaCog } from 'react-icons/fa';
import { cn } from "@/utils/cn";  // Assure-toi que `cn` est une fonction utilitaire pour la gestion des classes conditionnelles
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const navbarLinks = [
        {
            title: "Dashboard",
            links: [
                { label: "Home", path: "/", icon: FaHome },
                { label: "Analytics", path: "/analytics", icon: FaChartBar },
            ],
        },
        {
            title: "Reports",
            links: [
                { label: "Reports", path: "/reports", icon: FaFileAlt },
            ],
        },
        {
            title: "Products",
            links: [
                { label: "Products", path: "/products", icon: FaBox },
                { label: "New Product", path: "/new-product", icon: FaBoxOpen },
            ],
        },
        {
            title: "Settings",
            links: [
                { label: "Settings", path: "/settings", icon: FaCog },
            ],
        },
        {
            title: "Friend Requests",
            links: [
                { label: "Friend Requests", path: "/friend-requests", icon: FaCog },
            ],
        },
        {
            title: "Send Friend Request",
            links: [
                { label: "Send Friend Request", path: "/send-friend-request", icon: FaCog },
            ],
        },
    ];
 
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 dashboard-bg transition-all dark:border-slate-700",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0"
            )}
        >
            {/* Sidebar Content */}
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav key={navbarLink.title} className={cn("sidebar-group", collapsed && "md:items-center")}>
                        <p className={cn("sidebar-group-title text-white", collapsed && "md:w-[45px]")}>
                            {navbarLink.title}
                        </p>
                        {navbarLink.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={cn(
                                    "sidebar-item text-white",
                                    collapsed && "md:w-[45px]",
                                    "flex items-center gap-3 p-2 hover:bg-slate-700"
                                )}
                            >
                                <link.icon size={22} className="flex-shrink-0 text-white" />
                                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
