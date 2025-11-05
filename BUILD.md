# Building Narrowcast Pro

Complete build instructions for creating distributable apps **without Xcode or Visual Studio**.

## ✅ No Development Tools Required!

This build process works with **only Node.js installed** - no Xcode, no Visual Studio, no code signing certificates.

## Prerequisites

Only these are needed:
- **Node.js 14+** (Download from https://nodejs.org)
- **npm** (comes with Node.js)
- That's it!

## Quick Build

```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..

# 2. Build React app
cd client && npm run build && cd ..

# 3. Build for your platform
npm run dist
```

This creates:
- **Mac**: ZIP + DMG in `dist/` folder
- **Windows**: Portable EXE + Installer in `dist/` folder

## Platform-Specific Builds

### macOS (No Xcode Required!)

```bash
npm run dist:mac
```

**Output:**
- `dist/Narrowcast Pro-2.1.0-mac.zip` - **Recommended!** Just unzip and run
- `dist/Narrowcast-Pro-2.1.0.dmg` - Drag-to-Applications installer

**Installation:**
1. Unzip the `.zip` file
2. Move `Narrowcast Pro.app` to Applications folder
3. Right-click → Open (first time only, to bypass Gatekeeper)
4. Done!

**Why no code signing?**
- Code signing requires Apple Developer account ($99/year)
- Users can easily bypass with right-click → Open
- App works perfectly without it

### Windows (No Visual Studio Required!)

```bash
npm run dist:win
```

**Output:**
- `dist/Narrowcast-Pro-2.1.0-Portable.exe` - **Recommended!** No installation needed
- `dist/Narrowcast-Pro-Setup-2.1.0.exe` - Full installer with shortcuts

**Installation:**

**Portable (Easiest):**
1. Download the `Portable.exe`
2. Double-click to run
3. That's it! No installation.

**Installer:**
1. Run `Setup.exe`
2. Choose install location
3. Creates shortcuts automatically

**Why no code signing?**
- Code signing requires purchasing a certificate (~$100-400/year)
- Windows may show SmartScreen warning
- Users can click "More info" → "Run anyway"
- App works perfectly without it

## Build Both Platforms

```bash
npm run dist:all
```

Creates all distributable formats for both Mac and Windows.

## Build Output

After building, you'll find in `dist/`:

```
dist/
├── mac/
│   └── Narrowcast Pro.app          # The actual app
├── Narrowcast Pro-2.1.0-mac.zip    # Mac: Ready to distribute!
├── Narrowcast-Pro-2.1.0.dmg        # Mac: Installer
├── Narrowcast-Pro-2.1.0-Portable.exe  # Windows: Ready to run!
└── Narrowcast-Pro-Setup-2.1.0.exe     # Windows: Installer
```

## Testing Before Distribution

Test the built app before distributing:

### Mac
```bash
open "dist/mac/Narrowcast Pro.app"
```

### Windows
```bash
start "dist\Narrowcast-Pro-2.1.0-Portable.exe"
```

## Troubleshooting

### "Command not found: electron-builder"

```bash
npm install
```

### "Cannot find module 'electron'"

```bash
npm install
cd client && npm install && cd ..
```

### Mac: "App is damaged"

This happens when downloading. Fix:
```bash
xattr -cr "/Applications/Narrowcast Pro.app"
```

Or: Right-click app → Open → Click "Open"

### Windows: SmartScreen Warning

Click "More info" → "Run anyway"

This is normal for unsigned apps. Your app is safe!

## Distribution

### Recommended Distribution Methods

**Mac:**
- Distribute the `.zip` file (easier than DMG)
- Users unzip and move to Applications
- First launch: Right-click → Open

**Windows:**
- Distribute the `-Portable.exe` (no installation needed)
- Or the `-Setup.exe` (full installer with shortcuts)
- First launch: Click "More info" → "Run anyway" if SmartScreen appears

### Upload to GitHub Releases

```bash
# Create a new release
git tag v2.1.0
git push origin v2.1.0

# Then upload these files:
dist/Narrowcast Pro-2.1.0-mac.zip
dist/Narrowcast-Pro-2.1.0.dmg
dist/Narrowcast-Pro-2.1.0-Portable.exe
dist/Narrowcast-Pro-Setup-2.1.0.exe
```

## What Gets Bundled

The app includes everything needed:
- ✅ Node.js runtime (embedded)
- ✅ Electron framework
- ✅ Express server
- ✅ React frontend (built)
- ✅ All dependencies
- ✅ Chromecast libraries

**Users don't need to install anything!** Just run the app.

## File Sizes

Approximate sizes:
- Mac ZIP: ~200-250MB
- Mac DMG: ~200-250MB
- Windows Portable: ~150-200MB
- Windows Installer: ~150-200MB

The size includes the entire Electron runtime and all dependencies.

## Code Signing (Optional - Later)

For production distribution, you may want to code sign:

**Mac ($99/year):**
1. Join Apple Developer Program
2. Get Developer ID certificate
3. Remove `"identity": null` from package.json
4. Rebuild

**Windows ($100-400/year):**
1. Purchase code signing certificate (DigiCert, Sectigo, etc.)
2. Configure certificate in package.json
3. Rebuild

**But it's not required!** Apps work fine without signing.

## Development vs Production

**Development:**
```bash
npm run electron:dev
```
Opens with DevTools, hot reload enabled.

**Production Build:**
```bash
npm run dist
```
Creates optimized, compressed apps.

## Advanced Options

### Build for specific architecture

```bash
# Mac Intel only
electron-builder --mac --x64

# Mac Apple Silicon only
electron-builder --mac --arm64

# Mac Universal (both)
electron-builder --mac --universal

# Windows 32-bit
electron-builder --win --ia32
```

### Custom output directory

```bash
electron-builder --mac --dir=./my-build
```

### Skip compression (faster builds)

```bash
electron-builder --mac --config.compression=store
```

## Clean Build

If you encounter issues:

```bash
# Clean everything
rm -rf dist/
rm -rf client/build/
rm -rf node_modules/
rm -rf client/node_modules/

# Fresh install and build
npm install
cd client && npm install && npm run build && cd ..
npm run dist
```

## CI/CD

For automated builds (GitHub Actions, etc.):

```yaml
# .github/workflows/build.yml
name: Build
on: [push]
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: cd client && npm install && npm run build
      - run: npm run dist
```

## Summary

Building Narrowcast Pro is simple:

1. **Install Node.js** (only requirement!)
2. **Run `npm install && cd client && npm install && cd ..`**
3. **Run `npm run dist`**
4. **Distribute the files from `dist/` folder**

No Xcode, no Visual Studio, no code signing needed! 🎉

---

**Questions?** Check the main README.md or open an issue.
