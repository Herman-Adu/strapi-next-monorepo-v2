#!/bin/bash

# ==============================================================================
# E2E Test Data Seeding Script
# ==============================================================================
#
# Purpose: Seeds database with test data required for Playwright E2E tests
#
# Usage:
#   - Local: yarn seed:e2e (from apps/strapi directory)
#   - CI: Called automatically before E2E tests run
#
# Requirements:
#   - PostgreSQL database running (Docker or local)
#   - Strapi built (yarn build:strapi)
#   - Environment variables configured
#
# What it does:
#   1. Resets database (drops all tables, recreates schema)
#   2. Runs Strapi migrations
#   3. Creates E2E test page with Newsletter, FAQ, Contact sections
#   4. Verifies data was created successfully
#
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌱 E2E Test Data Seeding${NC}"
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
# 3. RESET DATABASE (CLEAN SLATE)
# ------------------------------------------------------------------------------

# Safety check: Prevent accidental production database wipes
if [[ ! "$DB_NAME" =~ (test|dev|e2e) ]] && [ "$CI" != "true" ]; then
  echo -e "${RED}⚠️  WARNING: You are about to DELETE ALL DATA from database: $DB_NAME${NC}"
  echo -e "${RED}⚠️  This does not appear to be a test/dev database.${NC}"
  read -p "Type 'yes' to confirm deletion (or anything else to cancel): " -r
  if [[ ! "$REPLY" == "yes" ]]; then
    echo -e "${YELLOW}❌ Operation cancelled by user${NC}"
    exit 1
  fi
fi

echo -e "${YELLOW}🗑️  Resetting database (drop + recreate schema)...${NC}"

# Extract credentials from DATABASE_URL
DB_USER=$(echo "$DATABASE_URL" | sed -n 's|.*://\([^:]*\):.*|\1|p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):.*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')

# Set PostgreSQL password for psql commands
export PGPASSWORD="$DB_PASS"

# Drop public schema and recreate (PostgreSQL) with credentials from DATABASE_URL
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Database reset complete${NC}"
else
  echo -e "${RED}❌ Database reset failed${NC}"
  echo "   Make sure PostgreSQL is running and DATABASE_URL is correct"
  exit 1
fi

# ------------------------------------------------------------------------------
# 4. SEED E2E TEST DATA (Schema will be created by strapi import)
# ------------------------------------------------------------------------------

echo -e "${YELLOW}🌱 Seeding E2E test data...${NC}"
echo -e "${BLUE}ℹ️  Note: Database schema will be created automatically by strapi import${NC}"

# Run the seed script (verification happens inside the seed function)
node scripts/run-seed.js

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Seeding complete${NC}"
else
  echo -e "${RED}❌ Seeding failed${NC}"
  exit 1
fi

# ------------------------------------------------------------------------------
# 6. COMPLETION SUMMARY
# ------------------------------------------------------------------------------

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 E2E Test Data Seeding Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Test page available at:"
echo "  http://localhost:3000/en/e2e-test-page"
echo ""
echo "Next steps:"
echo "  1. Start Strapi: yarn dev:strapi"
echo "  2. Start UI: yarn dev:ui"
echo "  3. Run E2E tests: yarn test:e2e"
echo ""
echo "💡 TIP: Create SQL snapshot for faster resets:"
echo "   yarn db:snapshot"
echo ""
