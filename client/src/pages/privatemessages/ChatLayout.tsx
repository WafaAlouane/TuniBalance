import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Menu, 
  X,
  Search,
  Phone,
  Video,
  Info
} from 'react-feather';

interface ChatLayoutProps {
  children: ReactNode;
  title: string;
  recipientName?: string;
  recipientId?: string;
  onlineStatus?: 'online' | 'offline' | 'away';
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ 
  children, 
  title, 
  recipientName, 
  recipientId,
  onlineStatus = 'offline' 
}) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/friends', icon: <Users size={20} />, label: 'Friends' },
    { path: '/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
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
            
            {recipientName && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                      {recipientName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(onlineStatus)} rounded-full border-2 border-gray-800`}></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{recipientName}</span>
                    <span className="text-xs text-gray-400">{onlineStatus}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors">
                    <Video size={18} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors">
                    <Info size={18} />
                  </button>
                </div>
              </div>
            )}
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
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
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
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
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
        <main className="flex-1 bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
