const EventEmitter = require('events');
const bonjour = require('bonjour')();
const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const { v4: uuidv4 } = require('uuid');

class ChromecastManager extends EventEmitter {
  constructor() {
    super();
    this.devices = new Map();
    this.clients = new Map();
    this.groups = new Map();
    this.playlists = new Map();
    this.playlistTimers = new Map();
    this.browser = null;
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
        console.error('Bonjour Browser error:', error);
      });

      console.log('Chromecast discovery started');
    } catch (error) {
      console.error('Failed to start discovery:', error);
      console.log('Note: Discovery may not work in all network configurations');
    }
  }

  stopDiscovery() {
    if (this.browser) {
      try {
        this.browser.stop();
      } catch (e) {
        console.error('Error stopping browser:', e);
      }
      this.browser = null;
    }

    // Close all client connections
    this.clients.forEach((client) => {
      try {
        client.close();
      } catch (e) {
        console.error('Error closing client:', e);
      }
    });

    this.clients.clear();

    // Destroy bonjour instance
    try {
      bonjour.destroy();
    } catch (e) {
      console.error('Error destroying bonjour:', e);
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
    console.log(`Device found: ${device.name} (${device.host})`);
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
          console.error('Error closing client:', e);
        }
        this.clients.delete(deviceId);
      }

      this.emit('deviceLost', deviceId);
      console.log(`Device lost: ${deviceId}`);
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
        console.error(`Client error for ${deviceId}:`, err);
        this.clients.delete(deviceId);
        reject(err);
      });
    });
  }

  async castToDevices(deviceIds, url, contentType = 'text/html') {
    const results = [];

    for (const deviceId of deviceIds) {
      try {
        const client = await this.getClient(deviceId);

        await new Promise((resolve, reject) => {
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

            player.load(media, { autoplay: true }, (err, status) => {
              if (err) {
                reject(err);
              } else {
                const device = this.devices.get(deviceId);
                device.status = 'playing';
                device.currentUrl = url;
                this.emit('deviceStatus', deviceId, device.status);
                results.push({ deviceId, success: true });
                resolve();
              }
            });
          });
        });
      } catch (error) {
        console.error(`Failed to cast to ${deviceId}:`, error);
        results.push({ deviceId, success: false, error: error.message });
      }
    }

    return results;
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
        console.error(`Failed to stop ${deviceId}:`, error);
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
        console.error(`Failed to set volume for ${deviceId}:`, error);
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
