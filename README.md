# Narrowcast Pro

**Professional multi-Chromecast narrowcasting system** with custom branding and advanced content management.

Version 2.1.0 - Now available as a **Mac DMG** and **Windows EXE** installer!

---

## 🤔 What is Narrowcast Pro?

Narrowcast Pro is a **desktop app that lets you control multiple Chromecast devices** from your computer.

**Think of it like PowerPoint for TVs!**

Create content (web pages, weather, news, videos, custom slides) and display it on any TV with a Chromecast. Perfect for:

- 🏢 **Offices** - Company news and announcements
- 🏪 **Retail** - Promotions and product information
- 🏫 **Schools** - Schedules and announcements
- 🏥 **Healthcare** - Wait times and health information
- 🏨 **Hotels** - Local information and events
- 🍽️ **Restaurants** - Menus and specials
- 🏋️ **Gyms** - Class schedules and motivation
- 🎪 **Events** - Information displays and signage

**No technical knowledge required!** Just download, install, and start casting.

---

## 🎉 Features

- 🖥️ **Multi-Chromecast Control** - Manage multiple Chromecast devices from one interface
- 📊 **9 Slide Types** - Web pages, YouTube, Weather, RSS feeds, Clock, Images, Social media, News, Custom HTML
- 🎨 **Custom Branding** - Add your logo, custom colors, and text overlays
- 📽️ **Presentation Builder** - Create multi-slide presentations with customizable durations
- 📊 **Activity Logging** - Comprehensive logging for troubleshooting
- 🌐 **Server-side Rendering** - Optimized performance with lightweight client
- 💻 **Desktop App** - Native Mac and Windows applications

## 📥 Installation

> **⚠️ IMPORTANT: First Release Coming Soon!**
>
> The [Releases page](../../releases) is currently empty. The first official release hasn't been created yet.
>
> **Your options:**
> - **Wait for the release** (recommended for non-technical users)
> - **Build from source** (available now - see Option 2 below)
>
> **To create the first release:**
> ```bash
> git tag v2.1.0 && git push origin v2.1.0
> ```
> GitHub Actions will automatically build installers (~15 minutes)!

---

### Option 1: Download Pre-Built Installers (Coming Soon! 🎁)

**Once released, installation will be super simple:**

1. Go to **[Releases](../../releases/latest)** page
2. Download the installer for your platform:
   - **Mac**: `Narrowcast-Pro-2.1.0.dmg` (120MB)
   - **Windows**: `Narrowcast-Pro-Setup-2.1.0.exe` (100MB)
3. Install and run - that's it!

**No Node.js, no npm, no terminal commands needed!**

**Mac Installation:**
```
1️⃣ Download .dmg file from Releases
2️⃣ Open the DMG
3️⃣ Drag Narrowcast Pro to Applications folder
4️⃣ Launch from Applications
5️⃣ Done! 🎉
```

**Windows Installation:**
```
1️⃣ Download Setup.exe from Releases
2️⃣ Double-click the installer
3️⃣ Follow the wizard (choose install location, create shortcuts)
4️⃣ Launch from desktop or Start Menu
5️⃣ Done! 🎉
```

**No Node.js, no npm, no terminal commands needed!**

First-time security prompts:
- **Mac**: Right-click → "Open" (one time only)
- **Windows**: Click "More info" → "Run anyway" if prompted

**📖 See [INSTALL.md](INSTALL.md) for detailed installation instructions with troubleshooting!**

---

### Option 2: Build from Source (For Developers)

**Prerequisites:** Node.js 16+ and ImageMagick

**Quick Build:**
```bash
# Clone repository
git clone <repository-url>
cd Narrowcasting

# Install dependencies
npm run install-all

# Generate installer graphics
cd build && ./generate-installer-graphics.sh && cd ..

# Build installer for your platform
npm run dist:mac    # macOS: Creates .dmg and .zip
npm run dist:win    # Windows: Creates Setup.exe and Portable.exe
```

**Output in `dist/` folder:**
- **Mac**: `Narrowcast-Pro-2.1.0.dmg` + ZIP archive
- **Windows**: `Narrowcast-Pro-Setup-2.1.0.exe` + Portable version

**📖 See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for detailed build guide!**
**📖 See [DISTRIBUTION.md](DISTRIBUTION.md) for release management and GitHub Actions setup!**

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

---

## ❓ Frequently Asked Questions (FAQ)

### Getting Started

**Q: Do I need to pay for this?**
No! Narrowcast Pro is completely free and open source (MIT license).

**Q: Do I need Node.js or npm installed?**
No! Just download the installer (DMG for Mac, EXE for Windows) and install. Everything is included.

**Q: Where do I download it?**
Go to the [Releases page](../../releases/latest) and download for your platform.

**Q: How big is the download?**
Mac: ~120 MB | Windows: ~100 MB (similar to VS Code, Slack, Discord)

### Chromecasts

**Q: How many Chromecasts can I control?**
Unlimited! Control as many as are on your network.

**Q: What Chromecast versions work?**
All of them! Chromecast Gen 1-3, Ultra, with Google TV, and TVs with built-in Chromecast.

**Q: My Chromecasts don't appear. Help!**
Make sure:
- Chromecasts are powered on
- Your computer and Chromecasts are on the **same WiFi network**
- You clicked "Allow" for network permissions
- See [INSTALL.md](INSTALL.md) for detailed troubleshooting

**Q: Can I control Chromecasts from multiple computers?**
Not simultaneously. Only run one instance per network.

### Content

**Q: What types of content can I display?**
9 types: Web pages, YouTube, Weather, RSS feeds, Clock, Images, Social media, News, Custom HTML

**Q: Can I add my company logo?**
Yes! Go to Branding page to upload your logo, set colors, and add text overlays.

**Q: Does content work offline?**
The app works offline, but web pages, weather, news, RSS feeds need internet. Clock and images work offline.

**Q: Can I schedule content to play at specific times?**
Not yet in v2.1.0, but it's planned for a future version.

### Technical

**Q: Does it collect my data?**
No! Everything runs locally. No tracking, no analytics, no telemetry. Your data never leaves your computer.

**Q: Is it open source?**
Yes! Check the GitHub repository to see all the code.

**Q: Why does Mac say "unidentified developer"?**
The app isn't code-signed (costs $99/year). It's safe - just right-click → Open the first time.

**Q: Why does Windows show a security warning?**
Same reason - no code signing certificate. Just click "More info" → "Run anyway."

**Q: Do I need internet to use it?**
To download: Yes. To use: No (but some content types like weather/news need internet).

### Updates & Support

**Q: How do I update to a new version?**
Download the new installer, close the old app, install the new version. Your data is preserved!

**Q: Will updating delete my content?**
No! All slides, presentations, and settings are saved separately and preserved during updates.

**Q: Where can I get help?**
- [INSTALL.md](INSTALL.md) - Complete installation guide with troubleshooting
- [QUICK_START.md](QUICK_START.md) - Quick feature guide
- [GitHub Issues](../../issues) - Report bugs or request features

---

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
