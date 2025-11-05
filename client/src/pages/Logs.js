import React, { useState, useEffect, useCallback } from 'react';
import { systemAPI } from '../services/api';
import { FileText, RefreshCw, Download, Filter, AlertCircle, CheckCircle, Info } from 'lucide-react';
import './Logs.css';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logType, setLogType] = useState('combined');
  const [lines, setLines] = useState(100);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch logs (memoized to prevent infinite loops)
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await systemAPI.getLogs(logType, lines);
      setLogs(response.logs || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [logType, lines]);

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLogs();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  // Download logs
  const handleDownload = () => {
    const content = logs.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narrowcast-${logType}-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Parse log entry
  const parseLogEntry = (entry) => {
    const match = entry.match(/\[(.*?)\]\s+(\w+):\s+(.*)/);
    if (match) {
      return {
        timestamp: match[1],
        level: match[2],
        message: match[3]
      };
    }
    return {
      timestamp: '',
      level: 'INFO',
      message: entry
    };
  };

  // Get icon for log level
  const getLogIcon = (level) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return <AlertCircle size={16} color="var(--color-danger)" />;
      case 'WARN':
      case 'WARNING':
        return <AlertCircle size={16} color="var(--color-warning)" />;
      case 'INFO':
        return <Info size={16} color="var(--color-accent)" />;
      default:
        return <CheckCircle size={16} color="var(--color-success)" />;
    }
  };

  // Get log level class
  const getLogLevelClass = (level) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return 'log-error';
      case 'WARN':
      case 'WARNING':
        return 'log-warning';
      case 'DEBUG':
        return 'log-debug';
      default:
        return 'log-info';
    }
  };

  return (
    <div className="page logs-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity Logs</h1>
          <p className="page-description">
            View system activity, errors, and debug information
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="logs-controls card">
        <div className="controls-row">
          <div className="control-group">
            <label htmlFor="logType">
              <Filter size={16} />
              Log Type
            </label>
            <select
              id="logType"
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
            >
              <option value="combined">All Logs</option>
              <option value="activity">Activity Only</option>
              <option value="error">Errors Only</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="lines">
              <FileText size={16} />
              Lines
            </label>
            <select
              id="lines"
              value={lines}
              onChange={(e) => setLines(parseInt(e.target.value))}
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="autoRefresh" className="checkbox-label">
              <input
                id="autoRefresh"
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Auto-refresh (5s)</span>
            </label>
          </div>

          <div className="control-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              Refresh
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={handleDownload}
              disabled={logs.length === 0}
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      {/* Logs Display */}
      <div className="logs-container card">
        <div className="logs-header">
          <h3>
            <FileText size={18} />
            {logType === 'combined' ? 'All Logs' : logType === 'activity' ? 'Activity Logs' : 'Error Logs'}
          </h3>
          <span className="log-count">{logs.length} entries</span>
        </div>

        <div className="logs-content">
          {loading && logs.length === 0 ? (
            <div className="logs-loading">
              <RefreshCw size={24} className="spinning" />
              <p>Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="logs-empty">
              <FileText size={48} />
              <h4>No Logs Available</h4>
              <p>System logs will appear here as activity occurs</p>
            </div>
          ) : (
            <div className="logs-list">
              {logs.map((entry, index) => {
                const parsed = parseLogEntry(entry);
                return (
                  <div
                    key={index}
                    className={`log-entry ${getLogLevelClass(parsed.level)}`}
                  >
                    <div className="log-icon">{getLogIcon(parsed.level)}</div>
                    <div className="log-timestamp">{parsed.timestamp}</div>
                    <div className="log-level">{parsed.level}</div>
                    <div className="log-message">{parsed.message}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="logs-help card">
        <h4>Understanding the Logs</h4>
        <ul>
          <li>
            <strong>Activity Logs:</strong> Show user actions like device discovery, casting,
            slide creation, and presentation updates
          </li>
          <li>
            <strong>Error Logs:</strong> Display system errors and issues that need attention
          </li>
          <li>
            <strong>Combined Logs:</strong> Include all activity, errors, and debug information
          </li>
          <li>
            <strong>Auto-refresh:</strong> Enable to automatically update logs every 5 seconds
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Logs;
