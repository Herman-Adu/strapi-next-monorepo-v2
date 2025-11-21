#!/bin/bash

echo "=== Migrating from SQLite to PostgreSQL ==="
echo ""

# Check if SQLite database exists
if [ ! -f ".tmp/data.db" ]; then
    echo "❌ Error: SQLite database not found at .tmp/data.db"
    echo "Please make sure you're in the Strapi app directory"
    exit 1
fi

echo "✓ Found SQLite database at .tmp/data.db"
DB_SIZE=$(du -h .tmp/data.db 2>/dev/null | cut -f1 || echo "unknown")
echo "  Database size: $DB_SIZE"
echo ""

echo "Step 1: Backing up current SQLite database..."
BACKUP_DIR=".tmp/backups"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp .tmp/data.db "${BACKUP_DIR}/data-${TIMESTAMP}.db"
echo "✓ Backup created: ${BACKUP_DIR}/data-${TIMESTAMP}.db"
echo ""

echo "Step 2: Creating temporary .env for SQLite export..."
# Save current .env
cp .env .env.postgres.backup

# Create temporary .env with SQLite config
cat > .env.sqlite.temp << 'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=l8ftzyp2hNmEtNXBYU5hhQ==,lH7EcVVZxIoTFRorjrV9Vw==,jxWii7EjavRgJ4jYPZ60hA==,FlZM4tyij/HDFcKZhsmlXQ==
API_TOKEN_SALT=usReW/cYjLHmpLEoRnWf+g==
ADMIN_JWT_SECRET=Xw39b/xXxEHW1x1WMM6ugQ==
JWT_SECRET=ShuOcfjTi/RwcchWEIKYKA==
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
EOF

echo "✓ Temporary SQLite config created"
echo ""

echo "Step 3: Exporting data from SQLite..."
mkdir -p exports
EXPORT_FILE="exports/from-sqlite-${TIMESTAMP}.tar.gz.enc"

# Use the SQLite config for export
mv .env .env.temp
mv .env.sqlite.temp .env

npm run strapi export -- --file $EXPORT_FILE

EXPORT_STATUS=$?

# Restore PostgreSQL .env
mv .env .env.sqlite.temp
mv .env.temp .env

if [ $EXPORT_STATUS -ne 0 ]; then
    echo "❌ Export failed!"
    echo "Restoring original .env..."
    rm -f .env.sqlite.temp
    exit 1
fi

echo "✓ Export successful: $EXPORT_FILE"
echo ""

echo "Step 4: Preparing PostgreSQL database..."
echo "Make sure PostgreSQL is running and strapi_dev database exists."
read -p "Is PostgreSQL ready? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Migration paused. Your export file is saved at: $EXPORT_FILE"
    echo "When ready, import with: npm run strapi import -- --file $EXPORT_FILE --force"
    exit 0
fi

echo ""
echo "Step 5: Importing data to PostgreSQL..."
echo "⚠️  This will overwrite any existing data in PostgreSQL!"
read -p "Continue with import? (yes/no): " confirm_import

if [ "$confirm_import" != "yes" ]; then
    echo "Import cancelled. Your export file is saved at: $EXPORT_FILE"
    echo "When ready, import with: npm run strapi import -- --file $EXPORT_FILE --force"
    exit 0
fi

npm run strapi import -- --file $EXPORT_FILE --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration complete!"
    echo ""
    echo "Summary:"
    echo "  - SQLite backup: ${BACKUP_DIR}/data-${TIMESTAMP}.db"
    echo "  - Export file: $EXPORT_FILE"
    echo "  - Data imported to: PostgreSQL (strapi_dev)"
    echo ""
    echo "Next steps:"
    echo "  1. Start Strapi: npm run develop"
    echo "  2. Verify your data at http://localhost:1337/admin"
    echo "  3. If everything looks good, you can delete .tmp/data.db"
else
    echo "❌ Import failed!"
    echo "Your data is safe in the export file: $EXPORT_FILE"
    echo "Check the error above and try importing manually:"
    echo "  npm run strapi import -- --file $EXPORT_FILE --force"
fi

# Cleanup temp files
rm -f .env.sqlite.temp .env.postgres.backup
