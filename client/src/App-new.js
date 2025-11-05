import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard-new';
import Slides from './pages/Slides';
import Presentations from './pages/Presentations';
import { MonitorPlay, Layers, Presentation, Activity } from 'lucide-react';

function App() {
  const [devices, setDevices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' : 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3001`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'initial-state':
          setDevices(data.devices);
          setSlides(data.slides);
          setPresentations(data.presentations);
          setStatistics(data.statistics);
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

        case 'slideCreated':
          setSlides(prev => [...prev, data.slide]);
          break;

        case 'slideUpdated':
          setSlides(prev => prev.map(s =>
            s.id === data.slide.id ? data.slide : s
          ));
          break;

        case 'slideDeleted':
          setSlides(prev => prev.filter(s => s.id !== data.slideId));
          break;

        case 'presentationCreated':
          setPresentations(prev => [...prev, data.presentation]);
          break;

        case 'presentationUpdated':
          setPresentations(prev => prev.map(p =>
            p.id === data.presentation.id ? data.presentation : p
          ));
          break;

        case 'presentationDeleted':
          setPresentations(prev => prev.filter(p => p.id !== data.presentationId));
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
    { path: '/slides', label: 'Slides', icon: Layers },
    { path: '/presentations', label: 'Presentations', icon: Presentation },
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
              <div className={`status-dot ${wsConnected ? 'connected' : 'disconnected'}`} />
              <span>{wsConnected ? 'Connected' : 'Disconnected'}</span>
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
              element={<Dashboard devices={devices} presentations={presentations} />}
            />
            <Route
              path="/slides"
              element={<Slides slides={slides} />}
            />
            <Route
              path="/presentations"
              element={<Presentations presentations={presentations} slides={slides} devices={devices} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
