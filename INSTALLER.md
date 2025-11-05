# Installer Wizard Setup

This document explains the beautiful installer wizard implementation for Narrowcast Pro on Windows and Mac.

## Overview

Narrowcast Pro uses **electron-builder** with custom visual elements to create professional, modern installers:

- **Windows (NSIS)**: Wizard-style installer with custom sidebar, header, and branding
- **Mac (DMG)**: Beautiful disk image with custom background and drag-to-install layout

---

## Windows NSIS Installer

### Features

✅ **Wizard-style installer** (not one-click)
✅ **Custom branding** with sidebar and header graphics
✅ **User choice** for installation directory
✅ **Desktop & Start Menu shortcuts**
✅ **Professional appearance** matching modern app standards
✅ **Automatic launch** after installation (optional)
✅ **Proper uninstaller** with custom icon

### Visual Elements

The Windows installer includes custom graphics:

1. **installerSidebar.bmp** (164x314 pixels)
   - Shown on the left side during installation
   - Blue gradient background with Narrowcast Pro branding
   - TV/monitor icon with broadcast waves
   - Chromecast badge

2. **installerHeader.bmp** (150x57 pixels)
   - Shown at the top of progress pages
   - Compact branding with product name
   - Matches sidebar design

3. **icon.ico** (multi-resolution)
   - App icon shown throughout installation
   - Used for installer executable
   - Used for uninstaller
   - Sizes: 16, 32, 48, 64, 128, 256 pixels

### Configuration

See `package.json` → `build` → `nsis`:

```json
{
  "nsis": {
    "oneClick": false,                    // Enable wizard mode
    "allowToChangeInstallationDirectory": true,
    "allowElevation": true,               // Allow admin installation
    "perMachine": true,                   // Install for all users
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "Narrowcast Pro",
    "runAfterFinish": true,               // Launch app after install
    "installerIcon": "build/icon.ico",
    "uninstallerIcon": "build/icon.ico",
    "installerSidebar": "build/installerSidebar.bmp",
    "installerHeader": "build/installerHeader.bmp",
    "installerHeaderIcon": "build/icon.ico",
    "license": "LICENSE",                 // Show license agreement
    "differentialPackage": true           // Faster updates
  }
}
```

### Installation Flow

When a user runs `Narrowcast-Pro-Setup-2.1.0.exe`:

1. **Welcome Page**
   - Shows installerSidebar.bmp on left
   - Welcome text on right

2. **License Agreement**
   - Shows LICENSE file contents
   - User must accept to continue

3. **Installation Directory**
   - Default: `C:\Program Files\Narrowcast Pro`
   - User can change location

4. **Installing**
   - Shows installerHeader.bmp at top
   - Progress bar
   - File extraction status

5. **Completion**
   - Success message
   - "Launch Narrowcast Pro" checkbox (checked by default)
   - Desktop and Start Menu shortcuts created

---

## Mac DMG Installer

### Features

✅ **Beautiful drag-to-install layout**
✅ **Custom background** with instructions
✅ **Professional appearance** matching macOS design standards
✅ **Retina-ready graphics** (@2x support)
✅ **Universal binaries** (Intel + Apple Silicon)

### Visual Elements

The Mac installer includes:

1. **dmg-background.png** (560x400 pixels)
   - Clean, modern design
   - Light gradient background
   - Large Narrowcast Pro icon at top
   - "Drag to Applications folder to install" instruction
   - Arrows pointing to app and Applications folder

2. **dmg-background@2x.png** (1120x800 pixels)
   - High-resolution version for Retina displays

3. **icon.icns**
   - Mac app icon bundle
   - Multiple resolutions: 16x16 to 512x512 @2x

### Configuration

See `package.json` → `build` → `dmg`:

```json
{
  "dmg": {
    "sign": false,
    "title": "${productName} ${version}",
    "background": "build/dmg-background.png",
    "icon": "build/icon.icns",
    "iconSize": 120,
    "contents": [
      {
        "x": 150,
        "y": 250,
        "type": "file"
      },
      {
        "x": 390,
        "y": 250,
        "type": "link",
        "path": "/Applications"
      }
    ],
    "window": {
      "width": 560,
      "height": 400
    }
  }
}
```

### Installation Flow

