# 📦 Narrowcast Pro - Installation Guide

**Version 2.1.0** - Simple installation in just a few minutes!

---

## 🤔 What is Narrowcast Pro?

Narrowcast Pro is a desktop app that lets you **control multiple Chromecast devices** from your computer.

**Think of it like PowerPoint for TVs** - you create content (slides, weather, news, videos) and display it on any TV with a Chromecast. Perfect for:

- 🏢 **Offices** - Display company news and announcements
- 🏪 **Retail Stores** - Show promotions and product information
- 🏫 **Schools** - Display schedules and announcements
- 🏥 **Healthcare** - Show wait times and health information
- 🏨 **Hotels** - Display local information and events

**No technical knowledge required!** Just install and go.

---

## 📥 Where to Download

**Option 1: Download Pre-Built App (Recommended)**

Go to the [**Releases page**](../../releases/latest) and download:

- **For Mac**: Download `Narrowcast-Pro-2.1.0.dmg` (~120 MB)
- **For Windows**: Download `Narrowcast-Pro-Setup-2.1.0.exe` (~100 MB)

**Option 2: Build from Source (Advanced Users Only)**

See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) if you want to build it yourself.

---

## 🍎 Mac Installation - Step by Step

### What You Need
- ✅ Mac computer (macOS 10.13 or newer)
- ✅ 5 minutes of time
- ✅ Internet connection (for download)

### Step 1: Download the App

1. Click this link: [**Download for Mac**](../../releases/latest)
2. Find the file: `Narrowcast-Pro-2.1.0.dmg`
3. Click to download (120 MB - takes 1-2 minutes on typical connection)

**What you'll see:**
```
Downloads folder → Narrowcast-Pro-2.1.0.dmg
```

### Step 2: Open the DMG File

1. Go to your **Downloads** folder
2. **Double-click** `Narrowcast-Pro-2.1.0.dmg`
3. A window will open showing the app

**What you'll see:**

```
┌─────────────────────────────────────────────┐
│                                             │
│   🖥️                                        │
│   Narrowcast Pro                            │
│                                             │
│                    →                        │
│                                             │
│             📁 Applications                 │
│                                             │
└─────────────────────────────────────────────┘
     Drag app to Applications folder
```

### Step 3: Install to Applications

1. **Drag** the Narrowcast Pro icon
2. **Drop** it onto the Applications folder
3. Wait 5 seconds for it to copy
4. **Eject** the DMG (right-click → Eject, or drag to trash)

**Done copying!** The app is now in your Applications folder.

### Step 4: Launch the App (FIRST TIME)

**Important:** The first time is different! Here's what to do:

1. Open **Applications** folder (⌘+Shift+A)
2. Find **Narrowcast Pro**
3. **Right-click** (or Control+click) on it
4. Choose **"Open"** from the menu
5. You'll see this warning:

```
┌─────────────────────────────────────────────┐
│ "Narrowcast Pro" is an app downloaded from  │
│ the internet. Are you sure you want to      │
│ open it?                                     │
│                                             │
│             [Cancel]  [Open]                │
└─────────────────────────────────────────────┘
```

6. Click **"Open"**

**Why this warning?**
The app isn't code-signed by Apple (which costs $99/year). The app is safe - you just need to tell your Mac "yes, I want to run this."

**After the first time**, you can just double-click normally!

### Step 5: Grant Network Permission

When the app starts, you'll see this:

```
┌─────────────────────────────────────────────┐
│ Do you want the application "node" to       │
│ accept incoming network connections?        │
│                                             │
│ Deny will limit network functionality.     │
│                                             │
│             [Deny]  [Allow]                 │
└─────────────────────────────────────────────┘
```

**Click "Allow"**

**Why?** Narrowcast Pro needs to:
- Find your Chromecasts on the network
- Host a web interface
- Send content to your Chromecasts

**This is safe!** The app only communicates on your local network, not with the internet.

### Step 6: You're Done! 🎉

You should now see:

1. **Narrowcast Pro app** is running (icon in your dock)
2. **Your browser opens** automatically to http://localhost:3001
3. **Dashboard appears** showing Narrowcast Pro interface

**What you should see in your browser:**

