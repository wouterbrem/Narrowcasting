const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const logger = require('./logger');
const ChromecastManager = require('./chromecast-manager');
const ScheduleManager = require('./schedule-manager');
const SlideManager = require('./slide-manager');
const PresentationManager = require('./presentation-manager');
const brandingManager = require('./branding-manager');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for HTML content

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`
    };

    if (res.statusCode >= 400) {
      logger.warn(`${req.method} ${req.path} - ${res.statusCode}`, logData);
    } else {
      logger.debug(`${req.method} ${req.path} - ${res.statusCode}`, logData);
    }
  });
  next();
});

// Serve uploaded files (branding assets)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Configure multer for file uploads
const upload = multer({
  dest: path.join(__dirname, '../uploads/temp'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Initialize managers
const chromecastManager = new ChromecastManager();
const slideManager = new SlideManager();
const presentationManager = new PresentationManager(slideManager);
const scheduleManager = new ScheduleManager(chromecastManager);

// WebSocket connection handling
wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');
  logger.activity('WS_CLIENT_CONNECTED', { clients: wss.clients.size });

  // Send current state on connection
  ws.send(JSON.stringify({
    type: 'initial-state',
    devices: chromecastManager.getDevices(),
    slides: slideManager.getAllSlides(),
    presentations: presentationManager.getAllPresentations(),
    statistics: presentationManager.getStatistics()
  }));

  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
    logger.activity('WS_CLIENT_DISCONNECTED', { clients: wss.clients.size - 1 });
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
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
  logger.deviceEvent('found', device.id, { name: device.name, host: device.host });
  logger.activity('DEVICE_DISCOVERED', { deviceId: device.id, name: device.name, host: device.host });
  broadcast({ type: 'deviceFound', device });
});

chromecastManager.on('deviceLost', (deviceId) => {
  logger.deviceEvent('lost', deviceId);
  logger.activity('DEVICE_LOST', { deviceId });
  broadcast({ type: 'deviceLost', deviceId });
});

chromecastManager.on('deviceStatus', (deviceId, status) => {
  logger.deviceEvent('status_change', deviceId, { status });
  broadcast({ type: 'deviceStatus', deviceId, status });
});

// ========================================
// DEVICE ENDPOINTS
// ========================================

// Get all discovered devices
app.get('/api/devices', (req, res) => {
  res.json(chromecastManager.getDevices());
});

// Cast URL to device(s) - Legacy endpoint, still supported
app.post('/api/cast', async (req, res) => {
  try {
    const { deviceIds, url, contentType = 'text/html' } = req.body;

    if (!deviceIds || !url) {
      return res.status(400).json({ error: 'deviceIds and url are required' });
    }

    const results = await chromecastManager.castToDevices(deviceIds, url, contentType);
    res.json({ success: true, results });
  } catch (error) {
    logger.error('Cast error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop casting on device(s)
app.post('/api/devices/stop', async (req, res) => {
  try {
    const { deviceIds } = req.body;

    if (!deviceIds) {
      return res.status(400).json({ error: 'deviceIds is required' });
    }

    const results = await chromecastManager.stopDevices(deviceIds);
    res.json({ success: true, results });
  } catch (error) {
    logger.error('Stop error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Control volume
app.post('/api/devices/volume', async (req, res) => {
  try {
    const { deviceIds, level } = req.body;

    if (!deviceIds || level === undefined) {
      return res.status(400).json({ error: 'deviceIds and level are required' });
    }

    const results = await chromecastManager.setVolume(deviceIds, level);
    res.json({ success: true, results });
  } catch (error) {
    logger.error('Volume error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// SLIDE ENDPOINTS
// ========================================

// Get all slides (with optional pagination)
app.get('/api/slides', (req, res) => {
  const type = req.query.type;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 0; // 0 = no limit (backward compatible)
  const search = req.query.search || '';

  let slides = type ?
    slideManager.getSlidesByType(type) :
    slideManager.getAllSlides();

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase();
    slides = slides.filter(slide =>
      slide.name.toLowerCase().includes(searchLower) ||
      (slide.description && slide.description.toLowerCase().includes(searchLower))
    );
  }

  // If no limit specified, return all slides (backward compatible)
  if (limit === 0) {
    return res.json(slides);
  }

  // Apply pagination
  const totalSlides = slides.length;
  const totalPages = Math.ceil(totalSlides / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedSlides = slides.slice(startIndex, endIndex);

  res.json({
    data: paginatedSlides,
    pagination: {
      page,
      limit,
      totalPages,
      totalItems: totalSlides,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// Get single slide
app.get('/api/slides/:id', (req, res) => {
  const slide = slideManager.getSlide(req.params.id);
  if (!slide) {
    return res.status(404).json({ error: 'Slide not found' });
  }
  res.json(slide);
});

// Create slide
app.post('/api/slides', (req, res) => {
  try {
    const slide = slideManager.createSlide(req.body);
    broadcast({ type: 'slideCreated', slide });
    res.json({ success: true, slide });
  } catch (error) {
    logger.error('Slide creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update slide
app.put('/api/slides/:id', (req, res) => {
  try {
    const slide = slideManager.updateSlide(req.params.id, req.body);
    broadcast({ type: 'slideUpdated', slide });
    res.json({ success: true, slide });
  } catch (error) {
    logger.error('Slide update error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete slide
app.delete('/api/slides/:id', (req, res) => {
  try {
    const success = slideManager.deleteSlide(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Slide not found' });
    }
    broadcast({ type: 'slideDeleted', slideId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    logger.error('Slide deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Preview slide (returns HTML)
app.get('/api/slides/:id/preview', (req, res) => {
  try {
    let branding = {};

    // Safely parse and validate branding JSON
    if (req.query.branding) {
      try {
        const parsed = JSON.parse(req.query.branding);
        // Validate it's an object and not null
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          branding = parsed;
        } else {
          logger.warn('Invalid branding format received, using defaults');
        }
      } catch (parseError) {
        logger.warn('Failed to parse branding JSON:', parseError.message);
        // Continue with empty branding object
      }
    }

    const html = slideManager.generateSlideHtml(req.params.id, branding);
    res.type('html').send(html);
  } catch (error) {
    logger.error('Slide preview error:', error);
    res.status(400).send(`<html><body><h1>Error:</h1><p>${error.message}</p></body></html>`);
  }
});

// ========================================
// PRESENTATION ENDPOINTS
// ========================================

// Get all presentations (with optional pagination)
app.get('/api/presentations', (req, res) => {
  const withSlides = req.query.withSlides === 'true';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 0; // 0 = no limit (backward compatible)
  const search = req.query.search || '';

  let presentations = withSlides ?
    presentationManager.getAllPresentations()
      .map(p => presentationManager.getPresentationWithSlides(p.id)) :
    presentationManager.getAllPresentations();

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase();
    presentations = presentations.filter(presentation =>
      presentation.name.toLowerCase().includes(searchLower) ||
      (presentation.description && presentation.description.toLowerCase().includes(searchLower))
    );
  }

  // If no limit specified, return all presentations (backward compatible)
  if (limit === 0) {
    return res.json(presentations);
  }

  // Apply pagination
  const totalPresentations = presentations.length;
  const totalPages = Math.ceil(totalPresentations / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPresentations = presentations.slice(startIndex, endIndex);

  res.json({
    data: paginatedPresentations,
    pagination: {
      page,
      limit,
      totalPages,
      totalItems: totalPresentations,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// Get single presentation
app.get('/api/presentations/:id', (req, res) => {
  const withSlides = req.query.withSlides === 'true';
  const presentation = withSlides ?
    presentationManager.getPresentationWithSlides(req.params.id) :
    presentationManager.getPresentation(req.params.id);

  if (!presentation) {
    return res.status(404).json({ error: 'Presentation not found' });
  }
  res.json(presentation);
});

// Create presentation
app.post('/api/presentations', (req, res) => {
  try {
    const presentation = presentationManager.createPresentation(req.body);
    broadcast({ type: 'presentationCreated', presentation });
    res.json({ success: true, presentation });
  } catch (error) {
    logger.error('Presentation creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update presentation
app.put('/api/presentations/:id', (req, res) => {
  try {
    const presentation = presentationManager.updatePresentation(req.params.id, req.body);
    broadcast({ type: 'presentationUpdated', presentation });
    res.json({ success: true, presentation });
  } catch (error) {
    logger.error('Presentation update error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete presentation
app.delete('/api/presentations/:id', (req, res) => {
  try {
    const success = presentationManager.deletePresentation(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    broadcast({ type: 'presentationDeleted', presentationId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    logger.error('Presentation deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get presentation player HTML
app.get('/api/presentations/:id/player', (req, res) => {
  try {
    const html = presentationManager.generatePresentationPlayerHtml(req.params.id);
    res.type('html').send(html);
  } catch (error) {
    logger.error('Presentation player error:', error);
    res.status(400).send(`<html><body><h1>Error:</h1><p>${error.message}</p></body></html>`);
  }
});

// Cast presentation to device(s)
app.post('/api/presentations/:id/cast', async (req, res) => {
  try {
    const { deviceIds } = req.body;
    const presentationId = req.params.id;

    if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
      return res.status(400).json({ error: 'deviceIds array is required' });
    }

    // Generate player URL
    const baseUrl = `http://${req.hostname}:${PORT}`;
    const playerUrl = `${baseUrl}/api/presentations/${presentationId}/player`;

    // Cast to devices
    const results = await chromecastManager.castToDevices(deviceIds, playerUrl, 'text/html');

    // Track active presentations
    deviceIds.forEach(deviceId => {
      presentationManager.startPresentation(presentationId, deviceId);
    });

    broadcast({
      type: 'presentationStarted',
      presentationId,
      deviceIds
    });

    res.json({ success: true, results, playerUrl });
  } catch (error) {
    logger.error('Presentation cast error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop presentation on device(s)
app.post('/api/presentations/stop', async (req, res) => {
  try {
    const { deviceIds } = req.body;

    if (!deviceIds) {
      return res.status(400).json({ error: 'deviceIds is required' });
    }

    const results = await chromecastManager.stopDevices(deviceIds);

    // Stop tracking
    deviceIds.forEach(deviceId => {
      presentationManager.stopPresentation(deviceId);
    });

    broadcast({
      type: 'presentationStopped',
      deviceIds
    });

    res.json({ success: true, results });
  } catch (error) {
    logger.error('Presentation stop error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get presentation statistics
app.get('/api/presentations/statistics', (req, res) => {
  res.json(presentationManager.getStatistics());
});

// ========================================
// GROUP ENDPOINTS
// ========================================

// Create or update a group
app.post('/api/groups', (req, res) => {
  try {
    const { name, deviceIds } = req.body;

    if (!name || !deviceIds) {
      return res.status(400).json({ error: 'name and deviceIds are required' });
    }

    const group = chromecastManager.createGroup(name, deviceIds);
    broadcast({ type: 'groupCreated', group });
    res.json({ success: true, group });
  } catch (error) {
    logger.error('Group creation error:', error);
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
    broadcast({ type: 'groupDeleted', groupId: req.params.groupId });
    res.json({ success: true });
  } catch (error) {
    logger.error('Group deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// PLAYLIST ENDPOINTS (Legacy, may be deprecated)
// ========================================

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
    logger.error('Playlist creation error:', error);
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
    logger.error('Playlist deletion error:', error);
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
    logger.error('Playlist start error:', error);
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
    logger.error('Playlist stop error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// SCHEDULE ENDPOINTS
// ========================================

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
    logger.error('Schedule creation error:', error);
    res.status(400).json({ error: error.message });
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
    logger.error('Schedule deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// BRANDING ENDPOINTS
// ========================================

// Get branding configuration
app.get('/api/branding', (req, res) => {
  try {
    const branding = brandingManager.getBranding();
    res.json(branding);
  } catch (error) {
    logger.apiError('GET', '/api/branding', error);
    res.status(500).json({ error: 'Failed to get branding configuration' });
  }
});

// Update branding configuration
app.put('/api/branding', async (req, res) => {
  try {
    const updates = req.body;
    const branding = await brandingManager.updateBranding(updates);

    logger.activity('BRANDING_UPDATED', { updates: Object.keys(updates) });
    broadcast({ type: 'brandingUpdated', branding });

    res.json({ success: true, branding });
  } catch (error) {
    logger.apiError('PUT', '/api/branding', error);
    res.status(500).json({ error: 'Failed to update branding configuration' });
  }
});

// Upload branding logo
app.post('/api/branding/logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const logoUrl = await brandingManager.uploadLogo(req.file);

    logger.activity('BRANDING_LOGO_UPLOADED', { logoUrl });
    broadcast({ type: 'brandingUpdated', branding: brandingManager.getBranding() });

    res.json({ success: true, logoUrl });
  } catch (error) {
    logger.apiError('POST', '/api/branding/logo', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

// Delete branding logo
app.delete('/api/branding/logo', async (req, res) => {
  try {
    await brandingManager.deleteLogo();

    logger.activity('BRANDING_LOGO_DELETED');
    broadcast({ type: 'brandingUpdated', branding: brandingManager.getBranding() });

    res.json({ success: true });
  } catch (error) {
    logger.apiError('DELETE', '/api/branding/logo', error);
    res.status(500).json({ error: 'Failed to delete logo' });
  }
});

// Reset branding to default
app.post('/api/branding/reset', async (req, res) => {
  try {
    const branding = await brandingManager.resetToDefault();

    logger.activity('BRANDING_RESET_TO_DEFAULT');
    broadcast({ type: 'brandingUpdated', branding });

    res.json({ success: true, branding });
  } catch (error) {
    logger.apiError('POST', '/api/branding/reset', error);
    res.status(500).json({ error: 'Failed to reset branding' });
  }
});

// ========================================
// SYSTEM ENDPOINTS
// ========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    devices: chromecastManager.getDevices().length,
    slides: slideManager.getAllSlides().length,
    presentations: presentationManager.getAllPresentations().length
  });
});

// System statistics
app.get('/api/statistics', (req, res) => {
  res.json({
    devices: {
      total: chromecastManager.getDevices().length,
      playing: chromecastManager.getDevices().filter(d => d.status === 'playing').length,
      idle: chromecastManager.getDevices().filter(d => d.status === 'idle').length
    },
    slides: {
      total: slideManager.getAllSlides().length,
      byType: {
        webpage: slideManager.getSlidesByType('webpage').length,
        youtube: slideManager.getSlidesByType('youtube').length,
        weather: slideManager.getSlidesByType('weather').length,
        rss: slideManager.getSlidesByType('rss').length,
        clock: slideManager.getSlidesByType('clock').length,
        image: slideManager.getSlidesByType('image').length,
        html: slideManager.getSlidesByType('html').length
      }
    },
    presentations: presentationManager.getStatistics(),
    groups: chromecastManager.getGroups().length
  });
});

// Get recent logs
app.get('/api/logs', (req, res) => {
  try {
    const logsDir = path.join(__dirname, '../logs');
    const logType = req.query.type || 'combined'; // combined, error, activity
    const lines = parseInt(req.query.lines) || 100;

    const logFile = path.join(logsDir, `${logType}.log`);

    if (!fs.existsSync(logFile)) {
      return res.json({ logs: [], message: 'No logs available yet' });
    }

    // Read log file
    const content = fs.readFileSync(logFile, 'utf8');
    const allLines = content.split('\n').filter(line => line.trim());

    // Get last N lines
    const recentLogs = allLines.slice(-lines).reverse();

    res.json({
      logs: recentLogs,
      total: allLines.length,
      returned: recentLogs.length,
      logType
    });
  } catch (error) {
    logger.error('Failed to read logs:', error);
    res.status(500).json({ error: 'Failed to read logs' });
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
  logger.info(`Server running on port ${PORT}`);
  logger.info('Starting Chromecast discovery...');
  logger.activity('SERVER_STARTED', { port: PORT, environment: process.env.NODE_ENV || 'development' });
  chromecastManager.startDiscovery();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.warn('SIGTERM received, shutting down gracefully...');
  logger.activity('SERVER_STOPPING', { reason: 'SIGTERM' });
  chromecastManager.stopDiscovery();
  scheduleManager.stopAll();
  server.close(() => {
    logger.info('Server closed');
    logger.activity('SERVER_STOPPED');
    process.exit(0);
  });
});
