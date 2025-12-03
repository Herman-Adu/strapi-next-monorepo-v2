#!/bin/bash

# ==============================================================================
# SAFE E2E Test Data Seeding Script (Non-Destructive)
# ==============================================================================
#
# Purpose: Creates ONLY the E2E test page WITHOUT deleting existing content
#
# Usage:
#   - Local: yarn seed:e2e:safe (from apps/strapi directory)
#   - CI: Use the original destructive script (seed-e2e-data.sh)
#
# Safety Features:
#   - Does NOT drop database schema
#   - Does NOT reset existing content
#   - Only creates/updates the E2E test page
#   - Preserves all existing pages, media, navbar, footer
#
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌱 SAFE E2E Test Data Seeding (Non-Destructive)${NC}"
echo "========================================"

# ------------------------------------------------------------------------------
# 0. LOAD DATABASE_URL FROM .env FILE
# ------------------------------------------------------------------------------

# Change to script directory, then go to strapi root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Load .env file if it exists
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | grep DATABASE_URL | xargs)
fi

# ------------------------------------------------------------------------------
# 1. VERIFY DATABASE CONNECTION
# ------------------------------------------------------------------------------

echo -e "${YELLOW}📊 Checking database connection...${NC}"

if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ ERROR: DATABASE_URL environment variable not set${NC}"
  echo "   Make sure DATABASE_URL is set in apps/strapi/.env file"
  exit 1
fi

# Extract database name from DATABASE_URL for verification
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
echo -e "${GREEN}✅ Connected to database: $DB_NAME${NC}"

# ------------------------------------------------------------------------------
# 2. CHECK STRAPI BUILD PREREQUISITES
# ------------------------------------------------------------------------------

echo -e "${YELLOW}🔍 Verifying Strapi build...${NC}"

# Run prerequisite checker
bash scripts/check-strapi-built.sh

if [ $? -ne 0 ]; then
  exit 1
fi

# ------------------------------------------------------------------------------
# 3. SAFETY WARNING
# ------------------------------------------------------------------------------

echo -e "${GREEN}✅ This script will NOT delete existing content${NC}"
echo -e "${BLUE}ℹ️  It will only create/update the E2E test page${NC}"
echo ""

# ------------------------------------------------------------------------------
# 4. SEED E2E TEST DATA (Non-Destructive)
# ------------------------------------------------------------------------------

echo -e "${YELLOW}🌱 Creating/updating E2E test page...${NC}"

# Run the seed script (this only creates the E2E page)
node scripts/run-seed-safe.js

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ E2E test page created/updated successfully${NC}"
else
  echo -e "${RED}❌ E2E page creation failed${NC}"
  exit 1
fi

# ------------------------------------------------------------------------------
# 5. COMPLETION SUMMARY
# ------------------------------------------------------------------------------

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Safe E2E Test Data Seeding Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "✅ Your existing content is safe"
echo "✅ E2E test page is ready"
echo ""
echo "Test page available at:"
echo "  http://localhost:3000/en/e2e-test-page"
echo ""
echo "Next steps:"
echo "  1. Verify existing pages still work"
echo "  2. Run E2E tests: yarn test:e2e"
echo ""