```
╔══════════════════════════════════════════════╗
║  🖥️ Narrowcast Pro                           ║
╠══════════════════════════════════════════════╣
║  Dashboard | Devices | Slides | Presentations║
╠══════════════════════════════════════════════╣
║                                              ║
║  Discovered Devices (2)                      ║
║  ┌──────────────────┐  ┌──────────────────┐ ║
║  │ Living Room TV   │  │ Office Display    │ ║
║  │ ✓ Connected      │  │ ✓ Connected       │ ║
║  └──────────────────┘  └──────────────────┘ ║
║                                              ║
╚══════════════════════════════════════════════╝
```

**If you don't see your Chromecasts yet**, don't worry! See the "Troubleshooting" section below.

---

## 🪟 Windows Installation - Step by Step

### What You Need
- ✅ Windows computer (Windows 10 or newer)
- ✅ 5 minutes of time
- ✅ Internet connection (for download)

### Step 1: Download the Installer

1. Click this link: [**Download for Windows**](../../releases/latest)
2. Find the file: `Narrowcast-Pro-Setup-2.1.0.exe`
3. Click to download (100 MB - takes 1-2 minutes on typical connection)

**What you'll see:**
```
Downloads folder → Narrowcast-Pro-Setup-2.1.0.exe
```

### Step 2: Run the Installer

1. Go to your **Downloads** folder
2. **Double-click** `Narrowcast-Pro-Setup-2.1.0.exe`

**You might see this warning:**

```
┌─────────────────────────────────────────────┐
│ Windows protected your PC                   │
│                                             │
│ Windows Defender SmartScreen prevented an   │
│ unrecognized app from starting.             │
│                                             │
│              [More info]  [Don't run]       │
└─────────────────────────────────────────────┘
```

**What to do:**
1. Click **"More info"**
2. Click **"Run anyway"**

**Why this warning?**
The app isn't code-signed with a Microsoft certificate (which costs money). The app is safe - Windows just doesn't recognize it yet.

### Step 3: Follow the Installation Wizard

You'll see a beautiful installation wizard:

**Page 1: Welcome**
```
┌─────────────────────────────────────────────┐
│                                             │
│        Welcome to Narrowcast Pro           │
│                                             │
│  This wizard will guide you through the     │
│  installation of Narrowcast Pro 2.1.0       │
│                                             │
│                        [Next >]             │
└─────────────────────────────────────────────┘
```
Click **Next**

**Page 2: License Agreement**
```
┌─────────────────────────────────────────────┐
│  License Agreement                          │
│  ┌─────────────────────────────────────┐   │
│  │ MIT License...                      │   │
│  │ ...                                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ☐ I accept the agreement                  │
│                                             │
│              [< Back]  [Next >]            │
└─────────────────────────────────────────────┘
```
Check the box, click **Next**

**Page 3: Choose Installation Location**
```
┌─────────────────────────────────────────────┐
│  Select Destination Location                │
│                                             │
│  C:\Program Files\Narrowcast Pro            │
│                          [Browse...]        │
│                                             │
│              [< Back]  [Install]           │
└─────────────────────────────────────────────┘
```
Default location is fine, click **Install**

**Page 4: Installing...**
```
┌─────────────────────────────────────────────┐
│  Installing Narrowcast Pro                  │
│                                             │
│  ████████████████░░░░░░░ 75%               │
│                                             │
│  Extracting files...                        │
└─────────────────────────────────────────────┘
```
Wait 30-60 seconds

**Page 5: Complete**
```
┌─────────────────────────────────────────────┐
│  Completing the Narrowcast Pro Setup        │
│                                             │
│  ✓ Narrowcast Pro has been installed.       │
│                                             │
│  ☑ Launch Narrowcast Pro                    │
│                                             │
│                          [Finish]           │
└─────────────────────────────────────────────┘
```
Leave the checkbox checked, click **Finish**

### Step 4: Grant Firewall Permission

When the app starts, you'll see this:

```
┌─────────────────────────────────────────────┐
│ Windows Defender Firewall has blocked some  │
│ features of this app                        │
│                                             │
│ Name: Node.js: Server-side JavaScript       │
│                                             │
│ Allow Node.js to communicate on:            │
│ ☑ Private networks (home or work)          │
│ ☑ Public networks (airports, cafes)        │
│                                             │
│              [Allow access]  [Cancel]       │
└─────────────────────────────────────────────┘
```

