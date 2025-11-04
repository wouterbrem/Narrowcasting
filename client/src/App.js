import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import ContentBuilder from './pages/ContentBuilder';
import Playlists from './pages/Playlists';
import Schedule from './pages/Schedule';
import Groups from './pages/Groups';
import { MonitorPlay, Layout, List, Calendar, Users } from 'lucide-react';

function App() {
  const [devices, setDevices] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3001`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'devices':
          setDevices(data.devices);
          break;
        case 'deviceFound':
          setDevices(prev => [...prev, data.device]);
          break;
        case 'deviceLost':
          setDevices(prev => prev.filter(d => d.id !== data.deviceId));
          break;
        case 'deviceStatus':
          setDevices(prev => prev.map(d =>
            d.id === data.deviceId ? { ...d, status: data.status } : d
          ));
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const navigation = [
    { path: '/', label: 'Dashboard', icon: MonitorPlay },
    { path: '/content', label: 'Content Builder', icon: Layout },
    { path: '/playlists', label: 'Playlists', icon: List },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/groups', label: 'Groups', icon: Users },
  ];

  return (
    <Router>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <MonitorPlay size={32} strokeWidth={1.5} />
              <span>Cast Control</span>
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
              <div className={`status-dot ${wsConnected ? 'connected' : 'disconnected'}`} />
              <span>{wsConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="device-count">
              {devices.length} {devices.length === 1 ? 'Device' : 'Devices'}
            </div>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard devices={devices} />} />
            <Route path="/content" element={<ContentBuilder devices={devices} />} />
            <Route path="/playlists" element={<Playlists devices={devices} />} />
            <Route path="/schedule" element={<Schedule devices={devices} />} />
            <Route path="/groups" element={<Groups devices={devices} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
