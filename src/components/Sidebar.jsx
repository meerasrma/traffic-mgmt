import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrafficCone as Traffic,
  Map,
  AlertTriangle,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'traffic-lights', label: 'Traffic Control', icon: Traffic },
  { id: 'map', label: 'Traffic Map', icon: Map },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
];

export default function Sidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Traffic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TrafficFlow</h1>
            <p className="text-sm text-gray-500">Control Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <NavLink
                to={`/${id}`}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings Toggle */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <span className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="hidden sm:inline">Settings</span>
          </span>
          {settingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Settings Content */}
        {settingsOpen && (
          <div className="mt-2 bg-gray-50 border rounded p-3 text-sm text-gray-700 space-y-2">
            <p>🌗 Theme Mode: Light/Dark</p>
            <p>🔒 Change Password</p>
            <p>🚪 Logout</p>
          </div>
        )}
      </div>
    </div>
  );
}