**Click "Allow access"**

**Why?** Narrowcast Pro needs to:
- Find your Chromecasts on the network
- Host a web interface
- Send content to your Chromecasts

**This is safe!** The app only communicates on your local network.

### Step 5: You're Done! 🎉

You should now see:

1. **Narrowcast Pro** is running (icon in system tray)
2. **Your browser opens** automatically to http://localhost:3001
3. **Dashboard appears** showing Narrowcast Pro interface

**Shortcuts created:**
- Desktop shortcut: Double-click to launch
- Start Menu: Find under "Narrowcast Pro"

---

## ✅ What Should Happen After Installation

### Immediately After Launch

1. **App window opens** (or app runs in background)
2. **Browser opens** to http://localhost:3001
3. **Dashboard loads** showing the interface
4. **Chromecasts appear** automatically (if you have any)

### What You'll See

```
Browser showing:

╔════════════════════════════════════════════════╗
║ 🖥️ Narrowcast Pro                v2.1.0        ║
╠════════════════════════════════════════════════╣
║ [Dashboard] [Devices] [Slides] [Presentations] ║
╠════════════════════════════════════════════════╣
║                                                ║
║ 📺 Discovered Devices                          ║
║                                                ║
║ ┌──────────────────┐  ┌──────────────────┐    ║
║ │ Living Room TV   │  │ Bedroom TV        │    ║
║ │ Chromecast       │  │ Chromecast        │    ║
║ │ ✓ Ready          │  │ ✓ Ready           │    ║
║ │ [Cast]           │  │ [Cast]            │    ║
║ └──────────────────┘  └──────────────────┘    ║
║                                                ║
║ No devices? Check troubleshooting below.       ║
║                                                ║
╚════════════════════════════════════════════════╝
```

### If Everything is Working

You should see:
- ✅ Dashboard page loads
- ✅ Your Chromecasts appear (if you have any)
- ✅ All menu items work (Devices, Slides, Presentations)
- ✅ No error messages

**Ready to create your first content!** See "First Steps" below.

---

## 🚀 First Steps After Installation

Now that the app is running, here's what to do:

### 1. Check Your Chromecasts Appear

**Go to: Dashboard or Devices page**

You should see a list of all Chromecasts on your network:

```
Discovered Devices (3)

┌──────────────────────┐
│ Living Room TV       │
│ Chromecast (Gen 3)   │
│ IP: 192.168.1.10     │
│ ✓ Ready              │
└──────────────────────┘

┌──────────────────────┐
│ Office Display       │
│ Chromecast Ultra     │
│ IP: 192.168.1.15     │
│ ✓ Ready              │
└──────────────────────┘
```

**Not seeing your Chromecasts?** → See "Troubleshooting: Chromecasts Not Visible" below

### 2. Create Your First Slide

Let's make something simple - a clock!

**Go to: Slides → Create Slide**

1. Click **"Slides"** in the top menu
2. Click **"Create Slide"** button
3. Fill in the form:
   - **Name**: "My First Clock"
   - **Type**: Choose "Clock"
   - **Duration**: 10 seconds
4. Click **"Create Slide"**

**Done!** You created your first slide.

### 3. Create a Presentation

Now let's put slides into a presentation:

**Go to: Presentations → Create Presentation**

1. Click **"Presentations"** in the top menu
2. Click **"Create Presentation"** button
3. Fill in the form:
   - **Name**: "My First Presentation"
4. Click **"Add Slide"**
5. Select your "My First Clock" slide
6. Click **"Create Presentation"**

**Done!** You have a presentation.

### 4. Cast to Your TV!

Let's send it to a Chromecast:

**Go to: Dashboard**

1. Find your Chromecast device
2. Click the **checkbox** next to it (to select it)
3. Choose your **"My First Presentation"** from the dropdown
4. Click **"Cast to Selected Devices"**

**🎉 You should now see the clock on your TV!**

---

## ❓ Frequently Asked Questions (FAQ)

### General Questions

