import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  MapPin, 
  Clock, 
  User, 
  Phone,
  FileText,
  CheckCircle,
  Eye
} from 'lucide-react';

export default function IncidentManager() {
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      title: 'Multi-vehicle accident on Main St',
      type: 'accident',
      severity: 'high',
      status: 'active',
      location: 'Main St & 5th Ave',
      reportedAt: new Date(Date.now() - 1000 * 60 * 15),
      reportedBy: 'Traffic Camera AI',
      description: 'Three-car collision blocking two lanes of traffic',
      responseTeam: 'Unit 12, Unit 7',
      estimatedClearTime: 45
    },
    {
      id: 2,
      title: 'Construction work delays',
      type: 'construction',
      severity: 'medium',
      status: 'ongoing',
      location: 'Highway 101 Exit 12',
      reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      reportedBy: 'City Planning Dept',
      description: 'Scheduled road maintenance causing lane closures',
      responseTeam: 'Construction Team A',
      estimatedClearTime: 180
    },
    {
      id: 3,
      title: 'Vehicle breakdown',
      type: 'breakdown',
      severity: 'low',
      status: 'resolved',
      location: 'Bridge St Overpass',
      reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
      reportedBy: 'Motorist Call',
      description: 'Disabled vehicle in shoulder area',
      responseTeam: 'Tow Service',
      estimatedClearTime: 0
    },
    {
      id: 4,
      title: 'Emergency vehicle priority',
      type: 'emergency',
      severity: 'high',
      status: 'active',
      location: 'Downtown Plaza area',
      reportedAt: new Date(Date.now() - 1000 * 60 * 5),
      reportedBy: 'Dispatch Center',
      description: 'Ambulance requiring priority route to hospital',
      responseTeam: 'Traffic Control',
      estimatedClearTime: 15
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewIncidentForm, setShowNewIncidentForm] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100';
      case 'ongoing': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'accident': return AlertTriangle;
      case 'construction': return FileText;
      case 'breakdown': return MapPin;
      case 'emergency': return Phone;
      default: return AlertTriangle;
    }
  };

  const filteredIncidents = incidents.filter(incident => 
    filterStatus === 'all' || incident.status === filterStatus
  );

  const updateIncidentStatus = (id, newStatus) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === id ? { ...incident, status: newStatus } : incident
    ));
  };

  const formatTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Incident Management</h2>
          <p className="text-gray-600">Monitor and respond to traffic incidents</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Incidents</option>
            <option value="active">Active</option>
            <option value="ongoing">Ongoing</option>
            <option value="resolved">Resolved</option>
          </select>
          <button 
            onClick={() => setShowNewIncidentForm(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {filteredIncidents.map((incident) => {
            const TypeIcon = getTypeIcon(incident.type);
            return (
              <div
                key={incident.id}
                className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all duration-200 flex flex-col ${
                  selectedIncident?.id === incident.id ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="p-6 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                    <div className="flex items-start space-x-3 min-w-0">
                      <div className={`p-2 rounded-lg ${getSeverityColor(incident.severity)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{incident.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">{incident.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full self-start sm:self-auto ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{incident.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeAgo(incident.reportedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{incident.reportedBy}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {incident.status === 'active' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateIncidentStatus(incident.id, 'resolved');
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateIncidentStatus(incident.id, 'ongoing');
                            }}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Incident Detail + Quick Actions */}
        <div className="space-y-6">
          {selectedIncident ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Incident Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedIncident.status)}`}>
                    {selectedIncident.status}
                  </span>
                </div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Location</label><p>{selectedIncident.location}</p></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Response Team</label><p>{selectedIncident.responseTeam}</p></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Estimated Clear Time</label><p>{selectedIncident.estimatedClearTime > 0 ? `${selectedIncident.estimatedClearTime} minutes` : 'Resolved'}</p></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Reported By</label><p>{selectedIncident.reportedBy}</p></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-1">Description</label><p>{selectedIncident.description}</p></div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No Incident Selected</p>
              <p className="text-sm">Click on an incident to view details</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-2">
              {["Dispatch Emergency Response", "Update Traffic Signals", "Notify Public Transit", "Send Traffic Alert"].map(action => (
                <button key={action} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
