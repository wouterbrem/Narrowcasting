const EventEmitter = require('events');
const bonjour = require('bonjour')();
const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

// Custom namespace for Narrowcast Pro receiver
const CUSTOM_NAMESPACE = 'urn:x-cast:com.narrowcastpro.presentation';

class ChromecastManager extends EventEmitter {
  constructor() {
    super();
    this.devices = new Map();
    this.clients = new Map();
    this.groups = new Map();
    this.playlists = new Map();
    this.playlistTimers = new Map();
    this.browser = null;

    // Custom receiver configuration
    // If CHROMECAST_APP_ID is set, use custom receiver
    // Otherwise fall back to DefaultMediaReceiver (which only supports media files)
    this.customAppId = process.env.CHROMECAST_APP_ID || null;
    this.useCustomReceiver = !!this.customAppId;

    if (this.useCustomReceiver) {
      logger.info(`Using custom Chromecast receiver with APP_ID: ${this.customAppId}`);
    } else {
      logger.info('Using DefaultMediaReceiver (only supports media files, not HTML)');
      logger.warn('⚠️  HTML presentations will NOT work with DefaultMediaReceiver');
      logger.warn('⚠️  Set CHROMECAST_APP_ID environment variable to use custom receiver');
    }
  }

  startDiscovery() {
    try {
      // Create Bonjour browser for Chromecast devices
      this.browser = bonjour.find({ type: 'googlecast' });

      this.browser.on('up', (service) => {
        this.addDevice(service);
      });

      this.browser.on('down', (service) => {
        this.removeDevice(service);
      });

      this.browser.on('error', (error) => {
        logger.error('Bonjour Browser error:', error);
      });

      logger.info('Chromecast discovery started');
    } catch (error) {
      logger.error('Failed to start discovery:', error);
      logger.info('Note: Discovery may not work in all network configurations');
    }
  }

  stopDiscovery() {
    if (this.browser) {
      try {
        this.browser.stop();
      } catch (e) {
        logger.error('Error stopping browser:', e);
      }
      this.browser = null;
    }

    // Close all client connections
    this.clients.forEach((client) => {
      try {
        client.close();
      } catch (e) {
        logger.error('Error closing client:', e);
      }
    });

    this.clients.clear();

    // Destroy bonjour instance
    try {
      bonjour.destroy();
    } catch (e) {
      logger.error('Error destroying bonjour:', e);
    }
  }

  addDevice(service) {
    const deviceId = service.name || service.host;
    const device = {
      id: deviceId,
      name: service.txt?.fn || service.name || 'Unknown Chromecast',
      host: service.referer?.address || service.addresses?.[0] || service.host,
      port: service.port || 8009,
      status: 'idle',
      currentUrl: null,
      discoveredAt: new Date().toISOString()
    };

    this.devices.set(deviceId, device);
    this.emit('deviceFound', device);
    logger.info(`Device found: ${device.name} (${device.host})`);
  }

  removeDevice(service) {
    const deviceId = service.name || service.host;

    if (this.devices.has(deviceId)) {
      this.devices.delete(deviceId);

      // Close client connection if exists
      if (this.clients.has(deviceId)) {
        try {
          this.clients.get(deviceId).close();
        } catch (e) {
          logger.error('Error closing client:', e);
        }
        this.clients.delete(deviceId);
      }

      this.emit('deviceLost', deviceId);
      logger.info(`Device lost: ${deviceId}`);
    }
  }

  getDevices() {
    return Array.from(this.devices.values());
  }

