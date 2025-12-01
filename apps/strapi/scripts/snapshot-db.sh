#!/bin/bash

# ==============================================================================
# SQL Snapshot Generator
# ==============================================================================
#
# Purpose: Creates SQL snapshot after E2E test data seeding for fast local resets
#
# Usage:
#   1. Seed data: yarn seed:e2e
#   2. Generate snapshot: yarn db:snapshot
#   3. Later restore: yarn db:restore-snapshot
#
# Why use snapshots?
#   - Factory scripts: 30-60s to seed (maintainable, version-controlled)
#   - SQL snapshots: 5-10s to restore (fast, good for local dev)
#   - Hybrid approach: Best of both worlds!
#
# ==============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📸 SQL Snapshot Generator${NC}"
echo "========================================"

# Verify DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ ERROR: DATABASE_URL not set${NC}"
  exit 1
fi

# Create fixtures directory if it doesn't exist
FIXTURES_DIR="tests/fixtures"
mkdir -p "$FIXTURES_DIR"

SNAPSHOT_FILE="$FIXTURES_DIR/e2e-test-data.sql"

echo -e "${YELLOW}📊 Creating SQL snapshot...${NC}"

# Use pg_dump to create snapshot (data only, specific tables)
pg_dump "$DATABASE_URL" \
  --data-only \
  --inserts \
  --column-inserts \
  --no-owner \
  --no-privileges \
  --file="$SNAPSHOT_FILE" \
  2>/dev/null

if [ $? -eq 0 ]; then
  SNAPSHOT_SIZE=$(du -h "$SNAPSHOT_FILE" | cut -f1)
  echo -e "${GREEN}✅ Snapshot created: $SNAPSHOT_FILE${NC}"
  echo -e "${GREEN}   Size: $SNAPSHOT_SIZE${NC}"
else
  echo -e "${RED}❌ Snapshot creation failed${NC}"
  exit 1
fi

# Create README for snapshot
cat > "$FIXTURES_DIR/README.md" << 'EOF'
# E2E Test Data Fixtures

## SQL Snapshot

This directory contains SQL snapshots of E2E test data for fast local resets.

### Files

- `e2e-test-data.sql` - SQL dump of E2E test page and sections

### Usage

**Generate snapshot (after seeding):**
```bash
yarn seed:e2e  # Create test data using factory script
yarn db:snapshot  # Generate SQL snapshot
```

**Restore snapshot (fast local reset):**
```bash
yarn db:restore-snapshot  # Restore from SQL (5-10 seconds)
```

**When to regenerate:**
- After changing test data structure in `database/seeds/e2e-test-data.ts`
- After updating component schemas
- After adding new test sections

### Hybrid Approach

We use both factory scripts and SQL snapshots:

- **Factory scripts** (`database/seeds/e2e-test-data.ts`):
  - Source of truth
  - Maintainable (TypeScript code)
  - Version controlled
  - Used in CI/CD
  - Slower (~30-60s)

- **SQL snapshots** (`tests/fixtures/e2e-test-data.sql`):
  - Generated from factory scripts
  - Fast restore (~5-10s)
  - Good for local development
  - Not version controlled (git-ignored)

This gives us maintainability + speed!
EOF

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Snapshot Created Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Snapshot location:"
echo "  $SNAPSHOT_FILE"
echo ""
echo "To restore this snapshot:"
echo "  yarn db:restore-snapshot"
echo ""
echo "💡 TIP: Regenerate snapshot after changing test data"
echo ""
