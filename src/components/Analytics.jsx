import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { database } from '../firebase';
import { ref, set, onValue } from 'firebase/database';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('24h');
  const [analyticsData, setAnalyticsData] = useState(null);

  const topIncidentLocations = [
    { location: 'Main St & 5th Ave', incidents: 12, change: +8 },
    { location: 'Highway 101 Exit 12', incidents: 9, change: -3 },
    { location: 'Broadway & Oak St', incidents: 7, change: +2 },
    { location: 'Downtown Plaza', incidents: 6, change: -1 },
    { location: 'Bridge St Overpass', incidents: 5, change: +5 }
  ];

  const performanceMetrics = [
    {
      title: 'Average Response Time',
      value: '3.8',
      unit: 'min',
      change: -12,
      icon: Clock,
      color: 'green'
    },
    {
      title: 'Traffic Flow Efficiency',
      value: '87',
      unit: '%',
      change: +5,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Incident Resolution Rate',
      value: '94',
      unit: '%',
      change: +3,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Peak Hour Congestion',
      value: '78',
      unit: '%',
      change: -8,
      icon: MapPin,
      color: 'yellow'
    }
  ];

  useEffect(() => {
  const analyticsRef = ref(database, 'analytics');
  const unsubscribe = onValue(analyticsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setAnalyticsData(data);
    }
  });

  return () => unsubscribe();
}, []);

if (!analyticsData) {
  return (
    <div className="p-6 text-center text-gray-500">
      Loading traffic analytics...
    </div>
  );
}

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setAnalyticsData(prev => ({
  //       ...prev,
  //       trafficVolume: prev.trafficVolume.map(val =>
  //         Math.max(30, Math.min(100, val + (Math.random() - 0.5) * 5))
  //       )
  //     }));
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  const MetricCard = ({ title, value, unit, change, icon: Icon, color }) => {
    const colorClasses = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600'
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {value}
              {unit && <span className="text-base sm:text-lg text-gray-500 ml-1">{unit}</span>}
            </p>
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}% from last period
              </span>
            </div>
          </div>
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const ChartContainer = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4 sm:p-6 overflow-x-auto">{children}</div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Traffic Analytics</h2>
          <p className="text-sm sm:text-base text-gray-600">Performance insights and traffic patterns</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-auto">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-auto">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Traffic Volume Trends">
          <div className="flex items-end space-x-2 min-w-[600px]">
            {analyticsData.trafficVolume.map((value, index) => (
              <div key={index} className="flex-1 min-w-[10px] flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-500"
                  style={{ height: `${(value / 100) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <span>Hours</span>
            <span>Traffic Volume (%)</span>
          </div>
        </ChartContainer>

        <ChartContainer title="Incident Frequency">
          <div className="flex items-end space-x-2 min-w-[600px]">
            {analyticsData.incidentTrends.map((value, index) => (
              <div key={index} className="flex-1 min-w-[10px] flex flex-col items-center">
                <div
                  className="w-full bg-red-500 rounded-t transition-all duration-500"
                  style={{ height: `${(value / 10) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <span>Hours</span>
            <span>Incidents Count</span>
          </div>
        </ChartContainer>
      </div>

      {/* Top Incident Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Incident Locations</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {topIncidentLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{location.location}</p>
                    <p className="text-xs text-gray-500">{location.incidents} incidents</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {location.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`text-sm ${location.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(location.change)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Peak Hours Analysis</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {analyticsData.peakHours.map((hour, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{hour.hour}</span>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>{hour.volume}% volume</span>
                    <span>{hour.incidents} incidents</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${hour.volume}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Time */}
      <ChartContainer title="Response Time Analysis">
        <div className="flex items-end space-x-2 min-w-[600px]">
          {analyticsData.responseTime.map((value, index) => (
            <div key={index} className="flex-1 min-w-[10px] flex flex-col items-center">
              <div
                className="w-full bg-green-500 rounded-t transition-all duration-500"
                style={{ height: `${(value / 6) * 200}px` }}
              ></div>
              <span className="text-xs text-gray-600 mt-2">{index + 1}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-4">
          <span>Hours</span>
          <span>Average Response Time (minutes)</span>
        </div>
      </ChartContainer>
    </div>
  );
}
