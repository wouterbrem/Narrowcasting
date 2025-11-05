#!/bin/bash

###############################################################################
# Narrowcast Pro - Super Simpel Installatie & Start Script voor Mac
#
# Dubbelklik dit bestand om Narrowcast Pro te installeren en starten!
# Geen technische kennis nodig!
###############################################################################

# Navigeer naar de juiste map
cd "$(dirname "$0")"

# Kleuren voor output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo ""
echo -e "${BLUE}${BOLD}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}${BOLD}║                                           ║${NC}"
echo -e "${BLUE}${BOLD}║       Narrowcast Pro Installer            ║${NC}"
echo -e "${BLUE}${BOLD}║       Versie 2.1.0                        ║${NC}"
echo -e "${BLUE}${BOLD}║                                           ║${NC}"
echo -e "${BLUE}${BOLD}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}Dit script installeert en start Narrowcast Pro automatisch!${NC}"
echo ""
echo "Druk op Enter om te beginnen (of Ctrl+C om te annuleren)..."
read

# Stap 1: Check Node.js
echo ""
echo -e "${BLUE}→ Stap 1/5: Node.js controleren...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is niet geïnstalleerd!${NC}"
    echo ""
    echo "Node.js is nodig om Narrowcast Pro te runnen."
    echo ""
    echo "Kies een optie:"
    echo "  1) Installeer Node.js automatisch (aanbevolen)"
    echo "  2) Ik installeer het zelf en run dit script opnieuw"
    echo ""
    read -p "Keuze (1 of 2): " choice

    if [ "$choice" = "1" ]; then
        echo ""
        echo -e "${BLUE}→ Node.js installeren via Homebrew...${NC}"

        # Check Homebrew
        if ! command -v brew &> /dev/null; then
            echo -e "${YELLOW}Homebrew is niet geïnstalleerd. Installeren...${NC}"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi

        # Installeer Node.js
        brew install node

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Node.js geïnstalleerd!${NC}"
        else
            echo -e "${RED}✗ Node.js installatie mislukt${NC}"
            echo "Installeer Node.js handmatig van https://nodejs.org"
            echo "Run dit script daarna opnieuw."
            exit 1
        fi
    else
        echo ""
        echo "Download Node.js van: ${BLUE}https://nodejs.org${NC}"
        echo "Kies de LTS versie (de groene knop)"
        echo "Installeer het en run dit script opnieuw."
        exit 0
    fi
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js is geïnstalleerd! (${NODE_VERSION})${NC}"
fi

# Stap 2: Installeer backend dependencies
echo ""
echo -e "${BLUE}→ Stap 2/5: Backend dependencies installeren...${NC}"
echo "Dit kan 2-3 minuten duren..."
if npm install --silent; then
    echo -e "${GREEN}✓ Backend dependencies geïnstalleerd!${NC}"
else
    echo -e "${RED}✗ Backend installatie mislukt${NC}"
    exit 1
fi

# Stap 3: Installeer frontend dependencies
echo ""
echo -e "${BLUE}→ Stap 3/5: Frontend dependencies installeren...${NC}"
echo "Dit kan 2-3 minuten duren..."
cd client
if npm install --silent; then
    echo -e "${GREEN}✓ Frontend dependencies geïnstalleerd!${NC}"
else
    echo -e "${RED}✗ Frontend installatie mislukt${NC}"
    exit 1
fi
cd ..

# Stap 4: Build frontend
echo ""
echo -e "${BLUE}→ Stap 4/5: Frontend bouwen...${NC}"
echo "Dit kan 1-2 minuten duren..."
cd client
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend gebouwd!${NC}"
else
    echo -e "${RED}✗ Frontend build mislukt${NC}"
    exit 1
fi
cd ..

# Stap 5: Start de applicatie
echo ""
echo -e "${BLUE}→ Stap 5/5: Narrowcast Pro starten...${NC}"
echo ""
echo -e "${GREEN}${BOLD}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║                                           ║${NC}"
echo -e "${GREEN}${BOLD}║   Narrowcast Pro is geïnstalleerd! 🎉    ║${NC}"
echo -e "${GREEN}${BOLD}║                                           ║${NC}"
echo -e "${GREEN}${BOLD}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo "De app start nu..."
echo ""
echo "Je browser opent automatisch naar: ${BLUE}http://localhost:3001${NC}"
echo ""
echo -e "${YELLOW}TIP: Laat dit terminal venster OPEN terwijl je de app gebruikt!${NC}"
echo -e "${YELLOW}Om te stoppen: druk Ctrl+C in dit venster${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wacht 3 seconden zodat gebruiker dit kan lezen
sleep 3

# Start Electron app
npm start

echo ""
echo -e "${BLUE}Narrowcast Pro is gestopt.${NC}"
echo "Run dit script opnieuw om de app te starten."
echo ""
