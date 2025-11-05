# Distribution Guide for Narrowcast Pro

## Overview

This document explains how Narrowcast Pro is distributed to end users and how to create new releases.

---

## For End Users: Simple Installation

**End users do NOT need Node.js, npm, or any development tools!**

### Windows Installation

1. Go to https://github.com/[your-username]/Narrowcasting/releases/latest
2. Download `Narrowcast-Pro-Setup-2.1.0.exe`
3. Double-click the downloaded file
4. Follow the wizard:
   - Accept license
   - Choose installation location
   - Click Install
5. Launch Narrowcast Pro from your desktop or Start Menu

**That's it!** No npm, no building, no command line needed.

### Mac Installation

1. Go to https://github.com/[your-username]/Narrowcasting/releases/latest
2. Download `Narrowcast-Pro-2.1.0.dmg`
3. Open the downloaded DMG file
4. Drag Narrowcast Pro to your Applications folder
5. Launch from Applications

**That's it!** No npm, no building, no command line needed.

---

## For Developers: Creating Releases

### Automatic Build Process

Narrowcast Pro uses **GitHub Actions** to automatically build installers for Mac and Windows. Every time you push a version tag, GitHub Actions will:

1. Build the React frontend
2. Package the Electron app
3. Generate installers (DMG for Mac, EXE for Windows)
4. Create a GitHub Release with downloadable files
5. Generate changelog from commits

### Creating a New Release

**Step 1: Update Version**

Edit `package.json` and `client/package.json`:

```json
{
  "version": "2.2.0"
}
```

**Step 2: Commit Changes**

```bash
git add -A
git commit -m "Bump version to 2.2.0"
```

**Step 3: Create and Push Tag**

```bash
# Create tag
git tag v2.2.0

# Push commit and tag
git push origin main
git push origin v2.2.0
```

**Step 4: Wait for GitHub Actions**

GitHub Actions will automatically:
- Build installers for Mac (~10 minutes)
- Build installers for Windows (~8 minutes)
- Create GitHub Release with all files (~1 minute)

Check progress at: `https://github.com/[your-username]/Narrowcasting/actions`

**Step 5: Verify Release**

Go to: `https://github.com/[your-username]/Narrowcasting/releases`

You should see:
- ✅ `Narrowcast-Pro-2.2.0.dmg` (Mac installer, ~120MB)
- ✅ `Narrowcast-Pro-2.2.0-mac.zip` (Mac alternative, ~120MB)
- ✅ `Narrowcast-Pro-Setup-2.2.0.exe` (Windows installer, ~100MB)
- ✅ `Narrowcast-Pro-2.2.0-Portable.exe` (Windows portable, ~100MB)
- ✅ Automatic changelog from git commits

---

## Manual Build (For Testing)

If you want to build installers locally for testing:

### Prerequisites

- **Node.js 16+** installed
- **ImageMagick** installed (for graphics conversion)

```bash
# Mac
brew install imagemagick

# Windows (PowerShell as Administrator)
choco install imagemagick

# Linux
sudo apt-get install imagemagick
```

### Build Steps

**1. Install Dependencies**

```bash
npm run install-all
```

**2. Generate Graphics**

```bash
cd build
./generate-installer-graphics.sh
cd ..
```

**3. Build Installers**

```bash
# Mac (requires macOS)
npm run dist:mac

# Windows (requires Windows)
npm run dist:win

# Both (on respective platforms)
npm run dist:all
```

**4. Find Installers**

Your installers will be in the `dist/` folder:

```
dist/
├── Narrowcast-Pro-2.1.0.dmg           # Mac installer
├── Narrowcast-Pro-2.1.0-mac.zip       # Mac ZIP
├── Narrowcast-Pro-Setup-2.1.0.exe     # Windows installer
└── Narrowcast-Pro-2.1.0-Portable.exe  # Windows portable
```

---

## Distribution Channels

### 1. GitHub Releases (Primary)

**Pros:**
- ✅ Free hosting
- ✅ Automatic with GitHub Actions
- ✅ Version history
- ✅ Works with electron-updater for auto-updates

**How to share:**
```
Download Narrowcast Pro:
https://github.com/[your-username]/Narrowcasting/releases/latest
```

### 2. Direct Download (Alternative)

If you have a website, host the installers there:

```
https://yoursite.com/downloads/Narrowcast-Pro-Setup-2.1.0.exe
https://yoursite.com/downloads/Narrowcast-Pro-2.1.0.dmg
```

### 3. App Stores (Future)

For wider distribution:
- **Mac App Store**: Requires Apple Developer Program ($99/year)
- **Microsoft Store**: Requires Developer account ($19 one-time)
- **Homebrew Cask** (Mac): Free, community-maintained

---

## Auto-Update Setup

Once you have GitHub Releases set up, enable auto-updates in your app:

**1. Update package.json**

Already configured:
```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "[your-username]",
      "repo": "Narrowcasting"
    }
  }
}
```

**2. Implement in electron/main.js**

See `AUTO_UPDATE.md` for complete implementation.

**3. How It Works**

- App checks for updates on launch
- If new version available, shows notification
- User clicks "Update"
- Update downloads in background
- Installs on next restart

---

## File Sizes

