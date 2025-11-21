#!/bin/bash

echo "=== Docker Container Information ==="
echo ""

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo "❌ Docker is not running or not installed"
    exit 1
fi

echo "Running containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "All containers (including stopped):"
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""

echo "Looking for Strapi containers..."
STRAPI_CONTAINERS=$(docker ps -a --format "{{.Names}}" | grep -i strapi)

if [ -z "$STRAPI_CONTAINERS" ]; then
    echo "No containers with 'strapi' in the name found"
    echo ""
    echo "All container names:"
    docker ps -a --format "{{.Names}}"
else
    echo "Found Strapi containers:"
    echo "$STRAPI_CONTAINERS"
    echo ""
    
    for container in $STRAPI_CONTAINERS; do
        echo "Checking $container for SQLite database..."
        docker exec $container find / -name "data.db" -o -name "*.db" 2>/dev/null | grep -v "/proc/" | head -5
        echo ""
    done
fi
