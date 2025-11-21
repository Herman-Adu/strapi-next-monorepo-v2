#!/bin/bash

# Database restore script for PostgreSQL
# Usage: ./scripts/db-restore.sh <backup-file>

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Error: Please provide a backup file"
    echo "Usage: ./scripts/db-restore.sh <backup-file>"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "WARNING: This will drop and recreate the local database!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo "Dropping existing database..."
dropdb -h localhost -U strapi_user strapi_dev --if-exists

echo "Creating new database..."
createdb -h localhost -U strapi_user strapi_dev

echo "Restoring from backup: ${BACKUP_FILE}..."
psql -h localhost -U strapi_user -d strapi_dev < $BACKUP_FILE

echo "Restore complete!"