#### Q: What is Narrowcast Pro?
**A:** Narrowcast Pro is a desktop app that lets you control multiple Chromecast devices. You create content (slides with web pages, videos, weather, etc.) and display them on TVs with Chromecasts.

#### Q: Do I need to pay for this?
**A:** No! Narrowcast Pro is free and open source (MIT license).

#### Q: Do I need Node.js or npm installed?
**A:** No! The downloadable installers have everything included. Just download and install.

#### Q: Can I use this without a Chromecast?
**A:** Not really - you need at least one Chromecast device to display content. But you can create and preview content without one.

#### Q: How many Chromecasts can I control?
**A:** Unlimited! Control as many Chromecasts as are on your network.

#### Q: Does this work with Chromecast with Google TV?
**A:** Yes! Works with all Chromecast devices:
- Chromecast (all generations)
- Chromecast Ultra
- Chromecast with Google TV
- TVs with built-in Chromecast

---

### Installation Questions

#### Q: Where do I download it?
**A:** Go to the [Releases page](../../releases/latest) and download:
- **Mac**: `Narrowcast-Pro-2.1.0.dmg`
- **Windows**: `Narrowcast-Pro-Setup-2.1.0.exe`

#### Q: How big is the download?
**A:**
- Mac: ~120 MB
- Windows: ~100 MB

Why so big? It includes a web browser engine (Chromium) and Node.js runtime, just like apps like VS Code, Slack, and Discord.

#### Q: Can I install on multiple computers?
**A:** Yes! Install on as many computers as you want. It's free.