Typical installer sizes:

| File | Size | Description |
|------|------|-------------|
| `.dmg` (Mac) | ~120MB | Mac disk image installer |
| `-mac.zip` | ~120MB | Mac ZIP archive |
| `Setup.exe` (Win) | ~100MB | Windows NSIS installer |
| `Portable.exe` (Win) | ~100MB | Windows portable executable |

**Why so large?**
- Includes Chromium browser (~70MB)
- Includes Node.js runtime (~30MB)
- Includes your app code and dependencies (~20MB)

This is normal for Electron apps. Examples:
- VS Code: ~100MB
- Slack: ~90MB
- Discord: ~85MB

---

## Troubleshooting Builds

### GitHub Actions fails on Mac build

**Problem:** Code signing errors

**Solution:** We've disabled code signing:
```json
{
  "mac": {
    "identity": null,
    "hardenedRuntime": false
  }
}
```

Users may see "unidentified developer" warning - they can right-click → Open to bypass.

### GitHub Actions fails on Windows build

**Problem:** Missing BMP files

**Solution:** Graphics are generated automatically in the workflow. If it fails, check the "Prepare graphics" step logs.

### Local build fails

**Problem:** `convert: command not found` or `magick: command not found`

**Solution:** Install ImageMagick:
```bash
brew install imagemagick  # Mac
choco install imagemagick # Windows
```

### Installer is too large

**Problem:** > 200MB installers

**Solutions:**
- Check `node_modules` isn't duplicated
- Verify `client/build` is optimized (`npm run build` with production settings)
- Enable compression in package.json (already set to "normal")

---

## Security Notes

### Code Signing

Current status: **Not signed**

**Mac:** Users will see "unidentified developer" warning
- They can right-click → Open to bypass

**Windows:** Users may see "Windows protected your PC" warning
- They can click "More info" → "Run anyway"

**To enable signing:**
1. Get code signing certificate
2. Add certificates to GitHub Secrets
3. Update `.github/workflows/build-release.yml` with certificate info
4. See INSTALLER.md "Advanced: Code Signing" section

### Notarization (Mac)

Not currently implemented. For production:
1. Join Apple Developer Program ($99/year)
2. Get Developer ID certificate
3. Notarize the app with Apple
4. Users won't see any warnings

---

## Best Practices

1. **Always test locally before releasing**
   ```bash
   npm run dist:mac  # Test on Mac
   npm run dist:win  # Test on Windows
   ```

2. **Use semantic versioning**
   - `v2.0.0` - Major release (breaking changes)
   - `v2.1.0` - Minor release (new features)
   - `v2.1.1` - Patch release (bug fixes)

3. **Write good release notes**
   - GitHub Actions generates changelog from commits
   - Use clear commit messages:
     - `Add feature X`
     - `Fix bug in Y`
     - `Update documentation for Z`

4. **Test installers on clean systems**
   - Mac without Node.js installed
   - Windows without Node.js installed
   - Verify app works without development tools

5. **Keep installers under 200MB**
   - Optimize images
   - Don't include unnecessary dependencies
   - Use `asar` packaging (already enabled)

---

## Comparison: Old vs New Approach

### Old Approach ❌

**For End Users:**
1. Install Node.js and npm
2. Clone repository
3. Run `npm run install-all`
4. Run `npm run build`
5. Run `npm start`
6. Leave terminal open

**Problems:**
- Requires development knowledge
- Requires development tools
- Complex multi-step process
- Terminal must stay open
- Looks unprofessional

### New Approach ✅

**For End Users:**
1. Download installer
2. Double-click to install
3. Launch from Applications/Start Menu

**Benefits:**
- No development tools needed
- Professional installation experience
- Simple download-and-install
- Proper app, not a terminal process
- Auto-updates supported

---

## Next Steps

### For Production Release

1. **Set up GitHub repository secrets** (if using code signing)
   - `MAC_CERTS` - Base64 encoded Mac certificate
   - `MAC_CERTS_PASSWORD` - Certificate password
   - `WIN_CERTS` - Base64 encoded Windows certificate
   - `WIN_CERTS_PASSWORD` - Certificate password

2. **Get code signing certificates**
   - Mac: Join Apple Developer Program
   - Windows: Purchase certificate from DigiCert, Sectigo, etc.

3. **Enable auto-updates**
   - Implement electron-updater (see AUTO_UPDATE.md)
   - Set up GitHub token for updates

4. **Create release checklist**
   - [ ] Update version in package.json
   - [ ] Update CHANGELOG
   - [ ] Test build locally
   - [ ] Create git tag
   - [ ] Push tag
   - [ ] Wait for GitHub Actions
   - [ ] Test installers
   - [ ] Announce release

---

## Resources

- [electron-builder Documentation](https://www.electron.build/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Electron Distribution Guide](https://www.electronjs.org/docs/latest/tutorial/distribution-overview)
- [Auto-Update Implementation](./AUTO_UPDATE.md)
- [Installer Wizard Setup](./INSTALLER.md)

---

**Status:** ✅ Fully configured and ready to use

**Next release:** Just create a git tag and push!

```bash
git tag v2.2.0
git push origin v2.2.0
```

GitHub Actions will handle the rest automatically.
