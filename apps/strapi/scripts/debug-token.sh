#!/bin/bash

# ==============================================================================
# Token Debugging Script
# ==============================================================================
# Helps diagnose API token authentication issues by:
# 1. Checking if token exists in database
# 2. Comparing hash formats
# 3. Testing API authentication
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 API Token Debugging${NC}"
echo "========================================"

# Check for required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ DATABASE_URL not set${NC}"
  exit 1
fi

if [ -z "$E2E_API_TOKEN" ]; then
  echo -e "${RED}❌ E2E_API_TOKEN not set${NC}"
  exit 1
fi

# Extract database password from URL or use secret
if [ -n "$E2E_DB_PASSWORD" ]; then
  export PGPASSWORD="$E2E_DB_PASSWORD"
fi

echo -e "\n${YELLOW}1. Checking database for API token...${NC}"
TOKEN_INFO=$(psql "$DATABASE_URL" -t -c "SELECT name, type, LEFT(\"accessKey\", 20) as hash_prefix, LENGTH(\"accessKey\") as hash_length, expires_at FROM admin_api_tokens WHERE name='e2e-readonly-token';" 2>&1)

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Database query failed:${NC}"
  echo "$TOKEN_INFO"
  exit 1
fi

if [ -z "$TOKEN_INFO" ] || [ "$TOKEN_INFO" = "" ]; then
  echo -e "${RED}❌ No token found in database with name 'e2e-readonly-token'${NC}"
  echo -e "${YELLOW}💡 Run seed script first: yarn seed:e2e${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token found in database:${NC}"
echo "$TOKEN_INFO"

echo -e "\n${YELLOW}2. Computing expected hash from E2E_API_TOKEN...${NC}"
# Use Node.js to compute SHA512 hash (same as seed script)
EXPECTED_HASH=$(node -e "
const crypto = require('crypto');
const token = process.env.E2E_API_TOKEN;
const hash = crypto.createHash('sha512').update(token).digest('base64');
console.log('Full hash:', hash);
console.log('Prefix:', hash.substring(0, 20));
console.log('Length:', hash.length);
")

echo "$EXPECTED_HASH"

echo -e "\n${YELLOW}3. Testing API authentication...${NC}"
API_RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $E2E_API_TOKEN" http://127.0.0.1:1337/api/pages 2>&1)
HTTP_CODE=$(echo "$API_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$API_RESPONSE" | sed '$d')

echo -e "HTTP Status: ${HTTP_CODE}"

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Authentication successful!${NC}"
else
  echo -e "${RED}❌ Authentication failed${NC}"
  echo -e "Response: $RESPONSE_BODY"
fi

echo -e "\n${BLUE}======================================${NC}"
echo -e "${YELLOW}💡 Debugging tips:${NC}"
echo -e "  - Compare 'hash_prefix' from database with 'Prefix' from computed hash"
echo -e "  - They should match exactly"
echo -e "  - If they don't match, E2E_API_TOKEN value is different from seeded token"
echo -e "  - Check GitHub Secrets match the token value used in seed"
