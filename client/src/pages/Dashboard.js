import React, { useState } from 'react';
import axios from 'axios';
import {
  MonitorPlay,
  Cast,
  StopCircle,
  Volume2,
  Wifi,
  WifiOff,
  Play,
  ExternalLink
} from 'lucide-react';
import './Dashboard.css';

function Dashboard({ devices }) {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [castUrl, setCastUrl] = useState('');
  const [volume, setVolume] = useState(50);
  const [loading, setLoading] = useState(false);

  const toggleDevice = (deviceId) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const selectAll = () => {
    setSelectedDevices(devices.map(d => d.id));
  };

  const deselectAll = () => {
    setSelectedDevices([]);
  };

  const handleCast = async () => {
    if (!castUrl || selectedDevices.length === 0) return;

    setLoading(true);
    try {
      await axios.post('/api/cast', {
        deviceIds: selectedDevices,
        url: castUrl,
        contentType: 'text/html'
      });
    } catch (error) {
      console.error('Cast failed:', error);
      alert('Failed to cast content');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (selectedDevices.length === 0) return;

    setLoading(true);
    try {
      await axios.post('/api/stop', {
        deviceIds: selectedDevices
      });
    } catch (error) {
      console.error('Stop failed:', error);
      alert('Failed to stop devices');
    } finally {
      setLoading(false);
    }
  };

  const handleVolumeChange = async (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);

    if (selectedDevices.length === 0) return;

    try {
      await axios.post('/api/volume', {
        deviceIds: selectedDevices,
        level: newVolume
      });
    } catch (error) {
      console.error('Volume change failed:', error);
    }
  };

  const playingDevices = devices.filter(d => d.status === 'playing').length;
  const idleDevices = devices.filter(d => d.status === 'idle').length;

  return (
    <div className="page dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Manage and control your Chromecast devices
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 113, 227, 0.1)' }}>
            <MonitorPlay size={24} color="var(--color-accent)" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Devices</div>
            <div className="stat-value">{devices.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52, 199, 89, 0.1)' }}>
            <Play size={24} color="var(--color-success)" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Playing</div>
            <div className="stat-value">{playingDevices}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(142, 142, 147, 0.1)' }}>
            <StopCircle size={24} color="var(--color-text-secondary)" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Idle</div>
            <div className="stat-value">{idleDevices}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 149, 0, 0.1)' }}>
            <Cast size={24} color="var(--color-warning)" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Selected</div>
            <div className="stat-value">{selectedDevices.length}</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel card">
        <div className="card-header">
          <h3 className="card-title">Quick Cast</h3>
          <div className="button-group">
            <button className="btn btn-sm btn-ghost" onClick={selectAll}>
              Select All
            </button>
            <button className="btn btn-sm btn-ghost" onClick={deselectAll}>
              Deselect All
            </button>
          </div>
        </div>

        <div className="control-content">
          <div className="input-group">
            <label>URL to Cast</label>
            <div className="url-input-wrapper">
              <input
                type="url"
                placeholder="https://example.com"
                value={castUrl}
                onChange={(e) => setCastUrl(e.target.value)}
                className="url-input"
              />
              <ExternalLink size={18} className="url-icon" />
            </div>
          </div>

          <div className="control-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleCast}
              disabled={loading || !castUrl || selectedDevices.length === 0}
            >
              <Cast size={18} />
              Cast to {selectedDevices.length} {selectedDevices.length === 1 ? 'Device' : 'Devices'}
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleStop}
              disabled={loading || selectedDevices.length === 0}
            >
              <StopCircle size={18} />
              Stop
            </button>
          </div>

          <div className="volume-control">
            <div className="volume-header">
              <Volume2 size={18} />
              <span>Volume: {volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              disabled={selectedDevices.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="devices-section">
        <h3>Devices</h3>

        {devices.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">
              <WifiOff size={48} />
            </div>
            <h4 className="empty-state-title">No Devices Found</h4>
            <p className="empty-state-description">
              Make sure your Chromecasts are on the same network and discoverable.
            </p>
          </div>
        ) : (
          <div className="grid grid-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`device-card card ${selectedDevices.includes(device.id) ? 'selected' : ''} ${device.status}`}
                onClick={() => toggleDevice(device.id)}
              >
                <div className="device-header">
                  <div className="device-icon">
                    <MonitorPlay size={24} strokeWidth={1.5} />
                  </div>
                  <div className={`device-status-dot ${device.status}`} />
                </div>

                <div className="device-body">
                  <h4 className="device-name">{device.name}</h4>
                  <div className="device-info">
                    <div className="device-info-item">
                      <Wifi size={14} />
                      <span>{device.host}</span>
                    </div>
                    {device.currentUrl && (
                      <div className="device-current-url">
                        <ExternalLink size={14} />
                        <span className="truncate">{device.currentUrl}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="device-footer">
                  <span className={`badge badge-${device.status === 'playing' ? 'success' : 'info'}`}>
                    {device.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
