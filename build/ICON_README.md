# App Icon Guide

This directory contains the app icon in various formats for different platforms.

## Current Files

- **icon.svg** - Master SVG source file (512x512)
- **icon.png** - Will be generated from SVG
- **icon.ico** - Windows icon (will be generated)
- **icon.icns** - macOS icon (will be generated)

## Quick Icon Generation

### Using ImageMagick (Recommended)

```bash
# Install ImageMagick
# Mac: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generate PNG from SVG
convert icon.svg -resize 512x512 icon.png

# Generate ICO for Windows (multiple sizes)
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Generate ICNS for macOS (requires png2icns)
# Mac: brew install libicns
mkdir icon.iconset
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
cp icon.png icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
rm -rf icon.iconset
```

### Using Online Tools (Easiest)

If you don't want to install ImageMagick:

1. **Upload icon.svg to:**
   - https://cloudconvert.com/svg-to-png (for PNG)
   - https://cloudconvert.com/png-to-ico (for ICO)
   - https://cloudconvert.com/png-to-icns (for ICNS)

2. **Or use:** https://www.img2go.com/convert-image
   - Convert SVG → PNG (512x512)
   - Convert PNG → ICO
   - Convert PNG → ICNS

3. Download and place in this `build/` directory

## Automated Script

We've included `generate-icons.sh` to automate this process:

```bash
cd build
./generate-icons.sh
```

## Icon Design

The icon features:
- **Background:** Blue (#0071E3) - Brand color
- **Monitor/TV:** Represents display casting
- **Broadcast Waves:** Represents narrowcasting
- **Chromecast Badge:** Green corner badge showing cast capability
- **Text:** "NARROWCAST PRO" branding

## Customization

To customize the icon:

1. Edit `icon.svg` in any vector editor (Inkscape, Adobe Illustrator, Figma)
2. Keep dimensions at 512x512
3. Export as SVG
4. Run generation script or use online tools

## Requirements by Platform

### macOS (icon.icns)
- Sizes: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
- Each size needs @1x and @2x variant
- Format: Apple Icon Image (.icns)

### Windows (icon.ico)
- Sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- All sizes in one .ico file
- Format: Windows Icon (.ico)

### Linux (icon.png)
- Size: 512x512 PNG with transparency
- Format: PNG

## Electron Configuration

The icons are referenced in:
- `electron/main.js` - Runtime icon
- `package.json` - Build configuration

```javascript
// electron/main.js
icon: path.join(__dirname, '../build/icon.png')

// package.json
"build": {
  "mac": {
    "icon": "build/icon.icns"
  },
  "win": {
    "icon": "build/icon.ico"
  },
  "linux": {
    "icon": "build/icon.png"
  }
}
```

## Testing

After generating icons:

1. **Development:** Icons appear in window title bar and taskbar
2. **Production:** Icons appear in:
   - DMG installer window (Mac)
   - Application icon (Mac Finder, Windows Explorer)
   - Taskbar/Dock
   - Alt-Tab switcher

## Troubleshooting

### Icon not showing in development
- Electron caches icons. Quit and restart the app.
- Delete `~/Library/Caches/electron` (Mac)

### Icon not showing in built app
- Verify icon files exist in `build/` directory
- Check `package.json` build configuration
- Rebuild with `npm run dist:mac` or `npm run dist:win`

### Wrong icon showing
- Clear icon cache: `sudo rm -rf /Library/Caches/com.apple.iconservices.store` (Mac)
- Restart Finder: `killall Finder`

## Professional Icons

For production, consider:
- **Hire a designer** on Fiverr/Upwork ($20-50)
- **Use icon generators:** https://appicon.co/
- **Design tools:** Figma (free), Adobe Illustrator, Affinity Designer

A professional icon should:
- Be recognizable at small sizes (16x16)
- Work on light and dark backgrounds
- Follow platform design guidelines
- Match your brand identity
