#!/bin/bash

###############################################################################
# Installer Graphics Generation Script
# Generates all required graphics for Windows NSIS and Mac DMG installers
###############################################################################

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "Installer Graphics Generator"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for required tools
check_tool() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}✗ $1 not found${NC}"
    return 1
  else
    echo -e "${GREEN}✓ $1 found${NC}"
    return 0
  fi
}

echo "Checking for required tools..."
HAVE_CONVERT=false
HAVE_INKSCAPE=false

if check_tool "convert"; then
  HAVE_CONVERT=true
fi

if check_tool "inkscape"; then
  HAVE_INKSCAPE=true
fi

if ! $HAVE_CONVERT && ! $HAVE_INKSCAPE; then
  echo -e "${RED}ERROR: Neither ImageMagick nor Inkscape found!${NC}"
  echo ""
  echo "Please install one of the following:"
  echo ""
  echo "  ImageMagick (recommended):"
  echo "    macOS:  brew install imagemagick"
  echo "    Ubuntu: sudo apt-get install imagemagick"
  echo ""
  echo "  Inkscape (alternative):"
  echo "    macOS:  brew install inkscape"
  echo "    Ubuntu: sudo apt-get install inkscape"
  echo ""
  exit 1
fi

echo ""
echo "=========================================="
echo "Generating Graphics..."
echo "=========================================="
echo ""

# Function to convert SVG using available tool
convert_svg() {
  local input="$1"
  local output="$2"
  local width="$3"
  local height="$4"

  if [ ! -f "$input" ]; then
    echo -e "${RED}✗ Source file not found: $input${NC}"
    return 1
  fi

  echo "Converting: $input → $output"

  if $HAVE_CONVERT; then
    # Use ImageMagick
    convert "$input" -resize "${width}x${height}" -background none "$output"
  elif $HAVE_INKSCAPE; then
    # Use Inkscape
    inkscape "$input" --export-filename="$output" --export-width="$width" --export-height="$height"
  fi

  if [ $? -eq 0 ] && [ -f "$output" ]; then
    local size=$(du -h "$output" | cut -f1)
    echo -e "${GREEN}✓ Created: $output ($size)${NC}"
    return 0
  else
    echo -e "${RED}✗ Failed to create: $output${NC}"
    return 1
  fi
}

# Generate Windows NSIS graphics
echo "1. Generating NSIS Installer Sidebar (164x314)..."
convert_svg "installerSidebar.svg" "installerSidebar.bmp" 164 314
echo ""

echo "2. Generating NSIS Installer Header (150x57)..."
convert_svg "installerHeader.svg" "installerHeader.bmp" 150 57
echo ""

# Generate Mac DMG background
echo "3. Generating DMG Background (560x400)..."
convert_svg "dmg-background.svg" "dmg-background.png" 560 400
echo ""

# Also generate @2x version for Retina displays
echo "4. Generating DMG Background @2x (1120x800)..."
convert_svg "dmg-background.svg" "dmg-background@2x.png" 1120 800
echo ""

# Generate app icons if icon.svg exists
if [ -f "icon.svg" ]; then
  echo "5. Generating app icons..."

  # Generate PNG versions
  echo "   - icon.png (512x512)..."
  convert_svg "icon.svg" "icon.png" 512 512

  echo "   - icon@2x.png (1024x1024)..."
  convert_svg "icon.svg" "icon@2x.png" 1024 1024

  # Generate Windows ICO
  if $HAVE_CONVERT; then
    echo "   - icon.ico (multi-size)..."
    convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ Created: icon.ico${NC}"
    fi
  fi

  # Generate Mac ICNS (if on macOS)
  if [[ "$OSTYPE" == "darwin"* ]] && command -v iconutil &> /dev/null; then
    echo "   - icon.icns (Mac icon set)..."

    # Create iconset directory
    mkdir -p icon.iconset

    # Generate all required sizes
    sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png &> /dev/null
    sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png &> /dev/null
    sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png &> /dev/null
    sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png &> /dev/null
    sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png &> /dev/null
    sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png &> /dev/null
    sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png &> /dev/null
    sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png &> /dev/null
    sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png &> /dev/null
    sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png &> /dev/null

    # Convert to ICNS
    iconutil -c icns icon.iconset

    # Clean up
    rm -rf icon.iconset

    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ Created: icon.icns${NC}"
    fi
  fi

  echo ""
fi

echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""

# List all generated files
echo "Generated files:"
ls -lh *.bmp *.png *.ico *.icns 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'

echo ""
echo -e "${GREEN}✓ All graphics generated successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review the generated graphics"
echo "  2. Build installers: npm run dist:mac or npm run dist:win"
echo "  3. Test the installers on target platforms"
echo ""
echo "=========================================="
