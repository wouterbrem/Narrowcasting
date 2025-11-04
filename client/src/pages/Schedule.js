import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Calendar, Clock, Link as LinkIcon } from 'lucide-react';
import './Common.css';

function Schedule({ devices }) {
  const [schedules, setSchedules] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    deviceIds: [],
    url: '',
    cronExpression: '0 9 * * *',
    duration: null
  });

  const cronPresets = [
    { label: 'Every day at 9:00', value: '0 9 * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every 30 minutes', value: '*/30 * * * *' },
    { label: 'Weekdays at 8:00', value: '0 8 * * 1-5' },
    { label: 'Custom', value: 'custom' }
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      await axios.post('/api/schedules', newSchedule);
      setShowCreateModal(false);
      setNewSchedule({
        name: '',
        deviceIds: [],
        url: '',
        cronExpression: '0 9 * * *',
        duration: null
      });
      fetchSchedules();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('Failed to create schedule. Check your cron expression.');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await axios.delete(`/api/schedules/${scheduleId}`);
      fetchSchedules();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      alert('Failed to delete schedule');
    }
  };

  const formatCron = (cron) => {
    const preset = cronPresets.find(p => p.value === cron);
    return preset ? preset.label : cron;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Schedule</h1>
          <p className="page-description">
            Schedule content to be displayed at specific times
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create Schedule
        </button>
      </div>

      <div className="grid grid-2">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="card schedule-card">
            <div className="card-header">
              <h3 className="card-title">{schedule.name}</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleDeleteSchedule(schedule.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="schedule-info">
              <div className="info-item">
                <Calendar size={16} />
                <span>{formatCron(schedule.cronExpression)}</span>
              </div>
              {schedule.duration && (
                <div className="info-item">
                  <Clock size={16} />
                  <span>{schedule.duration}s duration</span>
                </div>
              )}
              <div className="info-item">
                <LinkIcon size={16} />
                <span className="truncate">{schedule.url}</span>
              </div>
            </div>

            <div className="schedule-devices">
              <strong>Devices:</strong>
              <div className="device-tags">
                {schedule.deviceIds.map((deviceId) => {
                  const device = devices.find(d => d.id === deviceId);
                  return device ? (
                    <span key={deviceId} className="badge badge-info">
                      {device.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <div className="schedule-status">
              <span className={`badge ${schedule.enabled ? 'badge-success' : 'badge-error'}`}>
                {schedule.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Schedule</h2>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label>Schedule Name</label>
                <input
                  type="text"
                  placeholder="Morning Display"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>URL to Display</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newSchedule.url}
                  onChange={(e) => setNewSchedule({ ...newSchedule, url: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Schedule</label>
                <select
                  value={cronPresets.find(p => p.value === newSchedule.cronExpression) ? newSchedule.cronExpression : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setNewSchedule({ ...newSchedule, cronExpression: e.target.value });
                    }
                  }}
                >
                  {cronPresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Cron Expression</label>
                <input
                  type="text"
                  placeholder="0 9 * * *"
                  value={newSchedule.cronExpression}
                  onChange={(e) => setNewSchedule({ ...newSchedule, cronExpression: e.target.value })}
                />
                <small>Format: minute hour day month weekday (e.g., "0 9 * * *" = daily at 9:00)</small>
              </div>

              <div className="input-group">
                <label>Duration (seconds, optional)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Leave empty for indefinite"
                  value={newSchedule.duration || ''}
                  onChange={(e) => setNewSchedule({
                    ...newSchedule,
                    duration: e.target.value ? parseInt(e.target.value) : null
                  })}
                />
              </div>

              <div className="input-group">
                <label>Target Devices</label>
                <div className="device-checkboxes">
                  {devices.map((device) => (
                    <label key={device.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newSchedule.deviceIds.includes(device.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewSchedule({
                              ...newSchedule,
                              deviceIds: [...newSchedule.deviceIds, device.id]
                            });
                          } else {
                            setNewSchedule({
                              ...newSchedule,
                              deviceIds: newSchedule.deviceIds.filter(id => id !== device.id)
                            });
                          }
                        }}
                      />
                      <span>{device.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateSchedule}
                disabled={!newSchedule.name || !newSchedule.url || newSchedule.deviceIds.length === 0}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;
