#!/bin/bash

# Quick migration script for Windows users
# This script does the migration in simple steps

echo "🔄 Quick SQLite to PostgreSQL Migration"
echo ""

# Step 1: Check SQLite
if [ ! -f ".tmp/data.db" ]; then
    echo "❌ No SQLite database found at .tmp/data.db"
    exit 1
fi

echo "✅ Found SQLite database"
echo ""

# Step 2: Backup
echo "📦 Creating backup..."
mkdir -p .tmp/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp .tmp/data.db ".tmp/backups/data-${TIMESTAMP}.db"
echo "✅ Backup created"
echo ""

# Step 3: Export
echo "📤 Exporting from SQLite..."
mkdir -p exports
EXPORT_FILE="exports/migration-${TIMESTAMP}.tar.gz.enc"

# Temporarily switch to SQLite in database config
NODE_ENV=development DATABASE_CLIENT=sqlite DATABASE_FILENAME=.tmp/data.db npm run strapi export -- --file "$EXPORT_FILE"

if [ $? -ne 0 ]; then
    echo "❌ Export failed"
    exit 1
fi

echo "✅ Export complete: $EXPORT_FILE"
echo ""

# Step 4: Import
echo "📥 Importing to PostgreSQL..."
echo "⚠️  Make sure PostgreSQL is running!"
echo ""

npm run strapi import -- --file "$EXPORT_FILE" --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration successful!"
    echo ""
    echo "🎉 Your data has been migrated to PostgreSQL!"
    echo ""
    echo "Start Strapi: npm run develop"
else
    echo "❌ Import failed"
    echo "Export saved at: $EXPORT_FILE"
fi
