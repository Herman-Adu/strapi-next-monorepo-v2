#!/bin/bash

###############################################################################
# VPS Automated Setup Script (Hostinger)
# Purpose: Provision VPS for Strapi backend deployment
# Status: Preparation phase - DO NOT deploy until security hardening complete
# Date: January 1, 2026
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    log_error "Do not run this script as root. Run as non-root user with sudo access."
    exit 1
fi

log_info "Starting VPS setup for Strapi deployment..."
log_warn "This is PREPARATION only - Complete security hardening before production deployment"

###############################################################################
# Step 1: System Update
###############################################################################
log_info "Step 1/9: Updating system packages..."
sudo apt update && sudo apt upgrade -y

###############################################################################
# Step 2: Install Node.js 20+
###############################################################################
log_info "Step 2/9: Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
log_info "Node.js installed: $NODE_VERSION"

# Install Yarn globally
log_info "Installing Yarn package manager..."
sudo npm install -g yarn
YARN_VERSION=$(yarn --version)
log_info "Yarn installed: $YARN_VERSION"

###############################################################################
# Step 3: Install PostgreSQL 16
###############################################################################
log_info "Step 3/9: Installing PostgreSQL 16..."

# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install PostgreSQL 16
sudo apt install -y postgresql-16 postgresql-contrib-16

# Verify PostgreSQL installation
PSQL_VERSION=$(psql --version)
log_info "PostgreSQL installed: $PSQL_VERSION"

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

log_warn "PostgreSQL installed with default configuration"
log_warn "⚠️  Security Note: Configure dedicated user and secure password in Step 2 (Security Hardening)"

###############################################################################
# Step 4: Install NGINX
###############################################################################
log_info "Step 4/9: Installing NGINX..."
sudo apt install -y nginx

# Start and enable NGINX
sudo systemctl start nginx
sudo systemctl enable nginx

NGINX_VERSION=$(nginx -v 2>&1 | cut -d '/' -f 2)
log_info "NGINX installed: $NGINX_VERSION"

###############################################################################
# Step 5: Install Certbot (Let's Encrypt SSL)
###############################################################################
log_info "Step 5/9: Installing Certbot for SSL certificates..."
sudo apt install -y certbot python3-certbot-nginx

log_info "Certbot installed"
log_warn "⚠️  SSL Configuration: Run 'sudo certbot --nginx -d api.yourdomain.com' after DNS configured"

###############################################################################
# Step 6: Install PM2 (Process Manager)
###############################################################################
log_info "Step 6/9: Installing PM2 process manager..."
sudo npm install -g pm2

PM2_VERSION=$(pm2 --version)
log_info "PM2 installed: $PM2_VERSION"

# Setup PM2 startup script
log_info "Configuring PM2 startup script..."
PM2_STARTUP=$(pm2 startup | tail -n 1)
eval "$PM2_STARTUP" || log_warn "PM2 startup configuration may require manual setup"

###############################################################################
# Step 7: Configure Firewall (UFW)
###############################################################################
log_info "Step 7/9: Configuring firewall..."

# Install UFW if not present
sudo apt install -y ufw

# Configure firewall rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Enable firewall (with confirmation)
log_warn "About to enable firewall. Ensure SSH access is configured correctly!"
read -p "Enable firewall? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo ufw --force enable
    log_info "Firewall enabled"
else
    log_warn "Firewall not enabled. Run 'sudo ufw enable' manually."
fi

###############################################################################
# Step 8: Create Application Directory Structure
###############################################################################
log_info "Step 8/9: Creating application directory structure..."

# Create directories
sudo mkdir -p /var/www/strapi/{logs,backups,uploads}
sudo chown -R $USER:$USER /var/www/strapi

log_info "Directory structure created at /var/www/strapi"

###############################################################################
# Step 9: Install Additional Utilities
###############################################################################
log_info "Step 9/9: Installing additional utilities..."

# Install useful tools
sudo apt install -y git curl wget vim htop unzip

# Install fail2ban (brute force protection)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

log_info "Additional utilities installed"

###############################################################################
# Post-Installation Summary
###############################################################################
log_info "=========================================="
log_info "VPS Setup Complete! ✅"
log_info "=========================================="
echo ""
log_info "Installed Components:"
echo "  - Node.js: $NODE_VERSION"
echo "  - Yarn: $YARN_VERSION"
echo "  - PostgreSQL: $PSQL_VERSION"
echo "  - NGINX: $NGINX_VERSION"
echo "  - PM2: $PM2_VERSION"
echo "  - Certbot: Installed"
echo "  - fail2ban: Installed & Running"
echo ""
log_warn "⚠️  CRITICAL NEXT STEPS (Security Hardening - Step 2):"
echo ""
echo "1. Configure PostgreSQL:"
echo "   - Create dedicated application user (not 'postgres' superuser)"
echo "   - Generate secure password"
echo "   - Configure SSL/TLS"
echo "   sudo -u postgres psql"
echo ""
echo "2. Configure NGINX:"
echo "   - Create Strapi site configuration"
echo "   - Obtain SSL certificate"
echo "   sudo nano /etc/nginx/sites-available/strapi"
echo "   sudo certbot --nginx -d api.yourdomain.com"
echo ""
echo "3. Setup SSH Security:"
echo "   - Disable password authentication"
echo "   - Configure SSH keys only"
echo "   sudo nano /etc/ssh/sshd_config"
echo ""
echo "4. Configure Automated Backups:"
echo "   - Setup daily PostgreSQL backups"
echo "   - Configure off-site backup storage"
echo ""
echo "5. Complete Security Checklist:"
echo "   See: docs/08-devops/deployment/03-SECURITY-CHECKLIST.md"
echo ""
log_warn "🔴 DO NOT DEPLOY TO PRODUCTION UNTIL SECURITY HARDENING COMPLETE"
echo ""
log_info "Reference Documentation:"
echo "  - docs/08-devops/deployment/01-VPS-SETUP-GUIDE.md"
echo "  - docs/08-devops/deployment/03-SECURITY-CHECKLIST.md"
echo ""
log_info "Next: Deploy Strapi using scripts/deployment/deploy-strapi.sh"
log_info "(Only after security hardening complete!)"