When a user opens `Narrowcast-Pro-2.1.0.dmg`:

1. DMG mounts automatically
2. Finder window opens showing:
   - Narrowcast Pro app icon on the left (at position 150, 250)
   - Applications folder symlink on the right (at position 390, 250)
   - Custom background with instructions
3. User drags app icon to Applications folder
4. User ejects DMG
5. App is installed and ready to launch

---

## Generating Graphics

### Prerequisites

Install **ImageMagick** (recommended) or **Inkscape**:

```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Alternative: Inkscape
brew install inkscape          # macOS
sudo apt-get install inkscape  # Ubuntu
```

### Generate All Graphics

We provide SVG source files for all installer graphics:

```
build/
├── icon.svg                  # Main app icon (512x512)
├── installerSidebar.svg      # NSIS sidebar (164x314)
├── installerHeader.svg       # NSIS header (150x57)
└── dmg-background.svg        # Mac DMG background (560x400)
```

**Run the generator script:**

```bash
cd build
chmod +x generate-installer-graphics.sh
./generate-installer-graphics.sh
```

This will create:

```
build/
├── icon.png                  # PNG version (512x512)
├── icon@2x.png               # Retina version (1024x1024)
├── icon.ico                  # Windows icon (multi-size)
├── icon.icns                 # Mac icon bundle
├── installerSidebar.bmp      # NSIS sidebar (164x314)
├── installerHeader.bmp       # NSIS header (150x57)
├── dmg-background.png        # DMG background (560x400)
└── dmg-background@2x.png     # Retina DMG background (1120x800)
```

### Manual Generation

If you prefer to generate graphics manually:

**Windows NSIS Sidebar:**
```bash
convert installerSidebar.svg -resize 164x314 installerSidebar.bmp
```

**Windows NSIS Header:**
```bash
convert installerHeader.svg -resize 150x57 installerHeader.bmp
```

**Mac DMG Background:**
```bash
convert dmg-background.svg -resize 560x400 dmg-background.png
convert dmg-background.svg -resize 1120x800 dmg-background@2x.png
```

**Windows ICO:**
```bash
convert icon.svg -resize 512x512 icon.png
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

**Mac ICNS:**
```bash
# Create iconset directory
mkdir icon.iconset

# Generate all sizes (requires macOS)
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

# Convert to ICNS
iconutil -c icns icon.iconset

# Clean up
rm -rf icon.iconset
```

---

## Building Installers

### Build for Windows

```bash
npm run dist:win
```

This creates:
- `dist/Narrowcast-Pro-Setup-2.1.0.exe` (NSIS wizard installer)
- `dist/Narrowcast-Pro-2.1.0-Portable.exe` (Portable version)

### Build for Mac

```bash
npm run dist:mac
```

This creates:
- `dist/Narrowcast-Pro-2.1.0.dmg` (DMG installer)
- `dist/Narrowcast-Pro-2.1.0-mac.zip` (ZIP archive)

### Build for Both Platforms

```bash
npm run dist:all
```

**Note:** Building for Mac requires macOS. Building for Windows can be done on any platform.

---

## Testing Installers

### Windows Testing

1. **Run the installer:**
   ```
   dist/Narrowcast-Pro-Setup-2.1.0.exe
   ```

2. **Verify wizard flow:**
   - Welcome page shows custom sidebar
   - License agreement displays
   - Installation directory can be changed
   - Progress shows custom header
   - Desktop shortcut created
   - Start Menu shortcut created
   - App launches after installation

3. **Test uninstaller:**
   - Go to Settings → Apps → Narrowcast Pro → Uninstall
   - Verify uninstaller has custom icon
   - Verify clean uninstallation

### Mac Testing

1. **Open the DMG:**
   ```
   open dist/Narrowcast-Pro-2.1.0.dmg
   ```

2. **Verify appearance:**
   - Custom background shows
   - App icon and Applications folder are properly positioned
   - Instructions are clear
   - Window size is correct (560x400)

3. **Test installation:**
   - Drag app to Applications folder
   - Eject DMG
   - Launch app from Applications
   - Verify app runs correctly

---

## Customization

### Change Colors

Edit the SVG source files and regenerate:

1. Open `build/installerSidebar.svg` in a text editor
2. Find color definitions (e.g., `#0071E3` for blue)
3. Replace with your brand colors
4. Regenerate graphics with `./generate-installer-graphics.sh`

