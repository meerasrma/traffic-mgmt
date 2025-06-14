import React, { useState, useEffect } from 'react';
import {
  Map,
  Navigation,
  Zap,
  AlertTriangle,
  Construction,
  MapPin,
  Layers,
  Filter
} from 'lucide-react';

export default function TrafficMap() {
  const [mapLayers, setMapLayers] = useState({
    traffic: true,
    incidents: true,
    cameras: false,
    construction: true,
    emergencyVehicles: true
  });

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [trafficData, setTrafficData] = useState([
    { id: 1, location: 'Main St', congestion: 85, speed: 15, type: 'heavy' },
    { id: 2, location: 'Broadway', congestion: 45, speed: 35, type: 'moderate' },
    { id: 3, location: 'Highway 101', congestion: 92, speed: 12, type: 'severe' },
    { id: 4, location: 'Park Ave', congestion: 25, speed: 45, type: 'light' }
  ]);

  const incidents = [
    { id: 1, type: 'accident', location: { x: 65, y: 40 }, severity: 'high', description: 'Multi-vehicle accident' },
    { id: 2, type: 'construction', location: { x: 30, y: 60 }, severity: 'medium', description: 'Road maintenance' },
    { id: 3, type: 'breakdown', location: { x: 80, y: 25 }, severity: 'low', description: 'Vehicle breakdown' }
  ];

  const emergencyVehicles = [
    { id: 1, type: 'ambulance', location: { x: 45, y: 35 }, destination: 'Hospital' },
    { id: 2, type: 'fire', location: { x: 55, y: 70 }, destination: 'Downtown' },
    { id: 3, type: 'police', location: { x: 75, y: 45 }, destination: 'Main St' }
  ];

  const toggleLayer = (layer) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const getCongestionColor = (level) => {
    if (level > 80) return 'bg-red-500';
    if (level > 60) return 'bg-yellow-500';
    if (level > 30) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'accident': return AlertTriangle;
      case 'construction': return Construction;
      case 'breakdown': return MapPin;
      default: return AlertTriangle;
    }
  };

  const getIncidentColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => prev.map(item => ({
        ...item,
        congestion: Math.max(10, Math.min(100, item.congestion + (Math.random() - 0.5) * 10)),
        speed: Math.max(5, Math.min(60, item.speed + (Math.random() - 0.5) * 5))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const handleEmergencyControl = (type) => {
    setTrafficData(prev =>
      prev.map(data => {
        if (type === 'all-stop') {
          return { ...data, congestion: 100, speed: 0, type: 'severe' };
        }

        if (type === 'priority') {
          return { ...data, congestion: 20, speed: 60, type: 'light' };
        }

        if (type === 'resume') {
          return {
            ...data,
            congestion: Math.floor(Math.random() * 70) + 10,
            speed: Math.floor(Math.random() * 50) + 10,
            type: 'moderate'
          };
        }

        return data;
      })
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Traffic Map</h2>
          <p className="text-gray-600">Real-time traffic monitoring and route management</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Routes</option>
            <option value="congested">Congested Only</option>
            <option value="incidents">With Incidents</option>
            <option value="emergency">Emergency Routes</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Navigation className="w-4 h-4" />
            <span>Route Optimizer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Display */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Live Traffic Map</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <Layers className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Map Container - Simulated map view */}
            <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
              {/* Background map pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-10 grid-rows-10 h-full">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>

              {/* Traffic flow indicators */}
              {mapLayers.traffic && (
                <>
                  <div className="absolute top-8 left-8 w-32 h-2 bg-red-500 rounded-full opacity-80"></div>
                  <div className="absolute top-16 left-16 w-24 h-2 bg-yellow-500 rounded-full opacity-80"></div>
                  <div className="absolute bottom-20 right-12 w-28 h-2 bg-green-500 rounded-full opacity-80"></div>
                  <div className="absolute bottom-8 left-24 w-20 h-2 bg-orange-500 rounded-full opacity-80"></div>
                </>
              )}

              {/* Incidents */}
              {mapLayers.incidents && incidents.map((incident) => {
                const Icon = getIncidentIcon(incident.type);
                return (
                  <div
                    key={incident.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${incident.location.x}%`, top: `${incident.location.y}%` }}
                  >
                    <div className={`p-2 rounded-full ${getIncidentColor(incident.severity)} cursor-pointer hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}

              {/* Emergency Vehicles */}
              {mapLayers.emergencyVehicles && emergencyVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${vehicle.location.x}%`, top: `${vehicle.location.y}%` }}
                >
                  <div className="p-2 bg-blue-600 text-white rounded-full animate-pulse">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              ))}

              {/* Map legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                <div className="text-xs font-medium text-gray-900 mb-2">Traffic Density</div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-600">Light</span>
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-xs text-gray-600">Moderate</span>
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-600">Heavy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Layer Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Map Layers</h3>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(mapLayers).map(([layer, enabled]) => (
                <label key={layer} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleLayer(layer)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {layer.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Traffic Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Stats</h3>
            </div>
            <div className="p-4 space-y-4">
              {trafficData.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{item.location}</span>
                    <span className="text-xs text-gray-500">{item.speed} mph</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCongestionColor(item.congestion)}`}
                        style={{ width: `${item.congestion}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{item.congestion}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Clear Emergency Route
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Optimize Traffic Flow
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Deploy Traffic Units
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Generate Report
              </button>
            </div>
          </div>

          {/* Emergency Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Emergency Controls</h3>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => handleEmergencyControl('all-stop')}
                className="w-full px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                All Stop - Emergency
              </button>
              <button
                onClick={() => handleEmergencyControl('priority')}
                className="w-full px-3 py-2 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                Priority Route Clear
              </button>
              <button
                onClick={() => handleEmergencyControl('resume')}
                className="w-full px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Resume Normal Operation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}