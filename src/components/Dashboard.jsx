import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import {
  TrafficCone as Traffic,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  MapPin,
  Zap,
  Activity
} from 'lucide-react';



export default function Dashboard() {
  
  const [stats, setStats] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [intersectionStatus, setIntersectionStatus] = useState([]);


  useEffect(() => {
    const statsRef = ref(database, 'dashboardStats');
    const incidentsRef = ref(database, 'recentIncidents');
    const intersectionsRef = ref(database, 'intersectionStatus');

    const unsubscribeStats = onValue(statsRef, (snapshot) => {
      setStats(snapshot.val() || {});
    });

    const unsubscribeIncidents = onValue(incidentsRef, (snapshot) => {
      const data = snapshot.val();
      setRecentIncidents(data ? Object.values(data) : []);
    });

    const unsubscribeIntersections = onValue(intersectionsRef, (snapshot) => {
      const data = snapshot.val();
      setIntersectionStatus(data ? Object.values(data) : []);
    });

    return () => {
      unsubscribeStats();
      unsubscribeIncidents();
      unsubscribeIntersections();
    };
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <div className="text-center space-y-2">
          <p className="text-xl font-medium">Loading Dashboard...</p>
          <p className="text-sm">Fetching real-time traffic data from Firebase</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, unit, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600'
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {value}
              {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
            </p>
            {trend && (
              <div className="flex items-center mt-2">
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(trend)}% vs last hour
                </span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 w-full max-w-screen-xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        <StatCard
          title="Active Intersections"
          value={stats.activeIntersections}
          icon={Traffic}
          trend={2.5}
          color="blue"
        />
        <StatCard
          title="Active Incidents"
          value={stats.totalIncidents}
          icon={AlertTriangle}
          trend={-12}
          color="red"
        />
        <StatCard
          title="Avg Response Time"
          value={stats.avgResponseTime.toFixed(1)}
          unit="min"
          icon={Clock}
          trend={-8}
          color="green"
        />
        <StatCard
          title="Traffic Flow"
          value={stats.trafficFlow.toFixed(0)}
          unit="%"
          icon={Activity}
          trend={5.2}
          color="purple"
        />
        <StatCard
          title="Emergency Vehicles"
          value={stats.emergencyVehicles}
          icon={Zap}
          color="yellow"
        />
        <StatCard
          title="System Load"
          value={stats.systemLoad.toFixed(0)}
          unit="%"
          icon={Users}
          trend={-3.1}
          color="blue"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Recent Incidents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full lg:w-1/2">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Incidents</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {incident.location}
                    </p>
                    <p className="text-sm text-gray-500">{incident.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className="text-xs text-gray-500">{incident.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intersection Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full lg:w-1/2">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Intersection Status</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Manage All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {intersectionStatus.map((intersection) => (
                <div key={intersection.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Traffic className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{intersection.name}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(intersection.status)}`}>
                        {intersection.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{intersection.flow}%</p>
                    <p className="text-xs text-gray-500">Flow Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-64 sm:h-72 md:h-80 text-gray-500 w-full overflow-hidden">
            <div className="text-center">
              <Activity className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Performance Chart</p>
              <p className="text-sm">Real-time traffic flow and system metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}