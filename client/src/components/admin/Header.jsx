import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { 
  FiBell, 
  FiMenu, 
  FiUser, 
  FiUserPlus, 
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white focus:outline-none">
            <FiMenu className="w-6 h-6" />
          </button>
          <Link to="/dashboard" className="flex items-center">
            <img 
              src="/admin/assets/img/logo.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
            <span className="ml-3 text-lg font-semibold text-white hidden lg:block">Business Owner</span>
          </Link>
        </div>

        {/* Right Section - Navigation */}
        <nav className="flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative">
            <button className="text-gray-400 hover:text-white focus:outline-none relative">
              <FiBell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                4
              </span>
            </button>
            
            {/* Notifications Dropdown */}
            <div className="hidden absolute right-0 mt-2 w-80 bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-600">
              <div className="px-4 py-3 border-b border-gray-600 flex justify-between items-center">
                <span className="text-sm font-medium text-white">4 new notifications</span>
                <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                  View all
                </button>
              </div>
              <div className="py-1">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <FiUser className="mr-3" />
                  My Profile
                </Link>
                <Link 
                  to="/create-staff" 
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <FiUserPlus className="mr-3" />
                  Create Staff
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                >
                  <FiLogOut className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button className="flex items-center space-x-1 focus:outline-none group">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                {user?.name?.charAt(0).toUpperCase() || <FiUser className="w-4 h-4" />}
              </div>
              <span className="text-gray-300 hidden md:inline-block">{user?.name}</span>
              <FiChevronDown className="text-gray-400 group-hover:text-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="hidden absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-600">
              <div className="px-4 py-2 border-b border-gray-600 text-center">
                <h6 className="text-sm font-medium text-white">{user?.name}</h6>
                <span className="text-xs text-gray-400">Business Owner</span>
              </div>
              <div className="py-1">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <FiUser className="mr-3" />
                  My Profile
                </Link>
                <Link 
                  to="/create-staff" 
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <FiUserPlus className="mr-3" />
                  Create Staff
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                >
                  <FiLogOut className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;