#!/bin/bash

###############################################################################
# Strapi Deployment Script (VPS)
# Purpose: Deploy Strapi backend to Hostinger VPS
# Status: Preparation phase - DO NOT deploy until security hardening complete
# Date: January 1, 2026
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (modify these values)
VPS_USER="strapi"
VPS_HOST="your-vps-ip"  # Change to your VPS IP or domain
VPS_DIR="/var/www/strapi"
APP_NAME="strapi-backend"
BRANCH="main"

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

###############################################################################
# Pre-Flight Checks
###############################################################################
log_step "Pre-flight checks..."

# Check if we're in the monorepo root
if [ ! -f "turbo.json" ]; then
    log_error "Not in monorepo root. Run this script from the root directory."
    exit 1
fi

# Check if Strapi app exists
if [ ! -d "apps/strapi" ]; then
    log_error "Strapi app not found at apps/strapi"
    exit 1
fi

# Verify SSH connection
log_info "Testing SSH connection to $VPS_USER@$VPS_HOST..."
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "$VPS_USER@$VPS_HOST" exit 2>/dev/null; then
    log_error "Cannot connect to VPS. Check SSH keys and VPS_HOST configuration."
    exit 1
fi
log_info "SSH connection successful ✅"

# Check if security checklist completed
log_warn "=========================================="
log_warn "⚠️  SECURITY CHECKLIST VERIFICATION"
log_warn "=========================================="
echo ""
log_warn "Have you completed ALL items in the security checklist?"
log_warn "Location: docs/08-devops/deployment/03-SECURITY-CHECKLIST.md"
echo ""
log_warn "Critical items:"
echo "  ✓ PostgreSQL password rotated from temppass123"
echo "  ✓ Dedicated PostgreSQL user created (not superuser)"
echo "  ✓ All Strapi secrets rotated (APP_KEYS, JWT secrets)"
echo "  ✓ SSL/TLS configured on VPS"
echo "  ✓ Firewall enabled and configured"
echo "  ✓ Automated backups configured"
echo ""
read -p "Have you completed the security checklist? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log_error "Complete security hardening before deployment!"
    log_error "See: docs/08-devops/deployment/03-SECURITY-CHECKLIST.md"
    exit 1
fi

###############################################################################
# Step 1: Build Strapi Locally
###############################################################################
log_step "Step 1/7: Building Strapi locally..."

cd apps/strapi

# Install dependencies
log_info "Installing dependencies..."
yarn install

# Build Strapi
log_info "Building Strapi..."
yarn build

# Return to root
cd ../..

log_info "Local build complete ✅"

###############################################################################
# Step 2: Create Deployment Archive
###############################################################################
log_step "Step 2/7: Creating deployment archive..."

# Create temporary directory
TEMP_DIR=$(mktemp -d)
ARCHIVE_NAME="strapi-deployment-$(date +%Y%m%d-%H%M%S).tar.gz"

log_info "Packaging Strapi application..."

# Copy necessary files
rsync -a --exclude='node_modules' \
         --exclude='.cache' \
         --exclude='build/.cache' \
         --exclude='.tmp' \
         --exclude='public/uploads' \
         apps/strapi/ "$TEMP_DIR/"

# Copy root package files (for workspace resolution)
cp package.json "$TEMP_DIR/../package.json" 2>/dev/null || true
cp yarn.lock "$TEMP_DIR/../yarn.lock" 2>/dev/null || true

# Create archive
cd "$TEMP_DIR/.."
tar -czf "/tmp/$ARCHIVE_NAME" strapi/
cd -

log_info "Archive created: /tmp/$ARCHIVE_NAME"

# Cleanup temp directory
rm -rf "$TEMP_DIR"

###############################################################################
# Step 3: Upload to VPS
###############################################################################
log_step "Step 3/7: Uploading to VPS..."

log_info "Transferring archive to VPS..."
scp "/tmp/$ARCHIVE_NAME" "$VPS_USER@$VPS_HOST:/tmp/"

log_info "Upload complete ✅"

# Cleanup local archive
rm "/tmp/$ARCHIVE_NAME"

###############################################################################
# Step 4: Extract and Setup on VPS
###############################################################################
log_step "Step 4/7: Extracting and setting up on VPS..."

ssh "$VPS_USER@$VPS_HOST" bash <<EOF
    set -e
    
    # Extract archive
    echo "Extracting archive..."
    cd /tmp
    tar -xzf "$ARCHIVE_NAME"
    
    # Backup existing deployment if it exists
    if [ -d "$VPS_DIR/current" ]; then
        echo "Backing up existing deployment..."
        mv "$VPS_DIR/current" "$VPS_DIR/backup-\$(date +%Y%m%d-%H%M%S)"
    fi
    
    # Move new deployment
    mkdir -p "$VPS_DIR"
    mv /tmp/strapi "$VPS_DIR/current"
    
    # Cleanup
    rm "/tmp/$ARCHIVE_NAME"
    
    echo "Extraction complete ✅"
