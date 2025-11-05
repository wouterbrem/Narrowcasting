#!/bin/bash

###############################################################################
# Narrowcast Pro - Release Preparation Script
# Prepares a new release with version bump and tag creation
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Header
clear
echo ""
echo -e "${BLUE}${BOLD}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}${BOLD}║   Narrowcast Pro - Release Prep       ║${NC}"
echo -e "${BLUE}${BOLD}╚════════════════════════════════════════╝${NC}"
echo ""

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BOLD}Current version:${NC} v${CURRENT_VERSION}"
echo ""

# Ask for new version
echo -e "${YELLOW}Enter new version (e.g., 2.2.0):${NC}"
read NEW_VERSION

# Validate version format
if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Error: Invalid version format. Use X.Y.Z (e.g., 2.2.0)${NC}"
  exit 1
fi

echo ""
echo -e "${BOLD}Preparing release v${NEW_VERSION}...${NC}"
echo ""

# Update package.json
echo -e "${BLUE}→ Updating package.json...${NC}"
sed -i.bak "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" package.json
rm package.json.bak
echo -e "${GREEN}✓ Updated package.json${NC}"

# Update client/package.json
echo -e "${BLUE}→ Updating client/package.json...${NC}"
sed -i.bak "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" client/package.json
rm client/package.json.bak
echo -e "${GREEN}✓ Updated client/package.json${NC}"

# Show changes
echo ""
echo -e "${BOLD}Changes made:${NC}"
git diff package.json client/package.json | grep "version"
echo ""

# Confirm
echo -e "${YELLOW}Ready to commit and tag?${NC} (y/n)"
read CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo -e "${RED}Aborted. Reverting changes...${NC}"
  git checkout package.json client/package.json
  exit 1
fi

# Commit
echo ""
echo -e "${BLUE}→ Committing changes...${NC}"
git add package.json client/package.json
git commit -m "Bump version to ${NEW_VERSION}"
echo -e "${GREEN}✓ Committed${NC}"

# Create tag
echo -e "${BLUE}→ Creating tag v${NEW_VERSION}...${NC}"
git tag "v${NEW_VERSION}"
echo -e "${GREEN}✓ Tag created${NC}"

# Push
echo ""
echo -e "${YELLOW}Push to remote?${NC} (y/n)"
read PUSH_CONFIRM

if [ "$PUSH_CONFIRM" = "y" ]; then
  echo -e "${BLUE}→ Pushing to remote...${NC}"

  # Get current branch
  BRANCH=$(git branch --show-current)

  # Push commit and tag
  git push origin "$BRANCH"
  git push origin "v${NEW_VERSION}"

  echo -e "${GREEN}✓ Pushed to remote${NC}"
  echo ""
  echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}${GREEN}   Release v${NEW_VERSION} initiated!${NC}"
  echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${BOLD}What happens next:${NC}"
  echo ""
  echo -e "  1. ${BLUE}GitHub Actions${NC} will start building installers"
  echo -e "  2. Mac build: ~10 minutes"
  echo -e "  3. Windows build: ~8 minutes"
  echo -e "  4. GitHub Release created automatically"
  echo ""
  echo -e "${BOLD}Monitor progress:${NC}"
  echo -e "  ${BLUE}https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions${NC}"
  echo ""
  echo -e "${BOLD}View release when ready:${NC}"
  echo -e "  ${BLUE}https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/releases${NC}"
  echo ""
else
  echo ""
  echo -e "${YELLOW}Not pushed to remote.${NC}"
  echo ""
  echo -e "To push later:"
  echo -e "  ${BOLD}git push origin $BRANCH${NC}"
  echo -e "  ${BOLD}git push origin v${NEW_VERSION}${NC}"
  echo ""
fi

echo -e "${GREEN}Done!${NC}"
echo ""
