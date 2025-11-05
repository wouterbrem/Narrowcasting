const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

// Handle Squirrel events on Windows
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let serverProcess;
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'Narrowcast Pro',
    backgroundColor: '#f5f5f7',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, '../build/icon.png'),
    show: false // Don't show until ready
  });

  // Show window when ready to prevent flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the app
  const startURL = isDev
    ? `http://localhost:${PORT}`
    : `http://localhost:${PORT}`;

  // Wait for server to be ready, then load
  waitForServer(startURL).then(() => {
    mainWindow.loadURL(startURL);
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Create application menu
  createMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Narrowcast Pro',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Narrowcast Pro',
              message: 'Narrowcast Pro v2.1.0',
              detail: 'Professional multi-Chromecast narrowcasting system\n\n' +
                      'Features:\n' +
                      '• Multi-device Chromecast control\n' +
                      '• 9 slide types (Web, YouTube, Weather, RSS, etc.)\n' +
                      '• Custom branding with logo and colors\n' +
                      '• Presentation builder\n' +
                      '• Activity logging\n\n' +
                      'Copyright © 2024 Narrowcast Pro'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'View Logs',
          click: () => {
            const logsPath = path.join(app.getPath('userData'), 'logs');
            shell.openPath(logsPath);
          }
        }
      ]
    }
  ];

  // Add Developer menu in development
  if (isDev) {
    template.push({
      label: 'Developer',
      submenu: [
        { role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: 'Restart Server',
          click: () => {
            stopServer();
            setTimeout(startServer, 1000);
          }
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Start the Express server
function startServer() {
  console.log('Starting Narrowcast Pro server...');

  const serverScript = isDev
    ? path.join(__dirname, '../server/index.js')
    : path.join(process.resourcesPath, 'app', 'server', 'index.js');

  // Set environment variables
  const env = {
    ...process.env,
    PORT: PORT.toString(),
    NODE_ENV: isDev ? 'development' : 'production',
    ELECTRON_APP: 'true',
    USER_DATA_PATH: app.getPath('userData')
  };

  serverProcess = spawn('node', [serverScript], {
    env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error] ${data.toString().trim()}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    if (code !== 0 && code !== null) {
      dialog.showErrorBox(
        'Server Error',
        'The Narrowcast Pro server encountered an error and stopped.\n\n' +
        'Please check the logs for more information.'
      );
    }
  });
}

// Stop the Express server
function stopServer() {
  if (serverProcess) {
    console.log('Stopping server...');
    serverProcess.kill();
    serverProcess = null;
  }
}

// Wait for server to be ready
function waitForServer(url, retries = 30) {
  return new Promise((resolve, reject) => {
    const checkServer = (retriesLeft) => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          console.log('Server is ready');
          resolve();
        } else {
          retryCheck(retriesLeft);
        }
      }).on('error', () => {
        retryCheck(retriesLeft);
      });
    };

    const retryCheck = (retriesLeft) => {
      if (retriesLeft > 0) {
        console.log(`Waiting for server... (${retriesLeft} retries left)`);
        setTimeout(() => checkServer(retriesLeft - 1), 1000);
      } else {
        console.error('Server failed to start');
        reject(new Error('Server failed to start'));
      }
    };

    checkServer(retries);
  });
}

// App lifecycle events
app.on('ready', () => {
  // Start server first
  startServer();

  // Create window after a brief delay to let server initialize
  setTimeout(createWindow, 2000);
});

app.on('window-all-closed', () => {
  // On macOS, keep app running when windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, recreate window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopServer();
});

app.on('will-quit', () => {
  stopServer();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  dialog.showErrorBox('Error', 'An unexpected error occurred:\n\n' + error.message);
});
