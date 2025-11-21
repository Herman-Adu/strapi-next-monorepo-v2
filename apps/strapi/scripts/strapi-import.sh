#!/bin/bash

# Import Strapi data using the transfer feature
# Usage: ./scripts/strapi-import.sh <export-file>

EXPORT_FILE=$1

if [ -z "$EXPORT_FILE" ]; then
    echo "Error: Please provide an export file"
    echo "Usage: ./scripts/strapi-import.sh <export-file>"
    exit 1
fi

if [ ! -f "$EXPORT_FILE" ]; then
    echo "Error: Export file not found: $EXPORT_FILE"
    exit 1
fi

echo "WARNING: This will overwrite existing content!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Import cancelled"
    exit 0
fi

echo "Importing Strapi data from: ${EXPORT_FILE}..."

npm run strapi import -- --file $EXPORT_FILE --force

echo "Import complete!"
