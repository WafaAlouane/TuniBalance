import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { 
  FiGrid, 
  FiUser, 
  FiUserPlus, 
  FiDollarSign,
  FiLogOut
} from "react-icons/fi";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-white">Business Portal</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <Link 
          to="/BusinessOwner" 
          className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <FiGrid className="mr-3 text-lg" />
          <span className="font-medium">Dashboard</span>
        </Link>

        {user && (
          <>
            {/* Profile */}
            <Link 
              to="/BusinessOwner/profile" 
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <FiUser className="mr-3 text-lg" />
              <span className="font-medium">My Profile</span>
            </Link>

            {/* Create Staff */}
            <Link 
              to="/BusinessOwner/create-staff" 
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <FiUserPlus className="mr-3 text-lg" />
              <span className="font-medium">Create Staff</span>
            </Link>

            {/* Transactions */}
            <Link 
              to="/BusinessOwner/transactions" 
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <FiDollarSign className="mr-3 text-lg" />
              <span className="font-medium">View Transactions</span>
            </Link>
          </>
        )}

          {/* Logout Button */}
      {user && (
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
          >
            <FiLogOut className="mr-3 text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
      </nav>

    
    </aside>
  );
}

export default Sidebar;