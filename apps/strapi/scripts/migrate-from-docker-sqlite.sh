#!/bin/bash

echo "=== Migrating from Docker SQLite to Local PostgreSQL ==="
echo ""

# Find Docker containers
echo "Looking for Docker containers..."
CONTAINERS=$(docker ps -a --format "{{.Names}}" 2>/dev/null)

if [ -z "$CONTAINERS" ]; then
    echo "❌ No Docker containers found"
    echo "Make sure Docker is running"
    exit 1
fi

echo "Available containers:"
echo "$CONTAINERS"
echo ""

# Try to find Strapi container
STRAPI_CONTAINER=$(docker ps -a --format "{{.Names}}" | grep -i strapi | head -n 1)

if [ -z "$STRAPI_CONTAINER" ]; then
    echo "Enter the name of your Strapi container:"
    read STRAPI_CONTAINER
fi

echo "Using container: $STRAPI_CONTAINER"
echo ""

# Check if container exists
if ! docker ps -a --format "{{.Names}}" | grep -q "^${STRAPI_CONTAINER}$"; then
    echo "❌ Container '$STRAPI_CONTAINER' not found"
    exit 1
fi

# Start container if not running
if ! docker ps --format "{{.Names}}" | grep -q "^${STRAPI_CONTAINER}$"; then
    echo "Starting container..."
    docker start $STRAPI_CONTAINER
    sleep 3
fi

echo "Step 1: Locating SQLite database in container..."
# Common locations for SQLite in Strapi Docker
POSSIBLE_PATHS=(
    "/app/.tmp/data.db"
    "/srv/app/.tmp/data.db"
    "/opt/app/.tmp/data.db"
    "/usr/src/app/.tmp/data.db"
)

DB_PATH=""
for path in "${POSSIBLE_PATHS[@]}"; do
    if docker exec $STRAPI_CONTAINER test -f "$path" 2>/dev/null; then
        DB_PATH=$path
        echo "✅ Found database at: $DB_PATH"
        break
    fi
done

if [ -z "$DB_PATH" ]; then
    echo "❌ SQLite database not found in container"
    echo "Searching for .db files..."
    docker exec $STRAPI_CONTAINER find / -name "*.db" -type f 2>/dev/null | head -10
    exit 1
fi

echo ""
echo "Step 2: Copying SQLite database from Docker container..."
mkdir -p .tmp
docker cp "${STRAPI_CONTAINER}:${DB_PATH}" .tmp/data.db

if [ ! -f ".tmp/data.db" ]; then
    echo "❌ Failed to copy database from container"
    exit 1
fi

echo "✅ Database copied to .tmp/data.db"
DB_SIZE=$(du -h .tmp/data.db | cut -f1)
echo "  Size: $DB_SIZE"
echo ""

echo "Step 3: Creating backup..."
mkdir -p .tmp/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp .tmp/data.db ".tmp/backups/data-${TIMESTAMP}.db"
echo "✅ Backup created: .tmp/backups/data-${TIMESTAMP}.db"
echo ""

echo "Step 4: Exporting data from SQLite..."
mkdir -p exports
EXPORT_FILE="exports/from-docker-sqlite-${TIMESTAMP}.tar.gz.enc"

# Export using SQLite
NODE_ENV=development DATABASE_CLIENT=sqlite DATABASE_FILENAME=.tmp/data.db npm run strapi export -- --file "$EXPORT_FILE"

if [ $? -ne 0 ]; then
    echo "❌ Export failed"
    exit 1
fi

echo "✅ Export complete: $EXPORT_FILE"
echo ""

echo "Step 5: Importing to local PostgreSQL..."
echo "⚠️  Make sure PostgreSQL is running and strapi_dev database exists!"
read -p "Continue with import? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Import paused. Your export is at: $EXPORT_FILE"
    echo "When ready, run: npm run strapi import -- --file $EXPORT_FILE --force"
    exit 0
fi

npm run strapi import -- --file "$EXPORT_FILE" --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration successful!"
    echo ""
    echo "Summary:"
    echo "  - Docker SQLite copied from: ${STRAPI_CONTAINER}:${DB_PATH}"
    echo "  - Local backup: .tmp/backups/data-${TIMESTAMP}.db"
    echo "  - Export file: $EXPORT_FILE"
    echo "  - Imported to: PostgreSQL (strapi_dev)"
    echo ""
    echo "Next steps:"
    echo "  1. Start Strapi: npm run develop"
    echo "  2. Verify data at http://localhost:1337/admin"
    echo "  3. You can now stop the Docker container:"
    echo "     docker stop $STRAPI_CONTAINER"
else
    echo "❌ Import failed"
    echo "Export saved at: $EXPORT_FILE"
fi
