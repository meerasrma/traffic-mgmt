import React, { useState, useEffect } from 'react';
import { TrafficCone as Traffic, Play, Pause, RotateCcw, Settings, Clock, AlertTriangle } from 'lucide-react';

export default function TrafficLights() {
  const [intersections, setIntersections] = useState([
    {
      id: 1,
      name: 'Main St & 1st Ave',
      status: 'active',
      currentPhase: 'green-ns',
      timeRemaining: 45,
      mode: 'automatic',
      phases: ['green-ns', 'yellow-ns', 'red-ns', 'green-ew', 'yellow-ew', 'red-ew']
    },
    {
      id: 2,
      name: 'Broadway & Oak St',
      status: 'active',
      currentPhase: 'red-ns',
      timeRemaining: 12,
      mode: 'automatic',
      phases: ['green-ns', 'yellow-ns', 'red-ns', 'green-ew', 'yellow-ew', 'red-ew']
    },
    {
      id: 3,
      name: 'Central Ave & Pine St',
      status: 'maintenance',
      currentPhase: 'flashing-red',
      timeRemaining: 0,
      mode: 'manual',
      phases: ['green-ns', 'yellow-ns', 'red-ns', 'green-ew', 'yellow-ew', 'red-ew']
    },
    {
      id: 4,
      name: 'Harbor Rd & 3rd St',
      status: 'active',
      currentPhase: 'yellow-ew',
      timeRemaining: 8,
      mode: 'priority',
      phases: ['green-ns', 'yellow-ns', 'red-ns', 'green-ew', 'yellow-ew', 'red-ew']
    }
  ]);

  const [selectedIntersection, setSelectedIntersection] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntersections(prev => prev.map(intersection => {
        if (intersection.status !== 'active') return intersection;

        let newTimeRemaining = intersection.timeRemaining - 1;
        let newPhase = intersection.currentPhase;

        if (newTimeRemaining <= 0) {
          const currentIndex = intersection.phases.indexOf(intersection.currentPhase);
          const nextIndex = (currentIndex + 1) % intersection.phases.length;
          newPhase = intersection.phases[nextIndex];

          // Set new timing based on phase
          if (newPhase.includes('green')) newTimeRemaining = 45;
          else if (newPhase.includes('yellow')) newTimeRemaining = 8;
          else newTimeRemaining = 30;
        }

        return {
          ...intersection,
          currentPhase: newPhase,
          timeRemaining: newTimeRemaining
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPhaseColor = (phase) => {
    if (phase.includes('green')) return 'bg-green-500';
    if (phase.includes('yellow')) return 'bg-yellow-500';
    if (phase.includes('red')) return 'bg-red-500';
    return 'bg-gray-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'automatic': return 'text-blue-600 bg-blue-100';
      case 'manual': return 'text-purple-600 bg-purple-100';
      case 'priority': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  const getPhaseTime = (phase) => {
  if (phase.includes('green')) return 45;
  if (phase.includes('yellow')) return 8;
  return 30;
};

  const TrafficLightDisplay = ({ phase }) => {
    const isNorthSouth = phase.includes('ns');
    const direction = isNorthSouth ? 'N/S' : 'E/W';
    const color = phase.includes('green') ? 'green' : phase.includes('yellow') ? 'yellow' : 'red';

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-xs font-medium text-gray-600">{direction}</div>
        <div className="bg-gray-800 p-2 rounded-lg">
          <div className="space-y-1">
            <div className={`w-4 h-4 rounded-full ${color === 'red' ? 'bg-red-500' : 'bg-gray-600'}`}></div>
            <div className={`w-4 h-4 rounded-full ${color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
            <div className={`w-4 h-4 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
          </div>
        </div>
      </div>
    );
  };

  const controlIntersection = (id, action) => {
    setIntersections(prev =>
      prev.map(intersection => {
        if (intersection.id !== id) return intersection;

        switch (action) {
          case 'pause':
            return {
              ...intersection,
              status: intersection.status === 'active' ? 'paused' : 'active',
            };
          case 'reset':
            return {
              ...intersection,
              currentPhase: 'green-ns',
              timeRemaining: 45,
            };
          case 'manual':
            return {
              ...intersection,
              mode: intersection.mode === 'manual' ? 'automatic' : 'manual',
              status: 'active', // optional: auto-resume on manual switch
            };
          default:
            return intersection;
        }
      })
    );
  };
  const handleEmergencyControl = (type) => {
    setIntersections(prev => prev.map(intersection => {
      if (intersection.status === 'maintenance') return intersection;

      if (type === 'all-stop') {
        return { ...intersection, currentPhase: 'red-ns', timeRemaining: 30 };
      }
      if (type === 'priority') {
        return { ...intersection, currentPhase: 'green-ns', timeRemaining: 45 };
      }
      if (type === 'resume') {
        return { ...intersection, currentPhase: 'green-ns', timeRemaining: 45, status: 'active' };
      }

      return intersection;
    }));
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Traffic Light Control</h2>
          <p className="text-gray-600">Monitor and control traffic signals across the city</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {intersections.map((intersection) => (
          <div key={intersection.id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{intersection.name}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(intersection.status)}`}>
                      {intersection.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModeColor(intersection.mode)}`}>
                      {intersection.mode}
                    </span>
                  </div>
                </div>
                <Traffic className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="grid grid-cols-2 gap-6">
                  <TrafficLightDisplay phase={intersection.currentPhase} />
                  <TrafficLightDisplay
                    phase={
                      intersection.currentPhase.includes('ns')
                        ? intersection.currentPhase.replace('ns', 'ew')
                        : intersection.currentPhase.replace('ew', 'ns')
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {intersection.timeRemaining}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    seconds remaining
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => controlIntersection(intersection.id, 'pause')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  aria-label={`${intersection.status === 'active' ? 'Pause' : 'Resume'} traffic light`}
                >
                  {intersection.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{intersection.status === 'active' ? 'Pause' : 'Resume'}</span>
                </button>

                <button
                  onClick={() => controlIntersection(intersection.id, 'reset')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
                  aria-label="Reset traffic light"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => controlIntersection(intersection.id, 'manual')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  aria-label="Toggle manual mode"
                >
                  <Settings className="w-4 h-4" />
                  <span>{intersection.mode === 'manual' ? 'Auto' : 'Manual'}</span>
                </button>
              </div>
            </div>

            {intersection.status === 'maintenance' && (
              <div className="bg-red-50 border-t border-red-200 p-4">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Maintenance Mode Active</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Override Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Controls</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleEmergencyControl('all-stop')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              All Stop - Emergency
            </button>
            <button
              onClick={() => handleEmergencyControl('priority')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Priority Route Clear
            </button>
            <button
              onClick={() => handleEmergencyControl('resume')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Resume Normal Operation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}