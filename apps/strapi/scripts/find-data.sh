#!/bin/bash

echo "=== Searching for Strapi data sources ==="
echo ""

# Check for SQLite database (default Strapi)
echo "1. Checking for SQLite database..."
if [ -f ".tmp/data.db" ]; then
    echo "   ✓ Found SQLite database: .tmp/data.db"
    SIZE=$(du -h .tmp/data.db | cut -f1)
    echo "   Size: $SIZE"
    echo "   To migrate: Use scripts/migrate-from-sqlite.sh"
else
    echo "   ✗ No SQLite database found"
fi
echo ""

# Check for Docker containers
echo "2. Checking for Docker containers..."
if command -v docker &> /dev/null; then
    POSTGRES_CONTAINERS=$(docker ps -a --filter "ancestor=postgres" --format "{{.Names}}" 2>/dev/null)
    if [ ! -z "$POSTGRES_CONTAINERS" ]; then
        echo "   ✓ Found PostgreSQL containers:"
        echo "$POSTGRES_CONTAINERS" | while read container; do
            echo "     - $container"
            STATUS=$(docker ps --filter "name=$container" --format "{{.Status}}")
            echo "       Status: ${STATUS:-Stopped}"
        done
        echo "   To migrate: Use scripts/migrate-from-docker.sh"
    else
        echo "   ✗ No PostgreSQL containers found"
    fi
else
    echo "   ✗ Docker not installed/running"
fi
echo ""

# Check for Strapi export files
echo "3. Checking for existing export files..."
if [ -d "exports" ] && [ "$(ls -A exports 2>/dev/null)" ]; then
    echo "   ✓ Found export files:"
    ls -lh exports/
else
    echo "   ✗ No export files found"
fi
echo ""

# Check database config in .env
echo "4. Previous database configuration..."
if [ -f ".env" ]; then
    echo "   Current DATABASE_CLIENT: $(grep DATABASE_CLIENT .env | cut -d= -f2)"
    echo "   Current DATABASE_HOST: $(grep DATABASE_HOST .env | cut -d= -f2)"
    echo "   Current DATABASE_NAME: $(grep DATABASE_NAME .env | cut -d= -f2)"
else
    echo "   ✗ No .env file found"
fi
echo ""

echo "=== Next Steps ==="
echo "Based on findings above, choose the appropriate migration script:"
echo "  - SQLite: ./scripts/migrate-from-sqlite.sh"
echo "  - Docker: ./scripts/migrate-from-docker.sh <container-name>"
echo "  - Remote: Update .env with remote credentials, then use strapi-export.sh"
