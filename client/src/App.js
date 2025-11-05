import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import { useNarrowcastWebSocket } from './hooks/useWebSocket';
import Dashboard from './pages/Dashboard';
import Slides from './pages/Slides';
import Presentations from './pages/Presentations';
import Branding from './pages/Branding';
import Logs from './pages/Logs';
import { MonitorPlay, Layers, Presentation, Palette, Activity, FileText } from 'lucide-react';

function App() {
  const {
    isConnected,
    devices,
    slides,
    presentations,
    statistics
  } = useNarrowcastWebSocket();

  const navigation = [
    { path: '/', label: 'Dashboard', icon: MonitorPlay },
    { path: '/slides', label: 'Slides', icon: Layers },
    { path: '/presentations', label: 'Presentations', icon: Presentation },
    { path: '/branding', label: 'Branding', icon: Palette },
    { path: '/logs', label: 'Logs', icon: FileText },
  ];

  return (
    <Router>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <MonitorPlay size={32} strokeWidth={1.5} />
              <span>Narrowcast Pro</span>
            </div>
          </div>

          <nav className="nav">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                <item.icon size={20} strokeWidth={1.5} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="status-indicator">
              <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="device-count">
              <Activity size={14} />
              {devices.length} {devices.length === 1 ? 'Device' : 'Devices'}
            </div>
            {statistics && (
              <div className="stats-summary">
                <div>{slides.length} Slides</div>
                <div>{presentations.length} Presentations</div>
              </div>
            )}
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard devices={devices} presentations={presentations} slides={slides} />}
            />
            <Route
              path="/slides"
              element={<Slides slides={slides} />}
            />
            <Route
              path="/presentations"
              element={<Presentations presentations={presentations} slides={slides} devices={devices} />}
            />
            <Route
              path="/branding"
              element={<Branding />}
            />
            <Route
              path="/logs"
              element={<Logs />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
