# Quick Start Guide - Narrowcast Pro

Get started with Narrowcast Pro in 5 minutes!

## Download & Install

### macOS

1. **Download** `Narrowcast Pro-2.1.0-mac.zip` from releases
2. **Unzip** the file (double-click)
3. **Move** `Narrowcast Pro.app` to your Applications folder
4. **Launch** from Applications
5. **First time only**: Right-click → Open (to bypass Gatekeeper)
6. **Allow network access** when prompted

### Windows

**Option 1: Portable (No Installation)**
1. **Download** `Narrowcast-Pro-2.1.0-Portable.exe`
2. **Run** the exe file
3. **Allow through firewall** when prompted
4. Done!

**Option 2: Full Installer**
1. **Download** `Narrowcast-Pro-Setup-2.1.0.exe`
2. **Run** the installer
3. **Choose** install location
4. **Allow through firewall** when prompted
5. Launch from Start Menu or Desktop

## First Launch

When you first open Narrowcast Pro:

1. **The app starts automatically**
2. **Your browser opens** to http://localhost:3001
3. **Grant network permissions** if prompted (required for Chromecast)

That's it! You're ready to go.

## Find Your Chromecasts

Chromecasts should appear automatically in the Dashboard.

**Not seeing your Chromecasts?**

✅ Make sure your computer and Chromecasts are on the **same Wi-Fi network**
✅ Check firewall permissions (see below)
✅ Make sure Chromecasts are powered on
✅ Try restarting Narrowcast Pro

### Firewall Permissions

**macOS:**
- System Preferences → Security & Privacy → Firewall → Firewall Options
- Allow "Narrowcast Pro" or "Node" to accept incoming connections

**Windows:**
- When prompted, click "Allow access"
- Or: Windows Defender Firewall → Allow an app → Enable for Private and Public

## Create Your First Slide

1. Click **Slides** in the sidebar
2. Click **Create Slide**
3. Choose a type (try "Clock" for something simple)
4. Fill in the details
5. Click **Create Slide**

## Create Your First Presentation

1. Click **Presentations** in the sidebar
2. Click **Create Presentation**
3. Give it a name
4. Click **Add Slide** and select your clock slide
5. Click **Create Presentation**

## Cast to Your Displays

1. Go to **Dashboard**
2. **Select** one or more Chromecasts (checkboxes)
3. **Choose** your presentation from the dropdown
4. Click **Cast to Selected Devices**
5. **Watch** it appear on your displays!

## Customize Your Branding

1. Go to **Branding** page
2. **Upload your logo** (optional)
3. **Choose your colors** (5 color pickers)
4. **Add text overlay** (optional)
5. Click **Save Changes**

Your branding is automatically applied to ALL presentations!

## Common Issues

### App won't open on Mac

**"App is damaged"**
- This is a false positive from Gatekeeper
- Fix: Right-click app → Open → Click "Open"
- Or run: `xattr -cr "/Applications/Narrowcast Pro.app"`

### SmartScreen warning on Windows

- Click "More info" → "Run anyway"
- This is normal for unsigned apps
- Your app is completely safe!

### Chromecasts not appearing

1. **Check network**: Same Wi-Fi as your Chromecasts?
2. **Check firewall**: Allowed through firewall?
3. **Restart app**: Quit and reopen Narrowcast Pro
4. **Check logs**: Go to Logs page in the app

### Slides not loading

1. **Check internet**: Can you access the URLs normally?
2. **Check logs**: Go to Logs page for detailed errors
3. **Try different content**: Start with something simple like Clock

### Port already in use

If port 3001 is in use:
1. Quit Narrowcast Pro
2. Run: `lsof -ti:3001 | xargs kill` (Mac) or Task Manager → End Node (Windows)
3. Restart Narrowcast Pro

## Tips & Tricks

### Keyboard Shortcuts in Presentations

When viewing a presentation in browser:
- Press **D** to toggle debug info
- Press **Spacebar** to pause/resume
- Press **Left/Right arrows** to navigate slides

### Best Practices

**Slide Duration:**
- Websites: 10-30 seconds
- Images: 5-10 seconds
- Videos: Full video length
- News/RSS: 30-60 seconds

**Presentations:**
- 5-10 slides per presentation
- Mix different content types
- Test on one Chromecast before deploying to all

**Branding:**
- Use high-res logos (PNG with transparency works best)
- Keep text overlays short
- Test visibility on actual displays

### Development Mode

Want to customize the app?

```bash
# Clone the repo
git clone <repository-url>
cd Narrowcasting

# Install dependencies
npm install
cd client && npm install && cd ..

# Run in development mode
npm run electron:dev
```

## Where Are Things Stored?

**Logs:**
- Mac: `~/Library/Application Support/Narrowcast Pro/logs/`
- Windows: `%APPDATA%\Narrowcast Pro\logs\`

**User Data:**
- Mac: `~/Library/Application Support/Narrowcast Pro/data/`
- Windows: `%APPDATA%\Narrowcast Pro\data\`

**Uploaded Files (logos, etc.):**
- Mac: `~/Library/Application Support/Narrowcast Pro/uploads/`
- Windows: `%APPDATA%\Narrowcast Pro\uploads\`

## Getting Help

1. **Check the Logs page** in the app for detailed error messages
2. **Review the README.md** for more detailed documentation
3. **Check BUILD.md** if you're building from source
4. **Open an issue** on GitHub if you need help

## Next Steps

Once you're comfortable with the basics:

1. **Explore all 9 slide types** - Each type has unique features
2. **Create multiple presentations** - Different content for different locations
3. **Set up branding** - Make it look professional with your logo and colors
4. **Use the scheduler** - Plan content in advance (via API)
5. **Group devices** - Manage multiple Chromecasts together (via API)

## API Access

For advanced users, Narrowcast Pro has a full REST API:

**Base URL:** `http://localhost:3001/api`

**Documentation:** See API_DOCS.md (if available) or explore:
- GET /api/devices - List Chromecasts
- GET /api/slides - List slides
- POST /api/slides - Create slide
- GET /api/presentations - List presentations
- POST /api/presentations - Create presentation
- POST /api/presentations/:id/cast - Cast to devices

---

**Need more help?** Check the full [README.md](README.md) or [BUILD.md](BUILD.md) for detailed information.

**Enjoy Narrowcast Pro!** 🎉
