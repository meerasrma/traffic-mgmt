import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ systemStatus }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusInfo = () => {
    switch (systemStatus) {
      case 'operational':
        return {
          text: 'All Systems Operational',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: Wifi
        };
      case 'warning':
        return {
          text: 'System Warning',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: AlertCircle
        };
      case 'critical':
        return {
          text: 'Critical Alert',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: WifiOff
        };
      default:
        return {
          text: 'System Status Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: AlertCircle
        };
    }
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 flex-wrap">
        {/* Left Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Traffic Control Center</h2>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${status.bgColor} transition-all duration-300`}>
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search intersections, incidents..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Notification */}
          <Link
            to="/alerts"
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </Link>

          {/* Time Display */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg whitespace-nowrap">
            <span>{currentTime.toLocaleDateString()}</span>
            <span className="text-gray-400">|</span>
            <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
          </div>

          {/* User Button */}
          <button className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
