#!/bin/bash

# ==============================================================================
# Strapi Build Prerequisite Checker
# ==============================================================================
#
# Purpose: Verifies Strapi has been built before running seed scripts
#
# Usage: Called automatically by seed scripts
#
# Exit codes:
#   0 - Build exists and is ready
#   1 - Build missing or incomplete
#
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Change to Strapi directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo -e "${RED}❌ Strapi build not found${NC}"
  echo ""
  echo "The 'dist' directory doesn't exist. Strapi needs to be built first."
  echo ""
  echo "Run one of the following commands:"
  echo "  ${YELLOW}yarn build${NC}        - Build Strapi for production"
  echo "  ${YELLOW}yarn develop${NC}      - Build and start in development mode"
  echo ""
  exit 1
fi

# Check if essential build artifacts exist
REQUIRED_PATHS=(
  "dist/build"
  "dist/config"
  "dist/src"
)

MISSING_PATHS=()

for path in "${REQUIRED_PATHS[@]}"; do
  if [ ! -e "$path" ]; then
    MISSING_PATHS+=("$path")
  fi
done

if [ ${#MISSING_PATHS[@]} -gt 0 ]; then
  echo -e "${RED}❌ Incomplete Strapi build detected${NC}"
  echo ""
  echo "The following required paths are missing:"
  for path in "${MISSING_PATHS[@]}"; do
    echo "  - $path"
  done
  echo ""
  echo "Please run: ${YELLOW}yarn build${NC}"
  echo ""
  exit 1
fi

# All checks passed
echo -e "${GREEN}✅ Strapi build verified${NC}"
exit 0
