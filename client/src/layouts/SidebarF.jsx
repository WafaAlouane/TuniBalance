import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiFileText,
  FiBarChart2,
  FiDollarSign,
  FiLogOut,
  FiCreditCard,
  FiHome
} from "react-icons/fi";

function SidebarF() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // dispatch(logout());
    navigate("/login");
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation items
  const navItems = [
    {
      to: "/",
      icon: <FiHome className="mr-3 text-lg" />,
      label: "Accueil"
    },
    {
      to: "/dashboard",
      icon: <FiGrid className="mr-3 text-lg" />,
      label: "Dashboard"
    },
    {
      to: "/layoutfinancier",
      icon: <FiDollarSign className="mr-3 text-lg" />,
      label: "Financial Management"
    },
    {
      to: "/reports",
      icon: <FiFileText className="mr-3 text-lg" />,
      label: "Rapports"
    },
    {
      to: "/analytics",
      icon: <FiBarChart2 className="mr-3 text-lg" />,
      label: "Analyses"
    },
    {
      to: "/transactions",
      icon: <FiCreditCard className="mr-3 text-lg" />,
      label: "Transactions"
    },
    {
      to: "/profile",
      icon: <FiUser className="mr-3 text-lg" />,
      label: "My profile"
    },
    {
      to: "/friend-requests",
      icon: <FiCreditCard className="mr-3 text-lg" />,
      label: "Friend Requests"
    },
    {
      to: "/send-friend-request",
      icon: <FiUser className="mr-3 text-lg" />,
      label: "Send Friend Request"
    },
    
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col shadow-md">
      {/* Logo and company name */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-center">
        <div className="text-xl font-bold text-white">TuniBalance</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
              isActive(item.to)
                ? "bg-blue-900/20 text-blue-400 font-medium"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User section and logout */}
      <div className="p-4 border-t border-slate-800">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || "Utilisateur"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user.email || "utilisateur@example.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FiLogOut className="mr-3 text-lg" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Connexion
          </Link>
        )}
      </div>
    </aside>
  );
}

export default SidebarF;