# 📦 Narrowcast Pro - Installation Guide

**Version 2.1.0** - Super simple installation in 3 steps!

---

## 🍎 Mac Installation (Recommended Method)

### Step 1: Download
Download **Narrowcast Pro-2.1.0-mac.zip**

### Step 2: Unzip
Double-click the downloaded file to extract it

### Step 3: Drag to Applications
```
┌─────────────────┐
│  Narrowcast Pro │  ──────►  📁 Applications
│      .app       │
└─────────────────┘
```

Drag **Narrowcast Pro.app** to your **Applications** folder

### Step 4: Open the App
1. Go to Applications
2. **Right-click** on Narrowcast Pro
3. Click **"Open"** (first time only)
4. Click **"Open"** again in the warning dialog
5. Done! 🎉

**Note:** The first time you must use right-click + "Open" because the app is unsigned (this is normal!)

---

## 🪟 Windows Installation

### Method 1: Portable (No Installation!)

**Simplest!** No installation required!

1. Download **Narrowcast-Pro-2.1.0-Portable.exe**
2. Double-click to launch
3. Done! 🎉

**Note:** Windows Defender SmartScreen warning?
- Click **"More info"**
- Click **"Run anyway"**
- This is normal for unsigned apps!

### Method 2: Installer (With Shortcuts)

If you want desktop shortcuts:

1. Download **Narrowcast-Pro-Setup-2.1.0.exe**
2. Double-click to start installer
3. Choose installation location
4. Click through the wizard
5. Done! 🎉

---

## 🔥 First Time Launch

### What Happens?

1. **App starts** → You see the Narrowcast Pro window
2. **Browser opens** → http://localhost:3001
3. **Permission prompt** → Allow network access!

### Network Permission (Important!)

**Mac:**
```
┌──────────────────────────────────────────┐
│  "Node" would like to accept incoming    │
│   network connections.                    │
│                                           │
│   [Deny]  [Allow]                        │
└──────────────────────────────────────────┘
```
**→ Click "Allow"**

**Windows:**
```
┌──────────────────────────────────────────┐
│  Windows Defender Firewall                │
│  Allow Node.js access?                    │
│                                           │
│  [Private networks]  ✓                   │
│  [Public networks]  ✓                    │
│                                           │
│  [Allow access]                           │
└──────────────────────────────────────────┘
```
**→ Click "Allow access"**

**Why?** Narrowcast Pro needs network access to discover Chromecasts!

---

## ✅ Checklist: Everything Works!

After installation you should see:

- [ ] ✅ App has started
- [ ] ✅ Browser is open at http://localhost:3001
- [ ] ✅ Dashboard is visible
- [ ] ✅ Chromecasts appear automatically (if you have any)

**Chromecasts not showing?** See "Troubleshooting" below.

---

## 🚀 Quick Start After Installation

### 1. Create Your First Slide
```
Dashboard → Slides → [Create Slide]
→ Choose "Clock" (simplest)
→ Enter name
→ [Create Slide]
```

### 2. Create Your First Presentation
```
Dashboard → Presentations → [Create Presentation]
→ Enter name
→ [Add Slide] → Select your Clock slide
→ [Create Presentation]
```

### 3. Cast to Your Display!
```
Dashboard
→ Check Chromecast(s)
→ Select your presentation
→ [Cast to Selected Devices]
→ 🎉 It works!
```

---

## 🔧 Troubleshooting

### "App cannot be opened" (Mac)

**Symptom:**
```
"Narrowcast Pro.app" cannot be opened because
it is from an unidentified developer
```

**Solution:**
1. Go to **System Preferences**
2. → **Security & Privacy**
3. Click **"Open Anyway"** at the bottom

**Or:**
1. **Right-click** the app
2. Click **"Open"**
3. Click **"Open"** again

You only need to do this **once**!

### SmartScreen Warning (Windows)

**Symptom:**
```
Windows Defender SmartScreen prevented this app from starting
```

**Solution:**
1. Click **"More info"**
2. Click **"Run anyway"**

This is normal for unsigned apps!

### Chromecasts Not Visible

**Check:**
- [ ] Are your Chromecasts powered on?
- [ ] Are your computer AND Chromecasts on the same WiFi network?
- [ ] Did you allow network access?

**Firewall Check:**

**Mac:**
```
System Preferences → Security & Privacy
→ Firewall → Firewall Options
→ Check: "Node" or "Narrowcast Pro" is set to ALLOW
```

**Windows:**
```
Windows Firewall → Allow an app
→ Find "Node.js"
→ Check: Both Private and Public are checked
```

**Still not working?**
1. Restart the app
2. Check the **Logs** page in the app
3. Look for error messages

### Port 3001 Already in Use?

**Mac:**
```bash
lsof -ti:3001 | xargs kill
```

**Windows:**
1. Open Task Manager
2. Find "node" processes
3. Stop them
4. Restart app

---

## 📂 Where is Everything?

### Logs (for troubleshooting)
**Mac:**
```
~/Library/Application Support/Narrowcast Pro/logs/
```

**Windows:**
```
%APPDATA%\Narrowcast Pro\logs\
```

### User Data (slides, presentations, branding)
**Mac:**
```
~/Library/Application Support/Narrowcast Pro/data/
```

**Windows:**
```
%APPDATA%\Narrowcast Pro\data\
```

### Uploaded Files (logos)
**Mac:**
```
~/Library/Application Support/Narrowcast Pro/uploads/
```

**Windows:**
```
%APPDATA%\Narrowcast Pro\uploads\
```

**Tip:** You can open these folders from the app:
```
Help menu → Open Logs Folder
```

---

## 🎨 Next Steps

Now that your app is working:

1. **📊 Create more slides** - Try all 9 types!
   - Web pages
   - YouTube videos
   - Weather info
   - RSS feeds
   - Clock
   - Images
   - Social media
   - News
   - Custom HTML

2. **🎨 Customize branding**
   - Upload your logo
   - Set your colors
   - Add text overlay

3. **📽️ Build presentations**
   - Combine multiple slides
   - Set duration per slide
   - Cast to multiple displays at once!

---

## 📞 Need Help?

1. **Check the Logs** - Go to Logs page in the app
2. **Read README.md** - Comprehensive documentation
3. **See QUICK_START.md** - Quick guide
4. **Check BUILD.md** - If you want to build yourself

---

## 🔄 Updates

New version available?

1. Download new version
2. Stop old app
3. Replace old .app/.exe with new one
4. Start new version
5. Done!

Your data will be preserved!

---

**Enjoy Narrowcast Pro!** 🎉

**Version:** 2.1.0
**Support:** Check README.md for more info
