import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Volume2,
  VolumeX,
  Filter,
  Plus
} from 'lucide-react';

export default function AlertSystem() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Major Traffic Incident',
      message: 'Multi-vehicle accident on Main St causing severe delays',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      acknowledged: false,
      source: 'Traffic Cameras'
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Traffic Volume',
      message: 'Unusual traffic congestion detected on Highway 101',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: true,
      acknowledged: true,
      source: 'Traffic Sensors'
    },
    {
      id: 3,
      type: 'info',
      title: 'System Maintenance',
      message: 'Routine maintenance scheduled for tonight 2-4 AM',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
      acknowledged: false,
      source: 'System Admin'
    },
    {
      id: 4,
      type: 'success',
      title: 'Incident Resolved',
      message: 'Vehicle breakdown on Bridge St has been cleared',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
      acknowledged: false,
      source: 'Response Team'
    },
    {
      id: 5,
      type: 'critical',
      title: 'Emergency Vehicle Priority',
      message: 'Ambulance requires priority route clearance to hospital',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      read: false,
      acknowledged: false,
      source: 'Emergency Dispatch'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const alertSettings = {
    critical: { enabled: true, sound: true, email: true, sms: true },
    warning: { enabled: true, sound: true, email: true, sms: false },
    info: { enabled: true, sound: false, email: true, sms: false },
    success: { enabled: true, sound: false, email: false, sms: false }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'success': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAsAcknowledged = (id) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, acknowledged: true, read: true } : alert
    ));
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.read;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    return alert.type === filter;
  });

  const formatTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  const AlertCard = ({ alert }) => {
    const Icon = getAlertIcon(alert.type);
    const colorClass = getAlertColor(alert.type);

    return (
      <div className={`border-2 rounded-xl h-full flex flex-col justify-between transition-all duration-200 ${alert.read ? 'bg-white' : 'bg-blue-50 border-blue-200'} ${!alert.read ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-lg font-semibold text-gray-900 break-words`}>
                  {alert.title}
                </h3>
                <div className="flex items-center space-x-2 ml-4">
                  {!alert.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <span className="text-xs text-gray-500 whitespace-nowrap break-words">
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-3 break-words">{alert.message}</p>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2 text-sm text-gray-500 break-words flex-wrap">
                  <span>Source: {alert.source}</span>
                  {alert.acknowledged && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                      Acknowledged
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                  {!alert.acknowledged && (
                    <button
                      onClick={() => markAsAcknowledged(alert.id)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full font-medium transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AlertStats = () => {
    const stats = {
      total: alerts.length,
      unread: alerts.filter(a => !a.read).length,
      critical: alerts.filter(a => a.type === 'critical').length,
      unacknowledged: alerts.filter(a => !a.acknowledged).length
    };

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Alerts</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
          <div className="text-sm text-gray-600">Unread</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-gray-600">Critical</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.unacknowledged}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alert System</h2>
          <p className="text-gray-600">Monitor and manage system notifications</p>
        </div>
        <div className="flex flex-wrap justify-start sm:justify-end items-center gap-2 md:gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Alert</span>
          </button>
        </div>
      </div>

      <AlertStats />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'unread', 'critical', 'warning', 'info', 'success'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === filterType ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && alerts.filter(a => !a.read).length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {alerts.filter(a => !a.read).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts Found</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'There are no alerts to display.' : `No ${filter} alerts at this time.`}
            </p>
          </div>
        )}
      </div>

      {showSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alert Settings</h3>
          </div>
          <div className="p-6 space-y-6">
            {Object.entries(alertSettings).map(([type, settings]) => (
              <div key={type} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 capitalize">{type} Alerts</h4>
                  <p className="text-xs text-gray-600">Configure {type} alert notifications</p>
                </div>
                <div className="flex flex-wrap justify-end items-center gap-2 md:gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked={settings.sound} className="rounded" />
                    <span className="text-sm">Sound</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked={settings.email} className="rounded" />
                    <span className="text-sm">Email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked={settings.sms} className="rounded" />
                    <span className="text-sm">SMS</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
