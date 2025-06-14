import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TrafficLights from './components/TrafficLights';
import TrafficMap from './components/TrafficMap';
import IncidentManager from './components/IncidentManager';
import Analytics from './components/Analytics';
import AlertSystem from './components/AlertSystem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="traffic-lights" element={<TrafficLights />} />
          <Route path="map" element={<TrafficMap />} />
          <Route path="incidents" element={<IncidentManager />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<AlertSystem />} />
          <Route path="*" element={<div className="text-center text-gray-500 mt-10">Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
