#!/bin/bash

# Database backup script for PostgreSQL
# Usage: ./scripts/db-backup.sh [environment]

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="${BACKUP_DIR}/strapi_${ENVIRONMENT}_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Creating backup from ${ENVIRONMENT}..."

# Example for remote database (update with your actual credentials)
# pg_dump -h your-remote-host -U your-user -d your-database > $BACKUP_FILE

# Example for local database
pg_dump -h localhost -U strapi_user -d strapi_dev > $BACKUP_FILE

echo "Backup created: ${BACKUP_FILE}"
echo "To restore: ./scripts/db-restore.sh ${BACKUP_FILE}"
