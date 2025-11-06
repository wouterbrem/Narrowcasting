#!/usr/bin/env node
/**
 * Test Cast Script
 * Cast test-clock.html to Chromecast to isolate WebSocket connection issues
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const bonjour = require('bonjour')();

const PORT = 3002; // Different port from main app
let server = null;

console.log('\n==============================================');
console.log('   TEST CAST - Isolating WebSocket Issue');
console.log('==============================================\n');

// Create simple HTTP server to serve test-clock.html
function startServer() {
  return new Promise((resolve) => {
    server = http.createServer((req, res) => {
      console.log(`[${new Date().toISOString()}] Request: ${req.url}`);

      if (req.url === '/test-clock.html' || req.url === '/') {
        const htmlPath = path.join(__dirname, 'test-clock.html');
        const html = fs.readFileSync(htmlPath, 'utf8');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        console.log('  → Served test-clock.html');
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    server.listen(PORT, () => {
      console.log(`✓ Test server running on port ${PORT}`);
      resolve();
    });
  });
}

// Find Chromecast devices
function findDevices() {
  return new Promise((resolve) => {
    console.log('\nSearching for Chromecast devices...');
    const devices = [];
    const browser = bonjour.find({ type: 'googlecast' });

    browser.on('up', (service) => {
      const device = {
        name: service.txt?.fn || service.name || 'Unknown',
        host: service.referer?.address || service.addresses?.[0] || service.host,
        port: service.port || 8009
      };
      devices.push(device);
      console.log(`  Found: ${device.name} (${device.host})`);
    });

    setTimeout(() => {
      browser.stop();
      resolve(devices);
    }, 3000);
  });
}

// Cast to device
async function castToDevice(device, url) {
  console.log(`\nCasting to ${device.name}...`);

  const client = new Client();

  return new Promise((resolve, reject) => {
    client.connect(device.host, () => {
      console.log('  ✓ Connected to Chromecast');

      client.launch(DefaultMediaReceiver, (err, player) => {
        if (err) {
          console.error('  ✗ Launch error:', err);
          client.close();
          return reject(err);
        }

        console.log('  ✓ DefaultMediaReceiver launched');

        const media = {
          contentId: url,
          contentType: 'text/html',
          streamType: 'LIVE'
        };

        console.log(`  → Loading: ${url}`);

        player.load(media, { autoplay: true }, (err, status) => {
          if (err) {
            console.error('  ✗ Load error:', err);
            client.close();
            return reject(err);
          }

          console.log('  ✓ Media loaded successfully');
          console.log('\n==============================================');
          console.log('   TEST ACTIVE');
          console.log('==============================================');
          console.log('\nCheck your server logs for WebSocket connections:');
          console.log('  - Expected: 0 WebSocket connections');
          console.log('  - This is pure HTML, no WebSocket code');
          console.log('\nPress Ctrl+C to stop\n');

          resolve();
        });
      });
    });

    client.on('error', (err) => {
      console.error('Client error:', err);
      reject(err);
    });
  });
}

// Get local IP
function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// Main
async function main() {
  try {
    // Start server
    await startServer();

    const localIP = getLocalIP();
    const testUrl = `http://${localIP}:${PORT}/test-clock.html`;
    console.log(`  Test URL: ${testUrl}\n`);

    // Find devices
    const devices = await findDevices();

    if (devices.length === 0) {
      console.log('\n✗ No Chromecast devices found');
      console.log('  Make sure your Chromecast is on the same network');
      process.exit(1);
    }

    console.log(`\nFound ${devices.length} device(s)`);

    // Select first device (or let user choose)
    const device = devices[0];
    console.log(`\nUsing: ${device.name}`);

    // Cast
    await castToDevice(device, testUrl);

    // Keep running
    process.on('SIGINT', () => {
      console.log('\n\nStopping test...');
      if (server) server.close();
      bonjour.destroy();
      process.exit(0);
    });

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    if (server) server.close();
    bonjour.destroy();
    process.exit(1);
  }
}

main();