EOF

log_info "Setup on VPS complete ✅"

###############################################################################
# Step 5: Install Dependencies on VPS
###############################################################################
log_step "Step 5/7: Installing dependencies on VPS..."

ssh "$VPS_USER@$VPS_HOST" bash <<EOF
    set -e
    
    cd "$VPS_DIR/current"
    
    echo "Installing production dependencies..."
    yarn install --production --frozen-lockfile
    
    echo "Dependencies installed ✅"
EOF

log_info "Dependencies installed ✅"

###############################################################################
# Step 6: Configure Environment Variables
###############################################################################
log_step "Step 6/7: Checking environment variables..."

log_warn "=========================================="
log_warn "⚠️  ENVIRONMENT VARIABLES"
log_warn "=========================================="
echo ""
log_warn "Ensure .env file exists on VPS with production secrets:"
echo "  Location: $VPS_DIR/current/.env"
echo ""
log_warn "Required variables:"
echo "  - DATABASE_URL (PostgreSQL connection string)"
echo "  - APP_KEYS (4 keys, comma-separated)"
echo "  - API_TOKEN_SALT"
echo "  - ADMIN_JWT_SECRET"
echo "  - TRANSFER_TOKEN_SALT"
echo "  - JWT_SECRET"
echo "  - NODE_ENV=production"
echo ""
read -p "Is .env configured with secure secrets? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log_error "Configure environment variables before continuing!"
    log_error "Template: scripts/deployment/.env.production.template"
    exit 1
fi

###############################################################################
# Step 7: Start/Restart Strapi with PM2
###############################################################################
log_step "Step 7/7: Starting Strapi with PM2..."

ssh "$VPS_USER@$VPS_HOST" bash <<EOF
    set -e
    
    cd "$VPS_DIR/current"
    
    # Check if PM2 process exists
    if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
        echo "Restarting existing PM2 process..."
        pm2 restart "$APP_NAME"
    else
        echo "Starting new PM2 process..."
        pm2 start yarn --name "$APP_NAME" -- start
    fi
    
    # Save PM2 configuration
    pm2 save
    
    # Show status
    pm2 status "$APP_NAME"
    
    echo "PM2 process started ✅"
EOF

log_info "Strapi deployment complete ✅"

###############################################################################
# Post-Deployment Verification
###############################################################################
log_step "Post-deployment verification..."

log_info "Waiting 10 seconds for Strapi to start..."
sleep 10

# Health check
log_info "Checking Strapi health..."
if ssh "$VPS_USER@$VPS_HOST" "curl -f http://localhost:1337/_health" > /dev/null 2>&1; then
    log_info "Health check passed ✅"
else
    log_warn "Health check failed. Check PM2 logs:"
    log_warn "  ssh $VPS_USER@$VPS_HOST"
    log_warn "  pm2 logs $APP_NAME"
fi

###############################################################################
# Deployment Summary
###############################################################################
log_info "=========================================="
log_info "Deployment Complete! ✅"
log_info "=========================================="
echo ""
log_info "Strapi Backend Status:"
echo "  - Application: $APP_NAME"
echo "  - Location: $VPS_DIR/current"
echo "  - PM2 Process: Running"
echo "  - Local endpoint: http://localhost:1337"
echo "  - Public endpoint: https://api.yourdomain.com (via NGINX)"
echo ""
log_info "Useful Commands:"
echo "  - Check status: ssh $VPS_USER@$VPS_HOST 'pm2 status'"
echo "  - View logs: ssh $VPS_USER@$VPS_HOST 'pm2 logs $APP_NAME'"
echo "  - Restart: ssh $VPS_USER@$VPS_HOST 'pm2 restart $APP_NAME'"
echo "  - Stop: ssh $VPS_USER@$VPS_HOST 'pm2 stop $APP_NAME'"
echo ""
log_info "Next Steps:"
echo "  1. Verify API accessible at https://api.yourdomain.com"
echo "  2. Test admin panel login"
echo "  3. Deploy frontend to Vercel (see 02-VERCEL-DEPLOYMENT-GUIDE.md)"
echo "  4. Run E2E tests against production"
echo "  5. Setup monitoring (Sentry, uptime checks)"
echo ""
log_warn "⚠️  Remember to:"
echo "  - Monitor PM2 logs for errors"
echo "  - Test critical API endpoints"
echo "  - Verify database connectivity"
echo "  - Check SSL certificate expiry"
echo "  - Test backup restoration"
echo ""
log_info "Reference Documentation:"
echo "  - docs/08-devops/deployment/01-VPS-SETUP-GUIDE.md"
echo "  - docs/08-devops/deployment/03-SECURITY-CHECKLIST.md"
