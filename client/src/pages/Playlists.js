import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Play, StopCircle, Clock, Link as LinkIcon } from 'lucide-react';
import './Common.css';

function Playlists({ devices }) {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    urls: [''],
    interval: 30
  });
  const [selectedDevices, setSelectedDevices] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const filteredUrls = newPlaylist.urls.filter(url => url.trim() !== '');
      await axios.post('/api/playlists', {
        ...newPlaylist,
        urls: filteredUrls
      });
      setShowCreateModal(false);
      setNewPlaylist({ name: '', urls: [''], interval: 30 });
      fetchPlaylists();
    } catch (error) {
      console.error('Failed to create playlist:', error);
      alert('Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await axios.delete(`/api/playlists/${playlistId}`);
      fetchPlaylists();
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      alert('Failed to delete playlist');
    }
  };

  const handleStartPlaylist = async (playlistId) => {
    if (selectedDevices.length === 0) {
      alert('Please select at least one device');
      return;
    }

    try {
      await axios.post(`/api/playlists/${playlistId}/start`, {
        deviceIds: selectedDevices
      });
      alert('Playlist started!');
    } catch (error) {
      console.error('Failed to start playlist:', error);
      alert('Failed to start playlist');
    }
  };

  const handleStopPlaylist = async (playlistId) => {
    try {
      await axios.post(`/api/playlists/${playlistId}/stop`, {
        deviceIds: selectedDevices
      });
      alert('Playlist stopped!');
    } catch (error) {
      console.error('Failed to stop playlist:', error);
      alert('Failed to stop playlist');
    }
  };

  const addUrlField = () => {
    setNewPlaylist({
      ...newPlaylist,
      urls: [...newPlaylist.urls, '']
    });
  };

  const updateUrl = (index, value) => {
    const newUrls = [...newPlaylist.urls];
    newUrls[index] = value;
    setNewPlaylist({ ...newPlaylist, urls: newUrls });
  };

  const removeUrl = (index) => {
    const newUrls = newPlaylist.urls.filter((_, i) => i !== index);
    setNewPlaylist({ ...newPlaylist, urls: newUrls });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Playlists</h1>
          <p className="page-description">
            Create playlists to rotate through multiple URLs automatically
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create Playlist
        </button>
      </div>

      <div className="grid grid-2">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="card playlist-card">
            <div className="card-header">
              <h3 className="card-title">{playlist.name}</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleDeletePlaylist(playlist.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="playlist-info">
              <div className="info-item">
                <LinkIcon size={16} />
                <span>{playlist.urls.length} URLs</span>
              </div>
              <div className="info-item">
                <Clock size={16} />
                <span>{playlist.interval}s interval</span>
              </div>
            </div>

            <div className="playlist-urls">
              {playlist.urls.map((url, index) => (
                <div key={index} className="url-item">
                  {index + 1}. {url}
                </div>
              ))}
            </div>

            <div className="playlist-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleStartPlaylist(playlist.id)}
              >
                <Play size={16} />
                Start
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleStopPlaylist(playlist.id)}
              >
                <StopCircle size={16} />
                Stop
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Device Selection */}
      {playlists.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
          <h3>Target Devices</h3>
          <div className="device-checkboxes">
            {devices.map((device) => (
              <label key={device.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedDevices.includes(device.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDevices([...selectedDevices, device.id]);
                    } else {
                      setSelectedDevices(selectedDevices.filter(id => id !== device.id));
                    }
                  }}
                />
                <span>{device.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Playlist</h2>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label>Playlist Name</label>
                <input
                  type="text"
                  placeholder="My Playlist"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Interval (seconds)</label>
                <input
                  type="number"
                  min="5"
                  value={newPlaylist.interval}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, interval: parseInt(e.target.value) })}
                />
              </div>

              <div className="input-group">
                <label>URLs</label>
                {newPlaylist.urls.map((url, index) => (
                  <div key={index} className="url-input-group">
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                    />
                    {newPlaylist.urls.length > 1 && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeUrl(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button className="btn btn-secondary btn-sm" onClick={addUrlField}>
                  <Plus size={16} />
                  Add URL
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreatePlaylist}
                disabled={!newPlaylist.name || newPlaylist.urls.filter(u => u.trim()).length === 0}
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

export default Playlists;
