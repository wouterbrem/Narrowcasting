# Narrowcast Pro

**Professional multi-Chromecast narrowcasting system** with custom branding and advanced content management.

Version 2.1.0 - Now available as a **Mac DMG** and **Windows EXE** installer!

## 🎉 Features

- 🖥️ **Multi-Chromecast Control** - Manage multiple Chromecast devices from one interface
- 📊 **9 Slide Types** - Web pages, YouTube, Weather, RSS feeds, Clock, Images, Social media, News, Custom HTML
- 🎨 **Custom Branding** - Add your logo, custom colors, and text overlays
- 📽️ **Presentation Builder** - Create multi-slide presentations with customizable durations
- 📊 **Activity Logging** - Comprehensive logging for troubleshooting
- 🌐 **Server-side Rendering** - Optimized performance with lightweight client
- 💻 **Desktop App** - Native Mac and Windows applications

## 📥 Installation

> **⚠️ Heb je de source code?** Dan moet je eerst de app **bouwen**!
> 👉 **Zie [BUILD_INSTRUCTIES.md](BUILD_INSTRUCTIES.md)** voor stap-voor-stap build instructies.

### 🍎 Mac - Super Simpel!

```
1️⃣ Download Narrowcast Pro-2.1.0-mac.zip
2️⃣ Unzip (dubbelklik)
3️⃣ Sleep naar Applications folder
4️⃣ Rechtermuisknop → Open
5️⃣ Klaar! 🎉
```

**Eerste keer:** Rechtermuisknop + "Open" (daarna gewone dubbelklik)

### 🪟 Windows - Nog Simpeler!

**Portable (Geen Installatie!):**
```
1️⃣ Download Narrowcast-Pro-2.1.0-Portable.exe
2️⃣ Dubbelklik
3️⃣ Klaar! 🎉
```

**Of met Installer (voor shortcuts):**
```
1️⃣ Download Narrowcast-Pro-Setup-2.1.0.exe
2️⃣ Run installer
3️⃣ Klik door wizard
4️⃣ Klaar! 🎉
```

**📖 Zie [INSTALL.md](INSTALL.md) voor uitgebreide installatie instructies met screenshots en troubleshooting!**

### Build from Source (No Xcode/Visual Studio Required!)

**Prerequisites:** Only Node.js 14+ needed!

```bash
# Clone and install
git clone <repository-url>
cd Narrowcasting
npm install
cd client && npm install && cd ..

# Build React app
cd client && npm run build && cd ..

# Build for your platform (no code signing, no dev tools needed!)
npm run dist:mac    # macOS: ZIP + DMG
npm run dist:win    # Windows: Portable.exe + Setup.exe
npm run dist:all    # Both platforms

# Or run in development
npm run electron:dev
```

**Output:**
- **Mac**: `Narrowcast Pro-2.1.0-mac.zip` (recommended) + DMG
- **Windows**: `Narrowcast-Pro-2.1.0-Portable.exe` (recommended) + Setup.exe

**No code signing?** Apps work perfectly without it! Users may need to:
- **Mac**: Right-click → Open (first time only)
- **Windows**: Click "More info" → "Run anyway" if SmartScreen appears

See [BUILD.md](BUILD.md) for detailed build instructions.

## 🚀 Quick Start Guide

### 1. Launch the App
- Double-click **Narrowcast Pro** from Applications (Mac) or Start Menu (Windows)
- The app opens automatically at `http://localhost:3001`

### 2. Discover Chromecasts
- Chromecasts appear automatically in the **Dashboard**
- Make sure your computer and Chromecasts are on the **same Wi-Fi network**
- Grant network permissions if prompted

### 3. Create Content

#### Create Slides
1. Go to **Slides** page
2. Click **Create Slide**
3. Choose from 9 slide types:
   - **Web Page** - Any website
   - **YouTube** - Videos or live streams
   - **Weather** - Current weather & forecast
   - **RSS Feed** - News or blog feeds
   - **Clock** - Current time & date
   - **Image** - Photos or slideshows
   - **Social Media** - Twitter, Instagram, Facebook
   - **News** - Latest headlines
   - **Custom HTML** - Your own HTML/CSS/JS
4. Fill in the details and click **Create**

#### Build Presentations
1. Go to **Presentations** page
2. Click **Create Presentation**
3. Add slides from your library
4. Reorder with up/down buttons
5. Set duration for each slide
6. Optionally enable custom branding
7. Click **Create Presentation**

### 4. Customize Branding (Optional)
1. Go to **Branding** page
2. **Upload Logo** - PNG, JPG, or SVG (max 5MB)
3. **Set Colors** - 5 brand colors with color pickers
4. **Text Overlay** - Add branded text
5. **Preview** - See how it looks
6. Click **Save Changes**

