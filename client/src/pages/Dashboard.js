import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { presentationAPI, deviceAPI } from '../services/api';
import {
  MonitorPlay,
  Play,
  StopCircle,
  Wifi,
  WifiOff,
  ExternalLink,
  Presentation as PresentationIcon,
  AlertCircle,
  Settings
} from 'lucide-react';
import './Dashboard.css';

function Dashboard({ devices, presentations, setupStatus }) {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedPresentation, setSelectedPresentation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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

  const handleCastPresentation = async () => {
    if (!selectedPresentation || selectedDevices.length === 0) {
      setMessage({ type: 'error', text: 'Please select a presentation and at least one device' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await presentationAPI.cast(selectedPresentation, selectedDevices);
      setMessage({
        type: 'success',
        text: `Successfully cast presentation to ${selectedDevices.length} device(s)`
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to cast: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (selectedDevices.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one device' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await deviceAPI.stop(selectedDevices);
      setMessage({ type: 'success', text: 'Successfully stopped playback' });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to stop: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const playingDevices = devices.filter(d => d.status === 'playing').length;
  const idleDevices = devices.filter(d => d.status === 'idle').length;

  return (
    <div className="page dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Manage your Chromecast devices and cast presentations
        </p>
      </div>

      {/* Setup Warning Banner */}
      {setupStatus && !setupStatus.appIdConfigured && (
        <div className="setup-warning-banner">
          <div className="banner-icon">
            <AlertCircle size={24} />
          </div>
          <div className="banner-content">
            <h3>Chromecast Setup Required</h3>
            <p>
              HTML presentations will not work without configuring your Chromecast receiver.
              This only takes 15-30 minutes and is required once.
            </p>
          </div>
          <Link to="/setup" className="banner-action">
            <Settings size={18} />
            <span>Start Setup</span>
          </Link>
        </div>
      )}

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
            <PresentationIcon size={24} color="var(--color-warning)" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Presentations</div>
            <div className="stat-value">{presentations.length}</div>
          </div>
        </div>
      </div>

      {/* Quick Cast Panel */}
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
            <label>Select Presentation</label>
            <select
              value={selectedPresentation}
              onChange={(e) => setSelectedPresentation(e.target.value)}
              disabled={presentations.length === 0}
            >
              <option value="">-- Select a presentation --</option>
              {presentations.map((presentation) => (
                <option key={presentation.id} value={presentation.id}>
                  {presentation.name} ({presentation.slides?.length || 0} slides)
                </option>
              ))}
            </select>
            {presentations.length === 0 && (
              <small style={{ color: 'var(--color-text-tertiary)' }}>
                No presentations available. Create one in the Presentations page.
              </small>
            )}
          </div>

          {message && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="control-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleCastPresentation}
              disabled={loading || !selectedPresentation || selectedDevices.length === 0}
            >
              <Play size={18} />
              {loading ? 'Casting...' : `Cast to ${selectedDevices.length} ${selectedDevices.length === 1 ? 'Device' : 'Devices'}`}
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
        </div>
      </div>

      {/* Devices Grid */}
      <div className="devices-section">
        <h3>Chromecast Devices</h3>

        {devices.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">
              <WifiOff size={48} />
            </div>
            <h4 className="empty-state-title">No Devices Found</h4>
            <p className="empty-state-description">
              Make sure your Chromecasts are on the same network.
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
