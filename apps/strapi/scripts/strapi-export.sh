#!/bin/bash

# Export Strapi data using the transfer feature
# Usage: ./scripts/strapi-export.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_DIR="./exports"
EXPORT_FILE="${EXPORT_DIR}/strapi-export-${TIMESTAMP}.tar.gz"

mkdir -p $EXPORT_DIR

echo "Exporting Strapi data..."

# Export all data including media files
npm run strapi export -- --file $EXPORT_FILE --no-encrypt

echo "Export complete: ${EXPORT_FILE}"
echo "To import: npm run strapi import -- --file ${EXPORT_FILE}"