### 5. Cast to Displays
1. Go to **Dashboard**
2. Select one or more Chromecasts
3. Choose a presentation
4. Click **Cast to Selected Devices**
5. Watch it play on your displays!

## 📺 Slide Types Explained

| Type | Description | Options |
|------|-------------|---------|
| **Web Page** | Display any website | Auto cookie consent |
| **YouTube** | Videos or livestreams | Auto-play, loop |
| **Weather** | Weather forecast | Location, units (C/F) |
| **RSS Feed** | News/blog feeds | Max items, sources |
| **Clock** | Current time & date | 12/24h format |
| **Image** | Photos or slideshow | Fit options, multiple URLs |
| **Social** | Social media feeds | Twitter, Instagram, Facebook |
| **News** | News headlines | Multiple sources |
| **Custom HTML** | Your own content | Full HTML/CSS/JS |

## 🎨 Custom Branding

Make presentations match your brand!

### Logo
- **Upload**: PNG, JPG, SVG (max 5MB)
- **Position**: Top/Bottom Left/Right, Center
- **Size**: Small (80px), Medium (120px), Large (180px)

### Colors
- **Primary** - Main brand color
- **Secondary** - Secondary color
- **Background** - Background color
- **Text** - Text color
- **Accent** - Highlights color

All colors support hex codes and visual color pickers.

### Text Overlay
- Custom text content
- 5 position options
- 3 size options

All branding is applied **automatically** to every presentation!

## 🔧 Troubleshooting

### Chromecasts Not Showing Up?

**Check Network:**
- Are you on the **same Wi-Fi** as your Chromecasts?
- Some corporate networks block device discovery

**Check Permissions:**
- **Mac**: System Preferences → Security & Privacy → Firewall → Allow Narrowcast Pro
- **Windows**: Allow Node.js through Windows Firewall (both Private and Public)

**Try This:**
1. Quit and restart Narrowcast Pro
2. Check the **Logs** page in the app
3. Make sure Chromecasts are powered on and connected

### Slides Not Loading?

1. Go to **Logs** page to see detailed errors
2. Check if URLs are accessible from your network
3. For YouTube: ensure video is embeddable (not age-restricted)

### App Won't Start?

**Mac:**
- Right-click → Open (if "unidentified developer" warning)
- Or: System Preferences → Security & Privacy → Click "Open Anyway"

**Windows:**
- Run as Administrator
- Check Windows Defender didn't block it

### Where Are My Logs?

**In the App:**
- Go to Logs page

**On Disk:**
- **Mac**: `~/Library/Application Support/Narrowcast Pro/logs/`
- **Windows**: `%APPDATA%\Narrowcast Pro\logs\`

## 🛠️ Development

### Prerequisites
- Node.js 14+
- npm 6+

### Development Mode
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Run in development (auto-reload)
npm run electron:dev

# Or run server and client separately
npm run dev
```

### Building Installers
```bash
# Build client first
npm run build

# Build macOS DMG (on Mac only)
npm run dist:mac

# Build Windows EXE (on Windows or with Wine)
npm run dist:win

# Build both (requires both platforms or CI)
npm run dist:all

# Test packaging without installer
npm run pack
```

### Project Structure
```
Narrowcasting/
├── electron/              # Electron main process
│   └── main.js
├── server/                # Express backend
│   ├── index.js
│   ├── chromecast-manager.js
│   ├── slide-manager.js
│   ├── presentation-manager.js
│   ├── branding-manager.js
│   └── logger.js
├── client/                # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── build/
├── build/                 # App icons & resources
├── data/                  # Configuration storage
├── uploads/               # User uploads (logos)
├── logs/                  # Application logs
└── dist/                  # Built installers (.dmg, .exe)
```

## 📦 Tech Stack

- **Desktop**: Electron
- **Frontend**: React, React Router
- **Backend**: Node.js, Express, WebSocket
- **Chromecast**: castv2-client, Bonjour (mDNS)
- **Logging**: Winston
- **File Uploads**: Multer
- **Packaging**: electron-builder

## 🔐 Network & Security

### Required Network Access
- **mDNS/Bonjour**: For Chromecast discovery
- **Local Network**: Communication with Chromecasts
- **HTTP Server**: Port 3001 (localhost only by default)

### Firewall Rules
The app needs to accept incoming connections for Chromecast communication. You'll be prompted to allow this on first launch.

## 📝 License

MIT License

## 🤝 Support

For issues or questions:
1. Check the **Logs** page in the app
2. Review this README
3. Open an issue on GitHub

---

**Narrowcast Pro v2.1.0** - Professional Narrowcasting Made Simple 🎉
