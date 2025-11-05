#!/bin/bash

# Narrowcast Pro - Mac Installation Wizard
# This script will install and configure Narrowcast Pro on macOS

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Welcome message
clear
print_header "Narrowcast Pro Installation Wizard"
echo "This wizard will install Narrowcast Pro on your Mac."
echo "The installation includes:"
echo "  • Node.js dependency check"
echo "  • Server and client installation"
echo "  • Network permissions configuration"
echo "  • Chromecast device discovery setup"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Step 1: Check Node.js
print_header "Step 1: Checking Node.js Installation"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js is installed: $NODE_VERSION"

    # Check if version is >= 14
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR_VERSION" -lt 14 ]; then
        print_error "Node.js version 14 or higher is required"
        print_info "Please visit https://nodejs.org to download the latest version"
        exit 1
    fi
else
    print_error "Node.js is not installed"
    print_info "Please visit https://nodejs.org to download and install Node.js"
    print_info "After installing Node.js, run this script again"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm is installed: v$NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

# Step 2: Install Dependencies
print_header "Step 2: Installing Server Dependencies"
print_info "Installing Node.js packages for the server..."
npm install --production
print_success "Server dependencies installed"

print_header "Step 3: Installing Client Dependencies"
print_info "Installing Node.js packages for the client..."
cd client
npm install --production
cd ..
print_success "Client dependencies installed"

# Step 4: Network Permissions
print_header "Step 4: Network Permissions"
echo "Narrowcast Pro needs access to your local network to:"
echo "  • Discover Chromecast devices on your network"
echo "  • Communicate with Chromecast devices"
echo "  • Stream content to your displays"
echo ""
print_warning "You may see system prompts asking for network access."
print_warning "Please allow network access for Node.js when prompted."
echo ""
read -p "Press Enter to continue..."

# Step 5: Configuration
print_header "Step 5: Configuration"
echo "Let's configure your Narrowcast Pro installation."
echo ""

# Server port
read -p "Server port (default: 3001): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-3001}

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating .env configuration file..."
    cat > .env << EOF
# Narrowcast Pro Server Configuration
PORT=$SERVER_PORT
NODE_ENV=production
LOG_LEVEL=info

# WebSocket Configuration
WS_PORT=$SERVER_PORT

# Client Configuration
CLIENT_PORT=3000
EOF
    print_success ".env file created"
else
    print_warning ".env file already exists, skipping..."
fi

# Create logs directory
mkdir -p logs
print_success "Logs directory created"

# Create uploads directory for branding assets
mkdir -p uploads/branding
print_success "Uploads directory created"

# Step 6: Build Client
print_header "Step 6: Building Client Application"
print_info "Building optimized production client..."
cd client
npm run build
cd ..
print_success "Client built successfully"

# Step 7: Firewall Configuration
print_header "Step 7: Firewall Configuration"
echo "For Narrowcast Pro to work properly, port $SERVER_PORT needs to be accessible."
echo ""
print_warning "You may need to allow Node.js through your firewall:"
print_info "System Preferences → Security & Privacy → Firewall → Firewall Options"
print_info "Make sure 'Node' or 'node' is allowed to accept incoming connections"
echo ""
read -p "Press Enter when you're ready to continue..."

# Step 8: Create start scripts
print_header "Step 8: Creating Start Scripts"

# Create start-server.sh
cat > start-server.sh << 'EOF'
#!/bin/bash
echo "Starting Narrowcast Pro Server..."
node server/index.js
EOF
chmod +x start-server.sh
print_success "Created start-server.sh"

# Create start-all.sh
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "Starting Narrowcast Pro (Server + Client)..."
echo ""
echo "Server will start on port 3001"
echo "Client will be served from server"
echo ""
node server/index.js
EOF
chmod +x start-all.sh
print_success "Created start-all.sh"

# Installation complete
print_header "Installation Complete!"
echo -e "${GREEN}✓ Narrowcast Pro has been successfully installed!${NC}"
echo ""
echo "To start Narrowcast Pro:"
echo -e "  ${BLUE}./start-all.sh${NC}"
echo ""
echo "The application will be available at:"
echo -e "  ${BLUE}http://localhost:$SERVER_PORT${NC}"
echo ""
echo "To discover Chromecasts, make sure:"
echo "  • Your Mac and Chromecasts are on the same network"
echo "  • Firewall allows Node.js to accept connections"
echo "  • Network access is granted when prompted"
echo ""
echo "Logs will be stored in: ./logs/"
echo ""
read -p "Would you like to start Narrowcast Pro now? (y/n): " START_NOW
if [[ $START_NOW =~ ^[Yy]$ ]]; then
    echo ""
    print_info "Starting Narrowcast Pro..."
    ./start-all.sh
else
    echo ""
    print_info "You can start Narrowcast Pro anytime by running: ./start-all.sh"
fi
