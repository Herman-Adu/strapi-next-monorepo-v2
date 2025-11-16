#!/bin/bash
# Database Backup Script for Linux/macOS
# Usage: ./scripts/backup-database.sh

set -e  # Exit on error

# Configuration
DATE=$(date +%Y-%m-%d-%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="strapi-$DATE.sql"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✅ Backup directory ready: $BACKUP_DIR${NC}"

# Validate DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL environment variable not set${NC}"
    echo -e "${YELLOW}   Set it with: export DATABASE_URL='postgresql://user:pass@host:port/db'${NC}"
    exit 1
fi

echo -e "${CYAN}🚀 Starting database backup...${NC}"
echo -e "${GRAY}   Target: $BACKUP_PATH${NC}"

# Run pg_dump
if pg_dump "$DATABASE_URL" > "$BACKUP_PATH"; then
    SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    echo -e "${GREEN}✅ Backup completed successfully!${NC}"
    echo -e "${GRAY}   File: $BACKUP_PATH${NC}"
    echo -e "${GRAY}   Size: $SIZE${NC}"
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi

# Upload to AWS S3 (optional)
if [ "$UPLOAD_TO_S3" = "true" ] && [ -n "$AWS_S3_BACKUP_BUCKET" ]; then
    echo -e "${CYAN}☁️  Uploading to AWS S3...${NC}"
    
    if aws s3 cp "$BACKUP_PATH" "s3://$AWS_S3_BACKUP_BUCKET/backups/$BACKUP_FILE"; then
        echo -e "${GREEN}✅ Uploaded to S3: s3://$AWS_S3_BACKUP_BUCKET/backups/$BACKUP_FILE${NC}"
    else
        echo -e "${YELLOW}⚠️  S3 upload failed (non-critical)${NC}"
    fi
fi

# Cleanup old backups (keep last 30 days)
echo -e "${CYAN}🧹 Cleaning up old backups...${NC}"
find "$BACKUP_DIR" -name "strapi-*.sql" -type f -mtime +30 -exec rm -f {} \; -print | while read -r file; do
    echo -e "${GRAY}   Deleted: $(basename "$file")${NC}"
done

echo -e "${GREEN}🎉 Backup process completed!${NC}"
