#!/bin/bash

# ==============================================================================
# SQL Snapshot Restore
# ==============================================================================
#
# Purpose: Quickly restores E2E test data from SQL snapshot
#
# Usage:
#   yarn db:restore-snapshot
#
# Speed: ~5-10 seconds (vs 30-60s for full factory seeding)
#
# Note: Snapshot must exist (create with `yarn db:snapshot`)
#
# ==============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}⚡ SQL Snapshot Restore (Fast)${NC}"
echo "========================================"

# Verify DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ ERROR: DATABASE_URL not set${NC}"
  exit 1
fi

SNAPSHOT_FILE="tests/fixtures/e2e-test-data.sql"

# Check if snapshot exists
if [ ! -f "$SNAPSHOT_FILE" ]; then
  echo -e "${RED}❌ ERROR: Snapshot not found: $SNAPSHOT_FILE${NC}"
  echo ""
  echo "Create snapshot first:"
  echo "  yarn seed:e2e"
  echo "  yarn db:snapshot"
  exit 1
fi

# Reset database
echo -e "${YELLOW}🗑️  Resetting database...${NC}"
psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;" > /dev/null 2>&1

# Run migrations
echo -e "${YELLOW}🔄 Running migrations...${NC}"
NODE_ENV=production yarn strapi db:migrate > /dev/null 2>&1

# Restore snapshot
echo -e "${YELLOW}⚡ Restoring snapshot...${NC}"
psql "$DATABASE_URL" < "$SNAPSHOT_FILE" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Snapshot restored successfully!${NC}"
else
  echo -e "${RED}❌ Snapshot restore failed${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Database Ready for E2E Tests!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Test page: http://localhost:3000/en/e2e-test-page"
echo ""
