#!/bin/bash

# Narrowcast Pro Icon Generator
# Generates all required icon formats from SVG source

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}Narrowcast Pro - Icon Generator${NC}"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "icon.svg" ]; then
    echo -e "${RED}Error: icon.svg not found${NC}"
    echo "Please run this script from the build/ directory"
    exit 1
fi

# Check for ImageMagick
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick not found${NC}"
    echo ""
    echo "Please install ImageMagick:"
    echo "  Mac:    brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Windows: choco install imagemagick"
    echo ""
    echo "Or use online tools (see ICON_README.md)"
    exit 1
fi

echo -e "${BLUE}→ Generating PNG (512x512)...${NC}"
convert icon.svg -resize 512x512 -background none icon.png
echo -e "${GREEN}✓ icon.png created${NC}"

echo ""
echo -e "${BLUE}→ Generating Windows ICO (multi-size)...${NC}"
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
echo -e "${GREEN}✓ icon.ico created${NC}"

echo ""
echo -e "${BLUE}→ Generating macOS ICNS...${NC}"

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Use sips (macOS built-in) and iconutil
    echo "  Creating iconset..."
    mkdir -p icon.iconset

    sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png > /dev/null 2>&1
    sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png > /dev/null 2>&1
    sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png > /dev/null 2>&1
    sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png > /dev/null 2>&1
    sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png > /dev/null 2>&1
    sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png > /dev/null 2>&1
    sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png > /dev/null 2>&1
    sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png > /dev/null 2>&1
    sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png > /dev/null 2>&1
    cp icon.png icon.iconset/icon_512x512@2x.png

    echo "  Converting to ICNS..."
    iconutil -c icns icon.iconset

    echo "  Cleaning up..."
    rm -rf icon.iconset

    echo -e "${GREEN}✓ icon.icns created${NC}"
else
    # Not on macOS, try png2icns if available
    if command -v png2icns &> /dev/null; then
        png2icns icon.icns icon.png
        echo -e "${GREEN}✓ icon.icns created${NC}"
    else
        echo -e "${RED}✗ Cannot create ICNS on non-macOS without png2icns${NC}"
        echo "  Install: brew install libicns (Mac only)"
        echo "  Or use online converter: https://cloudconvert.com/png-to-icns"
    fi
fi

echo ""
echo -e "${GREEN}=================================="
echo "✓ Icon generation complete!${NC}"
echo ""
echo "Generated files:"
ls -lh icon.png icon.ico 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
[ -f icon.icns ] && ls -lh icon.icns | awk '{print "  " $9 " (" $5 ")"}'
echo ""
echo "Next steps:"
echo "  1. Review the icons"
echo "  2. Build the app: npm run dist:mac (or dist:win)"
echo "  3. Icons will be embedded in the installer"
echo ""