  async getClient(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device not found: ${deviceId}`);
    }

    // Return existing client if available
    if (this.clients.has(deviceId)) {
      return this.clients.get(deviceId);
    }

    // Create new client
    const client = new Client();

    return new Promise((resolve, reject) => {
      client.connect(device.host, () => {
        this.clients.set(deviceId, client);
        resolve(client);
      });

      client.on('error', (err) => {
        logger.error(`Client error for ${deviceId}:`, err);
        this.clients.delete(deviceId);
        reject(err);
      });
    });
  }

  async castToDevices(deviceIds, url, contentType = 'text/html') {
    const results = [];

    for (const deviceId of deviceIds) {
      try {
        if (this.useCustomReceiver) {
          // Use custom receiver for HTML presentations
          await this.castToCustomReceiver(deviceId, url);
        } else {
          // Fall back to DefaultMediaReceiver (only works for media files)
          await this.castToDefaultReceiver(deviceId, url, contentType);
        }

        const device = this.devices.get(deviceId);
        device.status = 'playing';
        device.currentUrl = url;
        this.emit('deviceStatus', deviceId, device.status);
        results.push({ deviceId, success: true });
      } catch (error) {
        logger.error(`Failed to cast to ${deviceId}:`, error);
        results.push({ deviceId, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Cast to custom receiver (supports HTML presentations)
   */
  async castToCustomReceiver(deviceId, url) {
    const client = await this.getClient(deviceId);

    return new Promise((resolve, reject) => {
      logger.info(`Launching custom receiver for ${deviceId}...`);

      client.launch(this.customAppId, (err, player) => {
        if (err) {
          logger.error(`Failed to launch custom receiver: ${err.message}`);
          reject(err);
          return;
        }

        logger.info(`Custom receiver launched for ${deviceId}`);

        // Create connection to custom namespace
        const connection = client.createChannel(
          player.session.transportId,
          player.session.sessionId,
          CUSTOM_NAMESPACE,
          'JSON'
        );

        // Send load presentation message
        const message = {
          type: 'LOAD_PRESENTATION',
          url: url,
          timestamp: Date.now()
        };

        logger.info(`Sending LOAD_PRESENTATION to ${deviceId}:`, message);

        connection.send(message);

        // Wait a bit for receiver to process message
        setTimeout(() => {
          logger.info(`Presentation load initiated for ${deviceId}`);
          resolve();
        }, 1000);

        // Listen for errors
        connection.on('error', (error) => {
          logger.error(`Custom receiver connection error for ${deviceId}:`, error);
        });
      });
    });
  }

  /**
   * Cast to DefaultMediaReceiver (only supports media files: video, audio, images)
   */
  async castToDefaultReceiver(deviceId, url, contentType) {
    const client = await this.getClient(deviceId);

    return new Promise((resolve, reject) => {
      logger.info(`Launching DefaultMediaReceiver for ${deviceId}...`);

      client.launch(DefaultMediaReceiver, (err, player) => {
        if (err) {
          reject(err);
          return;
        }

        const media = {
          contentId: url,
          contentType: contentType,
          streamType: 'LIVE'
        };

        logger.info(`Loading media on ${deviceId}:`, media);

        player.load(media, { autoplay: true }, (err, status) => {
          if (err) {
            reject(err);
          } else {
            logger.info(`Media loaded on ${deviceId}`);
            resolve();
          }
        });
      });
    });
  }

  async stopDevices(deviceIds) {
    const results = [];

    for (const deviceId of deviceIds) {
      try {
        const client = await this.getClient(deviceId);

        await new Promise((resolve, reject) => {
          client.stop(null, (err) => {
            if (err) {
              reject(err);
            } else {
              const device = this.devices.get(deviceId);
              device.status = 'idle';
              device.currentUrl = null;
              this.emit('deviceStatus', deviceId, device.status);
              results.push({ deviceId, success: true });
              resolve();
            }
          });
        });
      } catch (error) {
        logger.error(`Failed to stop ${deviceId}:`, error);
        results.push({ deviceId, success: false, error: error.message });
      }
    }

    return results;
  }

  async setVolume(deviceIds, level) {
    const results = [];

    for (const deviceId of deviceIds) {
      try {
        const client = await this.getClient(deviceId);

        await new Promise((resolve, reject) => {
          client.setVolume({ level: level / 100 }, (err) => {
            if (err) {
              reject(err);
            } else {
              results.push({ deviceId, success: true });
              resolve();
            }
          });
        });
      } catch (error) {
        logger.error(`Failed to set volume for ${deviceId}:`, error);
        results.push({ deviceId, success: false, error: error.message });
      }
    }

    return results;
  }

  // Group management
  createGroup(name, deviceIds) {
    const groupId = uuidv4();
    const group = {
      id: groupId,
      name,
      deviceIds,
      createdAt: new Date().toISOString()
    };

    this.groups.set(groupId, group);
    return group;
  }

  getGroups() {
    return Array.from(this.groups.values());
  }

  deleteGroup(groupId) {
    this.groups.delete(groupId);
  }

  // Playlist management
  createPlaylist(name, urls, interval = 30) {
    const playlistId = uuidv4();
    const playlist = {
      id: playlistId,
      name,
      urls,
      interval, // seconds
      createdAt: new Date().toISOString()
    };

    this.playlists.set(playlistId, playlist);
    return playlist;
  }

  getPlaylists() {
    return Array.from(this.playlists.values());
  }

  deletePlaylist(playlistId) {
    this.stopPlaylist(playlistId, []);
    this.playlists.delete(playlistId);
  }

  async startPlaylist(playlistId, deviceIds) {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) {
      throw new Error(`Playlist not found: ${playlistId}`);
    }

    // Stop any existing playlist timers for these devices
    deviceIds.forEach(deviceId => {
      const timerKey = `${playlistId}-${deviceId}`;
      if (this.playlistTimers.has(timerKey)) {
        clearInterval(this.playlistTimers.get(timerKey));
      }
    });

    let currentIndex = 0;

    // Function to cast next URL
    const castNext = async () => {
      const url = playlist.urls[currentIndex];
      await this.castToDevices(deviceIds, url);
      currentIndex = (currentIndex + 1) % playlist.urls.length;
    };

    // Cast first URL immediately
    await castNext();

    // Set up interval for rotation
    deviceIds.forEach(deviceId => {
      const timerKey = `${playlistId}-${deviceId}`;
      const timer = setInterval(castNext, playlist.interval * 1000);
      this.playlistTimers.set(timerKey, timer);
    });
  }

  async stopPlaylist(playlistId, deviceIds) {
    deviceIds.forEach(deviceId => {
      const timerKey = `${playlistId}-${deviceId}`;
      if (this.playlistTimers.has(timerKey)) {
        clearInterval(this.playlistTimers.get(timerKey));
        this.playlistTimers.delete(timerKey);
      }
    });

    // Optionally stop the devices
    await this.stopDevices(deviceIds);
  }
}

module.exports = ChromecastManager;
