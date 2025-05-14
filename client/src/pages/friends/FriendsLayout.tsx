import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Bell,
  MessageSquare,
  Settings,
  Menu,
  X,
  Search
} from 'react-feather';

interface FriendsLayoutProps {
  children: ReactNode;
  title: string;
}

const FriendsLayout: React.FC<FriendsLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/friends', icon: <Users size={20} />, label: 'Friends List' },
    { path: '/send-friend-request', icon: <UserPlus size={20} />, label: 'Add Friends' },
    { path: '/friend-requests', icon: <Bell size={20} />, label: 'Friend Requests' },
    { path: '/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 text-gray-300 hover:text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 font-medium">John Doe</span>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Mobile */}
        <div
          className={`fixed inset-0 z-40 md:hidden bg-black bg-opacity-75 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Friends</h2>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-900 text-blue-200 font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={isActive(item.path) ? 'text-blue-300' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Friends</h2>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-900 text-blue-200 font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className={isActive(item.path) ? 'text-blue-300' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-900">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FriendsLayout;