#### Q: Where does it install to?
**A:**
- **Mac**: `/Applications/Narrowcast Pro.app`
- **Windows**: `C:\Program Files\Narrowcast Pro\`

#### Q: How do I uninstall?
**A:**
- **Mac**: Drag app from Applications to Trash
- **Windows**: Settings → Apps → Narrowcast Pro → Uninstall

---

### Security Questions

#### Q: Why does Mac say "cannot verify developer"?
**A:** The app isn't code-signed by Apple (costs $99/year). The app is safe. Just right-click → Open the first time.

#### Q: Why does Windows SmartScreen block it?
**A:** The app isn't code-signed with a Microsoft certificate. The app is safe. Just click "More info" → "Run anyway."

#### Q: Why does it ask for network permission?
**A:** Narrowcast Pro needs network access to:
- Discover Chromecasts on your WiFi
- Host the web interface
- Send content to Chromecasts

It only communicates on your local network, not with the internet.

#### Q: Is my data sent to the internet?
**A:** No! Everything runs locally on your computer. No data is sent anywhere. No tracking. No analytics. No telemetry.

#### Q: Can I see the source code?
**A:** Yes! It's open source. Check the GitHub repository.

---

### Network Questions

#### Q: Do I need internet?
**A:**
- **To install**: Yes (to download the app)
- **To use**: No! Works completely offline
- **For some content**: Yes (weather, news, RSS feeds, web pages need internet)

#### Q: Does it work on any WiFi network?
**A:** Yes, but your computer and Chromecasts must be on the **same network**. Some networks (corporate, hotel) may block device discovery.

#### Q: Can I use it on 5GHz WiFi?
**A:** Yes! Works on both 2.4GHz and 5GHz networks.

#### Q: My computer is on Ethernet, Chromecasts on WiFi. Will it work?
**A:** Yes! As long as they're on the same network (same router), it works fine.

---

### Troubleshooting Questions

#### Q: Chromecasts not showing up?
**A:** Check:
1. Are Chromecasts powered on?
2. Are computer and Chromecasts on same WiFi?
3. Did you allow network permissions?
4. Try restarting the app
5. See full troubleshooting section below

#### Q: App won't start?
**A:** Check:
1. Is port 3001 already in use?
2. Try restarting your computer
3. Check the logs (see "Where are the logs?" below)
4. Try reinstalling

#### Q: Browser doesn't open automatically?
**A:** Manually go to: http://localhost:3001

#### Q: Getting "port already in use" error?
**A:** Something else is using port 3001.
- **Mac**: Run `lsof -ti:3001 | xargs kill` in Terminal
- **Windows**: Use Task Manager to kill Node.js processes

---

### Usage Questions

#### Q: What types of content can I display?
**A:** 9 types of slides:
1. **Web Page** - Any website
2. **YouTube** - YouTube videos
3. **Weather** - Live weather information
4. **RSS Feed** - News feeds
5. **Clock** - Digital or analog clock
6. **Image** - Pictures/photos
7. **Social Media** - Social media feeds
8. **News** - News headlines
9. **Custom HTML** - Your own HTML/CSS/JavaScript

#### Q: Can I add my company logo?
**A:** Yes! Use the Branding feature to add:
- Your logo
- Custom colors
- Text overlay

#### Q: Can I schedule content?
**A:** Not yet in v2.1.0, but it's planned for a future version.

#### Q: Can multiple people control the same Chromecasts?
**A:** Not simultaneously. Only one computer should run Narrowcast Pro per network at a time.

#### Q: Does it remember my content?
**A:** Yes! All slides, presentations, and settings are saved automatically.

#### Q: Can I export/backup my content?
**A:** Yes! Your data is stored in:
- **Mac**: `~/Library/Application Support/Narrowcast Pro/`
- **Windows**: `%APPDATA%\Narrowcast Pro\`

Copy this folder to backup.

---

### Update Questions

#### Q: How do I update to a new version?
**A:**
1. Download the new installer
2. Close the old app
3. Install the new version (replaces old one)
4. Your data is preserved!

#### Q: Will I lose my content when updating?
**A:** No! All your slides, presentations, and settings are saved separately and will be there after updating.

#### Q: Does it auto-update?
**A:** Not yet in v2.1.0, but it's planned for a future version.

---

## 🔧 Troubleshooting

### Problem: Chromecasts Not Visible

**Symptom:** Dashboard shows "No devices found" or list is empty.

**Solutions (try in order):**

#### 1. Basic Checks
- [ ] Are your Chromecasts powered on?
- [ ] Are they plugged into the TV and TV is on?
- [ ] Is your computer connected to WiFi?
- [ ] Are computer and Chromecasts on the **same WiFi network**?

#### 2. Check Network Permissions

**Mac:**
1. Open **System Preferences** → **Security & Privacy**
2. Click **Firewall** tab
3. Click **Firewall Options**
4. Look for "Node" or "Narrowcast Pro"
5. Make sure it's set to **"Allow incoming connections"**

**Windows:**
1. Open **Windows Security** → **Firewall & network protection**
2. Click **Allow an app through firewall**
3. Find **"Node.js: Server-side JavaScript"**
4. Make sure both **Private** and **Public** are checked
5. If not checked, click **Change settings** → check both boxes → OK

#### 3. Restart Everything
1. Close Narrowcast Pro
2. Restart your Chromecasts (unplug for 10 seconds)
3. Restart Narrowcast Pro
4. Wait 30 seconds for discovery

#### 4. Check Firewall isn't blocking
Some routers have "client isolation" or "AP isolation" enabled. This blocks devices from seeing each other.

**Check your router settings:**
- Log into your router (usually 192.168.1.1)
- Look for "AP Isolation" or "Client Isolation"
- Make sure it's **disabled**

#### 5. Test from another device
Can you cast from your phone to the Chromecast? (Using YouTube or Netflix)
- **Yes**: Chromecast works, issue is with Narrowcast Pro
- **No**: Issue is with Chromecast or network

#### 6. Check the Logs
1. Open Narrowcast Pro
2. Click **Logs** in the menu
3. Look for errors like:
   - "Error discovering devices"
   - "Network permission denied"
   - "Port already in use"

Take a screenshot and see "Getting Help" section below.

---

### Problem: "Cannot Open App" (Mac)

**Symptom:**
```
"Narrowcast Pro.app" cannot be opened because
it is from an unidentified developer.
```

**Solution 1: Right-Click Method (Easiest)**
1. **Right-click** (or Control+click) on the app
2. Click **"Open"**
3. Click **"Open"** again in the dialog

**Solution 2: System Preferences Method**
1. Try to open the app (it will fail)
2. Open **System Preferences** → **Security & Privacy**
3. You'll see: "Narrowcast Pro was blocked..."
4. Click **"Open Anyway"**
5. Click **"Open"** in the dialog

**Why this happens:**
Apple's "Gatekeeper" blocks unsigned apps. The app is safe - it's just not signed with an Apple Developer certificate ($99/year).

**You only need to do this once!** After the first time, the app will open normally.

---

### Problem: SmartScreen Warning (Windows)

**Symptom:**
```
Windows protected your PC
Windows Defender SmartScreen prevented an unrecognized app from starting.
```

**Solution:**
1. Click **"More info"**
2. Click **"Run anyway"**

**Why this happens:**
Windows SmartScreen blocks apps without a Microsoft code signing certificate. The app is safe - it's just not signed.

**This is normal!** Many small apps show this warning.

---

### Problem: Browser Doesn't Open

**Symptom:** App starts but browser doesn't open automatically.

**Solution:**
Manually open your browser and go to:
```
http://localhost:3001
```

**Bookmark it** for easy access!

---

### Problem: Port 3001 Already in Use

**Symptom:** Error message: "Port 3001 is already in use" or app won't start.

**Cause:** Another app or old Node process is using port 3001.

**Solution for Mac:**
1. Open **Terminal** (Applications → Utilities → Terminal)
2. Run this command:
```bash
lsof -ti:3001 | xargs kill
```
3. Restart Narrowcast Pro

**Solution for Windows:**
1. Press **Ctrl+Shift+Esc** (opens Task Manager)
2. Click **Details** tab
3. Find any **"node.exe"** processes
4. Right-click → **End task**
5. Restart Narrowcast Pro

**Alternative:** Restart your computer

---

### Problem: Content Not Displaying on Chromecast

**Symptom:** You cast content but TV shows black screen or error.

**Possible Causes & Solutions:**

#### 1. URL Not Accessible
**Problem:** The URL you're trying to cast isn't accessible from the Chromecast.

**Check:**
- Is it a local file? (Chromecasts can't access local files)
- Is it behind a password? (Chromecasts can't log in)
- Is it HTTPS? (Some HTTP sites don't work)

**Solution:** Use public URLs that don't require login.

#### 2. Chromecast in Use
**Problem:** Another app is casting to the Chromecast.

**Solution:**
1. Stop other casting apps (YouTube, Netflix, etc.)
2. Try casting from Narrowcast Pro again

#### 3. Network Issues
**Problem:** Chromecast lost connection.

**Solution:**
1. Check TV shows Chromecast is connected to WiFi
2. Restart Chromecast (unplug for 10 seconds)
3. Try casting again

---

### Problem: Slow Performance

**Symptom:** App is slow, laggy, or freezing.

**Solutions:**

#### 1. Too Many Chromecasts
If you have 10+ Chromecasts, the app may slow down.

**Solution:** Close any Chromecasts you're not using (unplug them).

#### 2. Computer Low on Memory
**Check:**
- Mac: Activity Monitor → Memory tab
- Windows: Task Manager → Performance → Memory

**If memory is full:**
- Close other apps
- Restart computer
- Restart Narrowcast Pro

#### 3. Old Computer
Narrowcast Pro requires:
- Mac: macOS 10.13 or newer
- Windows: Windows 10 or newer
- 4GB RAM minimum (8GB recommended)

---

### Problem: Slides Not Playing in Sequence

**Symptom:** Presentation shows one slide and stops, or plays wrong order.

**Check:**
1. Go to **Presentations**
2. Edit your presentation
3. Check slide order - drag to reorder
4. Check durations - each slide needs a duration (in seconds)
5. Save changes
6. Cast again

---

## 📁 Where is Everything Stored?

### On Mac

**Application:**
```
/Applications/Narrowcast Pro.app
```

**Your Data:**
```
~/Library/Application Support/Narrowcast Pro/
├── data/               ← Slides, presentations, settings
├── logs/               ← Log files for troubleshooting
└── uploads/            ← Uploaded logos and images
```

**To open quickly:**
1. Open Finder
2. Press **⌘+Shift+G** (Go to Folder)
3. Paste: `~/Library/Application Support/Narrowcast Pro/`
4. Press **Enter**

### On Windows

**Application:**
```
C:\Program Files\Narrowcast Pro\
```

**Your Data:**
```
%APPDATA%\Narrowcast Pro\
├── data\               ← Slides, presentations, settings
├── logs\               ← Log files for troubleshooting
└── uploads\            ← Uploaded logos and images
```

**To open quickly:**
1. Press **Windows Key + R**
2. Type: `%APPDATA%\Narrowcast Pro`
3. Press **Enter**

### What's in These Folders?

**data/**
- `slides.json` - All your slides
- `presentations.json` - All your presentations
- `branding.json` - Branding settings

**logs/**
- `combined.log` - All activity
- `error.log` - Errors only
- `activity.log` - User actions

**uploads/**
- `branding/` - Logos you uploaded
- `temp/` - Temporary files

### Backing Up Your Data

Want to save your work?

**Mac:**
```bash
cp -r ~/Library/Application\ Support/Narrowcast\ Pro/ ~/Desktop/Narrowcast-Backup/
```

**Windows:**
1. Press **Windows Key + R**
2. Type: `%APPDATA%`
3. Copy **Narrowcast Pro** folder to Desktop

**To restore:** Just copy the folder back!

---

## 🔄 Updating to a New Version

### When a New Version is Released

1. **Download** the new installer:
   - Go to [Releases page](../../releases/latest)
   - Download new version

2. **Close** the old app:
   - Quit Narrowcast Pro completely

3. **Install** new version:
   - **Mac**: Open new DMG, drag to Applications (replaces old one)
   - **Windows**: Run new installer (automatically replaces old version)

4. **Launch** new version:
   - All your data is preserved automatically!

### Will I Lose My Data?

**No!** Your data is stored separately from the app:
- Slides
- Presentations
- Settings
- Uploaded images
- Branding

**Everything is preserved** when you update.

### How to Check Current Version

In the app:
1. Look at bottom of page
2. Shows: "Version 2.1.0"

Or:
- **Mac**: Narrowcast Pro menu → About Narrowcast Pro
- **Windows**: Help menu → About

---

## 🆘 Getting Help

### 1. Check the Logs

The logs show what's happening behind the scenes:

**In the app:**
1. Click **Logs** in the top menu
2. Look for red error messages
3. Take a screenshot

**On disk:**
- **Mac**: `~/Library/Application Support/Narrowcast Pro/logs/`
- **Windows**: `%APPDATA%\Narrowcast Pro\logs\`

Open `error.log` in a text editor.

### 2. Check Documentation

- **README.md** - Complete feature documentation
- **QUICK_START.md** - Quick guide to all features
- **BUILD_INSTRUCTIONS.md** - Building from source
- **DISTRIBUTION.md** - For developers creating releases

### 3. Common Error Messages

**"EADDRINUSE: address already in use ::3001"**
→ Port 3001 is busy. See "Port 3001 Already in Use" above.

**"Network permission denied"**
→ You denied network access. Reinstall and click "Allow" when asked.

**"Cannot find Chromecasts"**
→ See "Chromecasts Not Visible" section above.

**"WebSocket connection failed"**
→ Restart the app.

### 4. Report an Issue

Found a bug? Open an issue on GitHub:

1. Go to: [GitHub Issues](../../issues)
2. Click **"New Issue"**
3. Include:
   - Your operating system (Mac/Windows, version)
   - App version (check in About menu)
   - Steps to reproduce
   - Screenshots
   - Log file (`error.log`)

---

## ✨ You're All Set!

Congratulations! Narrowcast Pro is now installed and ready to use.

### Next Steps

1. **📺 Make sure your Chromecasts appear** → Go to Dashboard
2. **🎨 Create your first slide** → Go to Slides → Create Slide
3. **📽️ Make a presentation** → Go to Presentations → Create Presentation
4. **🚀 Cast to your TV!** → Dashboard → Cast to Selected Devices

### Quick Tips

- Start simple with a Clock or Web Page slide
- Test on one Chromecast before casting to multiple
- Use the Preview feature to check content before casting
- Check the Logs page if something doesn't work

### Need More Help?

- **Quick Start Guide**: See QUICK_START.md
- **Full Documentation**: See README.md
- **Report Bugs**: Open an issue on GitHub

---

**Enjoy using Narrowcast Pro!** 🎉

**Version:** 2.1.0
**Last Updated:** 2024-11-05

