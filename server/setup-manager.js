const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const logger = require('./logger');

/**
 * Setup Manager
 * Handles Chromecast receiver setup and configuration
 */
class SetupManager {
  constructor() {
    this.envPath = path.join(__dirname, '../.env');
    this.envExamplePath = path.join(__dirname, '../.env.example');
  }

  /**
   * Get server network information
   */
  getServerInfo(port = 3001) {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    // Find all non-internal IPv4 addresses
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          addresses.push({
            interface: name,
            address: iface.address,
            primary: false
          });
        }
      }
    }

    // Mark the first address as primary
    if (addresses.length > 0) {
      addresses[0].primary = true;
    }

    const primaryAddress = addresses.length > 0 ? addresses[0].address : 'localhost';

    return {
      hostname: os.hostname(),
      port: port,
      addresses: addresses,
      primaryAddress: primaryAddress,
      receiverUrl: `http://${primaryAddress}:${port}/receiver/receiver.html`,
      receiverUrlHttps: `https://${primaryAddress}:${port}/receiver/receiver.html`,
      playerExampleUrl: `http://${primaryAddress}:${port}/api/presentations/example/player`
    };
  }

  /**
   * Check current setup status
   */
  getSetupStatus() {
    const status = {
      envFileExists: false,
      envExampleExists: false,
      appIdConfigured: false,
      appId: null,
      receiverFileExists: false,
      setupComplete: false,
      warnings: [],
      errors: []
    };

    // Check if .env.example exists
    status.envExampleExists = fs.existsSync(this.envExamplePath);

    // Check if .env exists
    status.envFileExists = fs.existsSync(this.envPath);

    // Check if receiver.html exists
    const receiverPath = path.join(__dirname, 'public/receiver.html');
    status.receiverFileExists = fs.existsSync(receiverPath);

    if (!status.receiverFileExists) {
      status.errors.push('Receiver file not found at server/public/receiver.html');
    }

    // Check if APP_ID is configured
    if (process.env.CHROMECAST_APP_ID) {
      status.appIdConfigured = true;
      status.appId = process.env.CHROMECAST_APP_ID;
    } else {
      status.warnings.push('CHROMECAST_APP_ID not configured - HTML presentations will not work');
    }

    // Check if SERVER_HOST is configured
    if (process.env.SERVER_HOST) {
      status.serverHostConfigured = true;
      status.serverHost = process.env.SERVER_HOST;
    }

    // Determine if setup is complete
    status.setupComplete = status.receiverFileExists && status.appIdConfigured;

    return status;
  }

  /**
   * Read current .env file content
   */
  readEnvFile() {
    if (!fs.existsSync(this.envPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(this.envPath, 'utf8');
      const parsed = {};

      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            parsed[key.trim()] = valueParts.join('=').trim();
          }
        }
      });

      return {
        raw: content,
        parsed: parsed
      };
    } catch (error) {
      logger.error('Error reading .env file:', error);
      return null;
    }
  }

  /**
   * Write or update .env file
   */
  writeEnvFile(updates) {
    try {
      let content = '';

      // If .env exists, read and update it
      if (fs.existsSync(this.envPath)) {
        content = fs.readFileSync(this.envPath, 'utf8');

        // Update existing values
        Object.keys(updates).forEach(key => {
          const regex = new RegExp(`^${key}=.*$`, 'm');
          const newLine = `${key}=${updates[key]}`;

          if (regex.test(content)) {
            content = content.replace(regex, newLine);
          } else {
            // Add new key if it doesn't exist
            content += `\n${newLine}`;
          }
        });
      } else {
        // Create new .env file from example or from scratch
        if (fs.existsSync(this.envExamplePath)) {
          content = fs.readFileSync(this.envExamplePath, 'utf8');
        } else {
          content = '# Narrowcast Pro Environment Configuration\n\n';
        }

        // Add updates
        Object.keys(updates).forEach(key => {
          const regex = new RegExp(`^#?\\s*${key}=.*$`, 'm');
          const newLine = `${key}=${updates[key]}`;

          if (regex.test(content)) {
            content = content.replace(regex, newLine);
          } else {
            content += `\n${newLine}`;
          }
        });
      }

      // Write file
      fs.writeFileSync(this.envPath, content, 'utf8');

      logger.info('Environment file updated successfully');

      return {
        success: true,
        message: 'Environment file updated. Please restart the application for changes to take effect.'
      };
    } catch (error) {
      logger.error('Error writing .env file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save Chromecast APP_ID to .env
   */
  saveAppId(appId) {
    if (!appId || typeof appId !== 'string') {
      return {
        success: false,
        error: 'Invalid APP_ID provided'
      };
    }

    // Validate APP_ID format (8 characters, alphanumeric)
    if (!/^[A-Z0-9]{8}$/.test(appId)) {
      return {
        success: false,
        error: 'Invalid APP_ID format. Expected 8 alphanumeric characters (e.g., 12345678 or ABCD1234)'
      };
    }

    return this.writeEnvFile({
      CHROMECAST_APP_ID: appId
    });
  }

  /**
   * Test if receiver URL is accessible
   */
  async testReceiverUrl(url) {
    return new Promise((resolve) => {
      const protocol = url.startsWith('https') ? https : http;

      const timeout = setTimeout(() => {
        resolve({
          accessible: false,
          error: 'Timeout - receiver not responding after 5 seconds'
        });
      }, 5000);

      try {
        const req = protocol.get(url, (res) => {
          clearTimeout(timeout);

          resolve({
            accessible: res.statusCode === 200,
            statusCode: res.statusCode,
            error: res.statusCode !== 200 ? `HTTP ${res.statusCode}` : null
          });
        });

        req.on('error', (error) => {
          clearTimeout(timeout);
          resolve({
            accessible: false,
            error: error.message
          });
        });

        req.setTimeout(5000, () => {
          req.destroy();
          clearTimeout(timeout);
          resolve({
            accessible: false,
            error: 'Request timeout'
          });
        });
      } catch (error) {
        clearTimeout(timeout);
        resolve({
          accessible: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Run comprehensive setup check
   */
  async runSetupCheck() {
    const status = this.getSetupStatus();
    const serverInfo = this.getServerInfo(process.env.PORT || 3001);

    // Test receiver accessibility
    const receiverTest = await this.testReceiverUrl(serverInfo.receiverUrl);

    return {
      status: status,
      serverInfo: serverInfo,
      receiverTest: receiverTest,
      recommendations: this.generateRecommendations(status, receiverTest)
    };
  }

  /**
   * Generate setup recommendations
   */
  generateRecommendations(status, receiverTest) {
    const recommendations = [];

    if (!status.envFileExists) {
      recommendations.push({
        priority: 'high',
        title: 'Create .env file',
        description: 'Configuration file is missing',
        action: 'create_env'
      });
    }

    if (!status.appIdConfigured) {
      recommendations.push({
        priority: 'critical',
        title: 'Configure Chromecast APP_ID',
        description: 'HTML presentations will not work without a custom receiver APP_ID',
        action: 'configure_app_id'
      });
    }

    if (!receiverTest.accessible) {
      recommendations.push({
        priority: 'high',
        title: 'Receiver not accessible',
        description: `Cannot reach receiver at configured URL. ${receiverTest.error}`,
        action: 'check_network'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'success',
        title: 'Setup complete!',
        description: 'All configuration checks passed',
        action: 'none'
      });
    }

    return recommendations;
  }

  /**
   * Get setup instructions for Google Cast registration
   */
  getRegistrationInstructions() {
    return {
      steps: [
        {
          number: 1,
          title: 'Register as Cast Developer',
          description: 'Go to Google Cast SDK Developer Console and pay the $5 one-time registration fee',
          url: 'https://cast.google.com/publish',
          action: 'open_url'
        },
        {
          number: 2,
          title: 'Create New Application',
          description: 'Click "Add New Application" and select "Custom Receiver"',
          action: 'info'
        },
        {
          number: 3,
          title: 'Configure Receiver',
          description: 'Enter application details and your receiver URL',
          action: 'copy_receiver_url'
        },
        {
          number: 4,
          title: 'Get APP_ID',
          description: 'After saving, copy your Application ID (8 characters)',
          action: 'info'
        },
        {
          number: 5,
          title: 'Save APP_ID',
          description: 'Enter your APP_ID in Narrowcast Pro',
          action: 'input_app_id'
        },
        {
          number: 6,
          title: 'Register Test Device (Development)',
          description: 'Register your Chromecast serial number for testing (takes ~15 minutes to activate)',
          url: 'https://cast.google.com/publish/#/devices',
          action: 'optional'
        }
      ],
      estimatedTime: '15-30 minutes',
      cost: '$5 USD (one-time)',
      documentation: '/CHROMECAST_SETUP.md'
    };
  }
}

module.exports = SetupManager;
