@echo off
REM Narrowcast Pro - Windows Installation Wizard
REM This script will install and configure Narrowcast Pro on Windows

setlocal enabledelayedexpansion

REM Colors for output (Windows 10+)
REM Note: Colors work best in Windows Terminal

echo.
echo ================================================
echo   Narrowcast Pro Installation Wizard
echo ================================================
echo.
echo This wizard will install Narrowcast Pro on your Windows PC.
echo The installation includes:
echo   * Node.js dependency check
echo   * Server and client installation
echo   * Network permissions configuration
echo   * Chromecast device discovery setup
echo.
pause

REM Step 1: Check Node.js
echo.
echo ================================================
echo   Step 1: Checking Node.js Installation
echo ================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo.
    echo Please visit https://nodejs.org to download and install Node.js
    echo After installing Node.js, run this script again
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js is installed: %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm is installed: v%NPM_VERSION%

REM Step 2: Install Server Dependencies
echo.
echo ================================================
echo   Step 2: Installing Server Dependencies
echo ================================================
echo.
echo Installing Node.js packages for the server...
call npm install --production
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install server dependencies
    pause
    exit /b 1
)
echo [OK] Server dependencies installed

REM Step 3: Install Client Dependencies
echo.
echo ================================================
echo   Step 3: Installing Client Dependencies
echo ================================================
echo.
echo Installing Node.js packages for the client...
cd client
call npm install --production
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install client dependencies
    pause
    exit /b 1
)
cd ..
echo [OK] Client dependencies installed

REM Step 4: Network Permissions
echo.
echo ================================================
echo   Step 4: Network Permissions
echo ================================================
echo.
echo Narrowcast Pro needs access to your local network to:
echo   * Discover Chromecast devices on your network
echo   * Communicate with Chromecast devices
echo   * Stream content to your displays
echo.
echo [WARNING] You may see Windows Firewall prompts.
echo [WARNING] Please allow network access for Node.js when prompted.
echo.
pause

REM Step 5: Configuration
echo.
echo ================================================
echo   Step 5: Configuration
echo ================================================
echo.
echo Let's configure your Narrowcast Pro installation.
echo.

set /p SERVER_PORT="Server port (default: 3001): "
if "%SERVER_PORT%"=="" set SERVER_PORT=3001

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env configuration file...
    (
        echo # Narrowcast Pro Server Configuration
        echo PORT=%SERVER_PORT%
        echo NODE_ENV=production
        echo LOG_LEVEL=info
        echo.
        echo # WebSocket Configuration
        echo WS_PORT=%SERVER_PORT%
        echo.
        echo # Client Configuration
        echo CLIENT_PORT=3000
    ) > .env
    echo [OK] .env file created
) else (
    echo [WARNING] .env file already exists, skipping...
)

REM Create directories
if not exist logs mkdir logs
echo [OK] Logs directory created

if not exist uploads\branding mkdir uploads\branding
echo [OK] Uploads directory created

REM Step 6: Build Client
echo.
echo ================================================
echo   Step 6: Building Client Application
echo ================================================
echo.
echo Building optimized production client...
cd client
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build client
    pause
    exit /b 1
)
cd ..
echo [OK] Client built successfully

REM Step 7: Firewall Configuration
echo.
echo ================================================
echo   Step 7: Firewall Configuration
echo ================================================
echo.
echo For Narrowcast Pro to work properly, port %SERVER_PORT% needs to be accessible.
echo.
echo [WARNING] You may need to allow Node.js through Windows Firewall:
echo   1. Open Windows Defender Firewall
echo   2. Click "Allow an app or feature through Windows Defender Firewall"
echo   3. Look for "Node.js" and make sure both Private and Public are checked
echo.
echo If you see a Windows Firewall prompt when starting the server, click "Allow access"
echo.
pause

REM Step 8: Create start scripts
echo.
echo ================================================
echo   Step 8: Creating Start Scripts
echo ================================================
echo.

REM Create start-server.cmd
(
    echo @echo off
    echo echo Starting Narrowcast Pro Server...
    echo node server/index.js
    echo pause
) > start-server.cmd
echo [OK] Created start-server.cmd

REM Create start-all.cmd
(
    echo @echo off
    echo echo Starting Narrowcast Pro ^(Server + Client^)...
    echo echo.
    echo echo Server will start on port %SERVER_PORT%
    echo echo Client will be served from server
    echo echo.
    echo node server/index.js
    echo pause
) > start-all.cmd
echo [OK] Created start-all.cmd

REM Installation complete
echo.
echo ================================================
echo   Installation Complete!
echo ================================================
echo.
echo [OK] Narrowcast Pro has been successfully installed!
echo.
echo To start Narrowcast Pro:
echo   start-all.cmd
echo.
echo The application will be available at:
echo   http://localhost:%SERVER_PORT%
echo.
echo To discover Chromecasts, make sure:
echo   * Your PC and Chromecasts are on the same network
echo   * Windows Firewall allows Node.js to accept connections
echo   * Network access is granted when prompted
echo.
echo Logs will be stored in: .\logs\
echo.
set /p START_NOW="Would you like to start Narrowcast Pro now? (y/n): "
if /i "%START_NOW%"=="y" (
    echo.
    echo Starting Narrowcast Pro...
    call start-all.cmd
) else (
    echo.
    echo You can start Narrowcast Pro anytime by running: start-all.cmd
    pause
)
