const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const ChromecastManager = require('./chromecast-manager');
const ScheduleManager = require('./schedule-manager');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Initialize managers
const chromecastManager = new ChromecastManager();
const scheduleManager = new ScheduleManager(chromecastManager);

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send current devices on connection
  ws.send(JSON.stringify({
    type: 'devices',
    devices: chromecastManager.getDevices()
  }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast updates to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Listen for device updates
chromecastManager.on('deviceFound', (device) => {
  broadcast({ type: 'deviceFound', device });
});

chromecastManager.on('deviceLost', (deviceId) => {
  broadcast({ type: 'deviceLost', deviceId });
});

chromecastManager.on('deviceStatus', (deviceId, status) => {
  broadcast({ type: 'deviceStatus', deviceId, status });
});

// REST API Endpoints

// Get all discovered devices
app.get('/api/devices', (req, res) => {
  res.json(chromecastManager.getDevices());
});

// Cast URL to device(s)
app.post('/api/cast', async (req, res) => {
  try {
    const { deviceIds, url, contentType = 'text/html' } = req.body;

    if (!deviceIds || !url) {
      return res.status(400).json({ error: 'deviceIds and url are required' });
    }

    const results = await chromecastManager.castToDevices(deviceIds, url, contentType);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Cast error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop casting on device(s)
app.post('/api/stop', async (req, res) => {
  try {
    const { deviceIds } = req.body;

    if (!deviceIds) {
      return res.status(400).json({ error: 'deviceIds is required' });
    }

    const results = await chromecastManager.stopDevices(deviceIds);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Stop error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Control volume
app.post('/api/volume', async (req, res) => {
  try {
    const { deviceIds, level } = req.body;

    if (!deviceIds || level === undefined) {
      return res.status(400).json({ error: 'deviceIds and level are required' });
    }

    const results = await chromecastManager.setVolume(deviceIds, level);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Volume error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create or update a group
app.post('/api/groups', (req, res) => {
  try {
    const { name, deviceIds } = req.body;

    if (!name || !deviceIds) {
      return res.status(400).json({ error: 'name and deviceIds are required' });
    }

    const group = chromecastManager.createGroup(name, deviceIds);
    res.json({ success: true, group });
  } catch (error) {
    console.error('Group creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all groups
app.get('/api/groups', (req, res) => {
  res.json(chromecastManager.getGroups());
});

// Delete a group
app.delete('/api/groups/:groupId', (req, res) => {
  try {
    chromecastManager.deleteGroup(req.params.groupId);
    res.json({ success: true });
  } catch (error) {
    console.error('Group deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create or update a playlist
app.post('/api/playlists', (req, res) => {
  try {
    const { name, urls, interval = 30 } = req.body;

    if (!name || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'name and urls array are required' });
    }

    const playlist = chromecastManager.createPlaylist(name, urls, interval);
    res.json({ success: true, playlist });
  } catch (error) {
    console.error('Playlist creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all playlists
app.get('/api/playlists', (req, res) => {
  res.json(chromecastManager.getPlaylists());
});

// Delete a playlist
app.delete('/api/playlists/:playlistId', (req, res) => {
  try {
    chromecastManager.deletePlaylist(req.params.playlistId);
    res.json({ success: true });
  } catch (error) {
    console.error('Playlist deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start playlist on device(s)
app.post('/api/playlists/:playlistId/start', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { deviceIds } = req.body;

    if (!deviceIds) {
      return res.status(400).json({ error: 'deviceIds is required' });
    }

    await chromecastManager.startPlaylist(playlistId, deviceIds);
    res.json({ success: true });
  } catch (error) {
    console.error('Playlist start error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop playlist on device(s)
app.post('/api/playlists/:playlistId/stop', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { deviceIds } = req.body;

    if (!deviceIds) {
      return res.status(400).json({ error: 'deviceIds is required' });
    }

    await chromecastManager.stopPlaylist(playlistId, deviceIds);
    res.json({ success: true });
  } catch (error) {
    console.error('Playlist stop error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create schedule
app.post('/api/schedules', (req, res) => {
  try {
    const { name, deviceIds, url, cronExpression, duration } = req.body;

    if (!name || !deviceIds || !url || !cronExpression) {
      return res.status(400).json({ error: 'name, deviceIds, url, and cronExpression are required' });
    }

    const schedule = scheduleManager.createSchedule(name, deviceIds, url, cronExpression, duration);
    res.json({ success: true, schedule });
  } catch (error) {
    console.error('Schedule creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all schedules
app.get('/api/schedules', (req, res) => {
  res.json(scheduleManager.getSchedules());
});

// Delete schedule
app.delete('/api/schedules/:scheduleId', (req, res) => {
  try {
    scheduleManager.deleteSchedule(req.params.scheduleId);
    res.json({ success: true });
  } catch (error) {
    console.error('Schedule deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Starting Chromecast discovery...');
  chromecastManager.startDiscovery();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  chromecastManager.stopDiscovery();
  scheduleManager.stopAll();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
