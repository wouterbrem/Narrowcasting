# 🏗️ Build Instructions for Narrowcast Pro

## What You Need

✅ **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
✅ **Terminal** (built-in on Mac/Linux)
✅ **10 minutes** ⏱️

---

## Step 1: Open Terminal

**Mac:**
1. Press **Cmd + Space**
2. Type: `terminal`
3. Press **Enter**

**Windows:**
1. Press **Win + R**
2. Type: `cmd`
3. Press **Enter**

---

## Step 2: Navigate to the Project Folder

```bash
cd ~/path/to/Narrowcasting
```

**Example:**
```bash
cd ~/Developer/Narrowcasting
# or
cd ~/Documents/Narrowcasting
```

**Tip:** Drag the Narrowcasting folder into the Terminal window, and the path will be filled automatically!

---

## Step 3: Install Dependencies (Only Needed Once)

```bash
npm install
cd client && npm install && cd ..
```

⏱️ This takes about 2-5 minutes

---

## Step 4: Build the Mac App

```bash
npm run dist:mac
```

⏱️ This takes about 3-5 minutes

---

## 🎉 Done!

You'll find the built app in the **dist/** folder:

```
Narrowcasting/
└── dist/
    ├── Narrowcast Pro-2.1.0-mac.zip    ← ZIP file (recommended!)
    ├── Narrowcast Pro-2.1.0.dmg        ← DMG installer
    └── mac/
        └── Narrowcast Pro.app          ← Direct app
```

---

## What Now?

### Option 1: Use the ZIP (Simplest!)

1. **Unzip** Narrowcast Pro-2.1.0-mac.zip
2. **Drag** Narrowcast Pro.app to Applications
3. **Right-click** → Open
4. Done! 🎉

### Option 2: Use the DMG

1. **Double-click** Narrowcast Pro-2.1.0.dmg
2. **Drag** the icon to Applications folder
3. **Right-click** → Open
4. Done! 🎉

---

## ⚠️ Troubleshooting

### "npm: command not found"
➜ Node.js is not installed. Download from https://nodejs.org/

### "Cannot find module 'electron'"
➜ Run first: `npm install`

### "Permission denied"
➜ Add `sudo`: `sudo npm install`

### Build takes a long time
➜ This is normal! Electron is large (~100+ MB download)

### "Error: EACCES: permission denied"
➜ Try: `sudo chown -R $USER:$GROUP ~/.npm` then retry

---

## 🚀 Building for Windows

```bash
npm run dist:win
```

This creates:
- `Narrowcast Pro-2.1.0-Portable.exe` (no installation needed!)
- `Narrowcast Pro Setup 2.1.0.exe` (installer)

**Note:** You can build Windows apps from Mac using electron-builder!

---

## 📊 Build All Platforms at Once

```bash
npm run dist:all
```

Builds both Mac and Windows versions simultaneously.

---

## 💡 Tips

- **First time?** It takes longer because Electron needs to be downloaded
- **Already built?** Subsequent builds are much faster
- **Disk space:** Ensure at least 500 MB free space
- **Internet:** Fast connection helps (Electron is ~100 MB)
- **CI/CD:** You can automate this with GitHub Actions or GitLab CI

---

## 🔄 Rebuilding

If you've changed something in the code:

```bash
npm run dist:mac
```

Old files in `dist/` will be automatically overwritten.

---

## 📦 Distribution

The ZIP and DMG files in `dist/` can be:
- ✅ Shared with others
- ✅ Uploaded to a website
- ✅ Put on a USB drive
- ✅ Sent via email (note: DMG is ~120 MB!)

**For Production Distribution:**

Consider:
- Code signing for Mac (requires Apple Developer account)
- Code signing for Windows (requires certificate)
- Hosting on GitHub Releases or your own server
- Auto-update functionality (see electron-updater)

---

## 🔍 Build Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Run in development mode |
| `npm run build` | Build frontend only |
| `npm run dist` | Build for current platform |
| `npm run dist:mac` | Build Mac app (ZIP + DMG) |
| `npm run dist:win` | Build Windows app (Portable + Installer) |
| `npm run dist:all` | Build for all platforms |
| `npm run pack` | Build without packaging (faster) |

---

## 📝 Build Output Explained

After building, you'll see:

```
dist/
├── Narrowcast Pro-2.1.0-mac.zip          # Unsigned Mac app (ZIP)
├── Narrowcast Pro-2.1.0.dmg              # Unsigned Mac installer (DMG)
├── Narrowcast Pro-2.1.0-Portable.exe     # Windows portable (no install)
├── Narrowcast Pro Setup 2.1.0.exe        # Windows installer (NSIS)
├── mac/                                   # Unpacked Mac build
│   └── Narrowcast Pro.app
└── win-unpacked/                          # Unpacked Windows build
    └── Narrowcast Pro.exe
```

**What to distribute:**
- **Mac users:** ZIP or DMG (ZIP is simpler for unsigned apps)
- **Windows users:** Portable.exe (simplest) or Setup.exe (with shortcuts)

---

**Good luck! 🎉**

If you get stuck, check INSTALL.md for user installation instructions.