### Change Layout

**Windows NSIS:**

For advanced customization, create `build/installer.nsh`:

```nsis
!macro customHeader
  SetCompressor /SOLID lzma
  SetCompressorDictSize 64
!macroend

!macro customInit
  MessageBox MB_YESNO "This will install Narrowcast Pro. Continue?" IDYES gogogo
  Abort
  gogogo:
!macroend

!macro customInstall
  ; Add custom installation steps here
!macroend
```

**Mac DMG:**

Edit `package.json` → `build` → `dmg` → `contents` to change icon positions:

```json
{
  "contents": [
    { "x": 200, "y": 300, "type": "file" },
    { "x": 400, "y": 300, "type": "link", "path": "/Applications" }
  ]
}
```

---

## Troubleshooting

### "BMP file not found" error

**Problem:** Missing installerSidebar.bmp or installerHeader.bmp

**Solution:** Run `build/generate-installer-graphics.sh` to generate graphics

### "Invalid BMP dimensions"

**Problem:** NSIS requires exact dimensions

**Solution:**
- Sidebar must be exactly 164x314 pixels
- Header must be exactly 150x57 pixels
- Don't change these sizes

### DMG background not showing

**Problem:** PNG file missing or wrong path

**Solution:** Verify `build/dmg-background.png` exists and path in package.json is correct

### Icons look blurry on Windows

**Problem:** Missing high-resolution icons in ICO file

**Solution:** Regenerate icon.ico with all sizes (16, 32, 48, 64, 128, 256)

### Mac code signing errors

**Problem:** electron-builder trying to sign without certificate

**Solution:** Already configured with `"sign": false` in package.json

---

## Advanced: Code Signing

For production releases, you should code-sign your installers.

### Windows Code Signing

1. **Obtain a code signing certificate** (from DigiCert, Sectigo, etc.)

2. **Update package.json:**
   ```json
   {
     "win": {
       "certificateFile": "path/to/certificate.pfx",
       "certificatePassword": "env:CSC_KEY_PASSWORD",
       "sign": "./build/sign.js"
     }
   }
   ```

3. **Set environment variable:**
   ```bash
   export CSC_KEY_PASSWORD="your_certificate_password"
   ```

4. **Build:**
   ```bash
   npm run dist:win
   ```

### Mac Code Signing

1. **Join Apple Developer Program** ($99/year)

2. **Create certificates in Xcode**

3. **Update package.json:**
   ```json
   {
     "mac": {
       "identity": "Developer ID Application: Your Name (TEAM_ID)",
       "hardenedRuntime": true,
       "gatekeeperAssess": false,
       "entitlements": "build/entitlements.mac.plist",
       "entitlementsInherit": "build/entitlements.mac.plist"
     }
   }
   ```

4. **Create entitlements file:**
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
     <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
     <true/>
   </dict>
   </plist>
   ```

5. **Build and notarize:**
   ```bash
   npm run dist:mac
   xcrun altool --notarize-app --file dist/*.dmg --primary-bundle-id com.narrowcastpro.app
   ```

---

## Best Practices

1. **Test on target platforms** before releasing
2. **Use consistent branding** across all installers
3. **Keep graphics high quality** (use vector SVG sources)
4. **Version your installers** clearly
5. **Provide checksums** (SHA256) for downloads
6. **Sign your installers** for production releases
7. **Test installation and uninstallation** thoroughly
8. **Check installer size** (should be < 200MB)

---

## Resources

- [electron-builder Documentation](https://www.electron.build/)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [DMG Canvas](https://www.araelium.com/dmgcanvas) (GUI tool for DMG design)
- [Install Designer](http://install-designer.com/) (GUI tool for NSIS)
- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)

---

**Status:** ✅ Fully implemented and documented

**Ready to build:** Yes (after generating graphics)

**Next steps:**
1. Generate graphics: `cd build && ./generate-installer-graphics.sh`
2. Build installer: `npm run dist:win` or `npm run dist:mac`
3. Test on target platform
4. Distribute to users

---

**Questions?** Check the resources above or see BUILD_INSTRUCTIONS.md for general build information.
