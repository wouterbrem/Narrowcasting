import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Users, MonitorPlay } from 'lucide-react';
import './Common.css';

function Groups({ devices }) {
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    deviceIds: []
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name || newGroup.deviceIds.length === 0) {
      alert('Please provide a name and select at least one device');
      return;
    }

    try {
      await axios.post('/api/groups', newGroup);
      setShowCreateModal(false);
      setNewGroup({ name: '', deviceIds: [] });
      fetchGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    try {
      await axios.delete(`/api/groups/${groupId}`);
      fetchGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
      alert('Failed to delete group');
    }
  };

  const toggleDevice = (deviceId) => {
    setNewGroup(prev => ({
      ...prev,
      deviceIds: prev.deviceIds.includes(deviceId)
        ? prev.deviceIds.filter(id => id !== deviceId)
        : [...prev.deviceIds, deviceId]
    }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Device Groups</h1>
          <p className="page-description">
            Organize devices into groups for easier management
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">
            <Users size={48} />
          </div>
          <h4 className="empty-state-title">No Groups Yet</h4>
          <p className="empty-state-description">
            Create groups to manage multiple devices at once
          </p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-3">
          {groups.map((group) => (
            <div key={group.id} className="card group-card">
              <div className="card-header">
                <div className="group-icon">
                  <Users size={24} strokeWidth={1.5} />
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="group-name">{group.name}</h3>

              <div className="group-devices">
                <div className="group-devices-header">
                  <MonitorPlay size={16} />
                  <span>{group.deviceIds.length} {group.deviceIds.length === 1 ? 'Device' : 'Devices'}</span>
                </div>
                <div className="device-list">
                  {group.deviceIds.map((deviceId) => {
                    const device = devices.find(d => d.id === deviceId);
                    return device ? (
                      <div key={deviceId} className="device-item">
                        <div className={`device-status-dot ${device.status}`} />
                        <span>{device.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="group-footer">
                <span className="text-tertiary text-xs">
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Group</h2>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label>Group Name</label>
                <input
                  type="text"
                  placeholder="e.g., Reception Displays"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="input-group">
                <label>Select Devices ({newGroup.deviceIds.length} selected)</label>
                {devices.length === 0 ? (
                  <p className="text-tertiary text-sm">No devices available</p>
                ) : (
                  <div className="device-selection-grid">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className={`device-selection-card ${newGroup.deviceIds.includes(device.id) ? 'selected' : ''}`}
                        onClick={() => toggleDevice(device.id)}
                      >
                        <div className="device-selection-header">
                          <input
                            type="checkbox"
                            checked={newGroup.deviceIds.includes(device.id)}
                            onChange={() => toggleDevice(device.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className={`device-status-dot ${device.status}`} />
                        </div>
                        <MonitorPlay size={32} strokeWidth={1.5} />
                        <span className="device-selection-name">{device.name}</span>
                        <span className="device-selection-host">{device.host}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateGroup}
                disabled={!newGroup.name || newGroup.deviceIds.length === 0}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
