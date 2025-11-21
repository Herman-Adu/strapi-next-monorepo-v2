#!/bin/bash

# Migrate from Docker PostgreSQL to local PostgreSQL
# Usage: ./scripts/migrate-from-docker.sh <docker-container-name>

CONTAINER_NAME=$1

if [ -z "$CONTAINER_NAME" ]; then
    echo "Error: Please provide Docker container name"
    echo "Usage: ./scripts/migrate-from-docker.sh <container-name>"
    echo ""
    echo "Available containers:"
    docker ps -a --filter "ancestor=postgres" --format "{{.Names}}"
    exit 1
fi

echo "=== Migrating from Docker PostgreSQL to Local PostgreSQL ==="
echo ""

# Check if container exists
if ! docker ps -a --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "Error: Container '$CONTAINER_NAME' not found"
    exit 1
fi

# Start container if not running
if ! docker ps --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "Starting container..."
    docker start $CONTAINER_NAME
    sleep 3
fi

echo "Step 1: Creating backup from Docker container..."
mkdir -p backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/docker-backup-${TIMESTAMP}.sql"

# Get database name from container (adjust these if needed)
DB_NAME="strapi"
DB_USER="strapi"

docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✓ Backup created: $BACKUP_FILE"
else
    echo "✗ Backup failed. Check container name and database credentials."
    exit 1
fi
echo ""

echo "Step 2: Restoring to local PostgreSQL..."
echo "This will drop and recreate the local database."
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Migration cancelled"
    exit 0
fi

# Drop and recreate local database
dropdb -h localhost -U strapi_user strapi_dev --if-exists
createdb -h localhost -U strapi_user strapi_dev

# Restore backup
psql -h localhost -U strapi_user -d strapi_dev < $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✓ Migration complete!"
    echo ""
    echo "Your data has been migrated from Docker to local PostgreSQL."
    echo "You can now stop the Docker container if no longer needed:"
    echo "  docker stop $CONTAINER_NAME"
else
    echo "✗ Restore failed"
    exit 1
fi
