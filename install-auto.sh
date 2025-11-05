#!/bin/bash

# Narrowcast Pro - Automatische Installatie Script
# Voor Mac en Linux - Installeert alles automatisch!

set -e

# Kleuren
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Header
clear
echo ""
echo -e "${BLUE}${BOLD}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}${BOLD}║   Narrowcast Pro - Auto Installer     ║${NC}"
echo -e "${BLUE}${BOLD}║            Versie 2.1.0                ║${NC}"
echo -e "${BLUE}${BOLD}╔════════════════════════════════════════╗${NC}"
echo ""
echo -e "${BOLD}Deze installer doet alles automatisch voor je!${NC}"
echo ""
echo -e "Het installeert:"
echo -e "  ✓ Node.js dependencies"
echo -e "  ✓ React frontend"
echo -e "  ✓ Electron app"
echo -e "  ✓ Build de complete app"
echo ""
read -p "Druk op Enter om te starten of Ctrl+C om te stoppen..."

# Check OS
echo ""
echo -e "${BLUE}→ Checking operating system...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
    echo -e "${GREEN}✓ macOS detected${NC}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    echo -e "${GREEN}✓ Linux detected${NC}"
else
    echo -e "${RED}✗ Unsupported OS: $OSTYPE${NC}"
    echo "This script only works on Mac and Linux"
    exit 1
fi

# Check Node.js
echo ""
echo -e "${BLUE}→ Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo ""
    echo "Please install Node.js first:"
    echo "  → Visit: https://nodejs.org"
    echo "  → Download the LTS version"
    echo "  → Install and run this script again"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm v${NPM_VERSION} found${NC}"

# Install backend dependencies
echo ""
echo -e "${BLUE}→ Installing backend dependencies...${NC}"
echo "  (This may take a few minutes)"
npm install --silent > /dev/null 2>&1
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Install frontend dependencies
echo ""
echo -e "${BLUE}→ Installing frontend dependencies...${NC}"
echo "  (This may take a few minutes)"
cd client
npm install --silent > /dev/null 2>&1
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Build frontend
echo ""
echo -e "${BLUE}→ Building React frontend...${NC}"
echo "  (This may take a minute)"
npm run build > /dev/null 2>&1
cd ..
echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Create necessary directories
echo ""
echo -e "${BLUE}→ Creating directories...${NC}"
mkdir -p data logs uploads/branding uploads/temp build
echo -e "${GREEN}✓ Directories created${NC}"

# Build the app
echo ""
echo -e "${BOLD}${BLUE}→ Building Narrowcast Pro app...${NC}"
echo "  (This will take 2-5 minutes)"
echo ""

if [[ "$OS" == "mac" ]]; then
    echo "  Building for macOS..."
    npm run dist:mac 2>&1 | grep -E "(Packaging|Building|packaging|building)" || true

    if [ -d "dist/mac/Narrowcast Pro.app" ]; then
        echo ""
        echo -e "${GREEN}${BOLD}✓ macOS app built successfully!${NC}"
        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║          🎉 INSTALLATION COMPLETE! 🎉     ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
        echo ""
        echo "Your app is ready at:"
        echo -e "  ${BOLD}dist/mac/Narrowcast Pro.app${NC}"
        echo ""
        echo "To install:"
        echo "  1. Open Finder"
        echo "  2. Go to dist/mac/"
        echo "  3. Drag 'Narrowcast Pro.app' to your Applications folder"
        echo ""
        echo "Or run this command to copy it now:"
        echo -e "  ${YELLOW}cp -r \"dist/mac/Narrowcast Pro.app\" /Applications/${NC}"
        echo ""
        read -p "Copy to Applications now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp -r "dist/mac/Narrowcast Pro.app" /Applications/
            echo -e "${GREEN}✓ Copied to Applications!${NC}"
            echo ""
            echo "To launch:"
            echo "  1. Go to Applications"
            echo "  2. Right-click 'Narrowcast Pro'"
            echo "  3. Click 'Open'"
            echo "  4. Click 'Open' again in the warning"
            echo ""
        fi
    else
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
else
    echo "  Building for Linux..."
    npm run dist 2>&1 | grep -E "(Packaging|Building|packaging|building)" || true

    if [ -f "dist/Narrowcast Pro-2.1.0.AppImage" ]; then
        echo ""
        echo -e "${GREEN}${BOLD}✓ Linux app built successfully!${NC}"
        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║          🎉 INSTALLATION COMPLETE! 🎉     ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
        echo ""
        echo "Your app is ready at:"
        echo -e "  ${BOLD}dist/Narrowcast Pro-2.1.0.AppImage${NC}"
        echo ""
        echo "To run:"
        echo "  1. Make it executable:"
        echo -e "     ${YELLOW}chmod +x \"dist/Narrowcast Pro-2.1.0.AppImage\"${NC}"
        echo "  2. Double-click or run:"
        echo -e "     ${YELLOW}./dist/Narrowcast\ Pro-2.1.0.AppImage${NC}"
        echo ""
    else
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
fi

echo "For more info, see:"
echo "  → INSTALL.md - Installation guide"
echo "  → README.md - Full documentation"
echo "  → QUICK_START.md - Quick start guide"
echo ""
echo -e "${BOLD}Enjoy Narrowcast Pro!${NC} 🚀"
echo ""
