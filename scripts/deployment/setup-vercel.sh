#!/bin/bash

###############################################################################
# Vercel Setup and Deployment Script
# Purpose: Configure and deploy Next.js frontend to Vercel Pro
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

# Configuration
PROJECT_NAME="strapi-next-monorepo-v2"
FRONTEND_DIR="apps/ui"
PRODUCTION_DOMAIN="yourdomain.com"  # Change to your domain
API_DOMAIN="api.yourdomain.com"     # Change to your API domain

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

# Check if frontend app exists
if [ ! -d "$FRONTEND_DIR" ]; then
    log_error "Frontend app not found at $FRONTEND_DIR"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    log_warn "Vercel CLI not found. Installing..."
    npm install -g vercel
    log_info "Vercel CLI installed ✅"
fi

# Verify Vercel CLI version
VERCEL_VERSION=$(vercel --version)
log_info "Vercel CLI version: $VERCEL_VERSION"

# Check if security checklist completed
log_warn "=========================================="
log_warn "⚠️  SECURITY CHECKLIST VERIFICATION"
log_warn "=========================================="
echo ""
log_warn "Have you completed ALL items in the security checklist?"
log_warn "Location: docs/08-devops/deployment/03-SECURITY-CHECKLIST.md"
echo ""
log_warn "Critical items for Vercel:"
echo "  ✓ All secrets rotated (NEXTAUTH_SECRET, JWT_SECRET)"
echo "  ✓ Strapi API token generated and secured"
echo "  ✓ reCAPTCHA keys configured (if using contact forms)"
echo "  ✓ Sentry DSN configured (error tracking)"
echo "  ✓ Production environment variables ready"
echo ""
read -p "Have you completed the security checklist? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log_error "Complete security hardening before deployment!"
    log_error "See: docs/08-devops/deployment/03-SECURITY-CHECKLIST.md"
    exit 1
fi

###############################################################################
# Step 1: Login to Vercel
###############################################################################
log_step "Step 1/6: Logging in to Vercel..."

log_info "Opening browser for Vercel authentication..."
vercel login

log_info "Vercel login complete ✅"

###############################################################################
# Step 2: Link Project
###############################################################################
log_step "Step 2/6: Linking Vercel project..."

cd "$FRONTEND_DIR"

log_info "Linking to Vercel project..."
log_warn "Select the following options:"
echo "  - Setup and deploy: Yes"
echo "  - Scope: Select your account/team"
echo "  - Link to existing project: Yes (if exists) or No (if new)"
echo "  - Project name: $PROJECT_NAME"
echo "  - Root Directory: apps/ui"
echo ""

vercel link

log_info "Project linked ✅"

cd ../..

###############################################################################
# Step 3: Configure Environment Variables
###############################################################################
log_step "Step 3/6: Configuring environment variables..."

log_warn "=========================================="
log_warn "⚠️  ENVIRONMENT VARIABLES SETUP"
log_warn "=========================================="
echo ""
log_warn "You need to configure the following environment variables in Vercel:"
echo ""
echo "Client-side variables (NEXT_PUBLIC_*):"
echo "  - NEXT_PUBLIC_STRAPI_URL=https://$API_DOMAIN"
echo "  - NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key"
echo ""
echo "Server-side variables:"
echo "  - STRAPI_API_URL=https://$API_DOMAIN"
echo "  - STRAPI_API_TOKEN=your_strapi_api_token"
echo "  - NEXTAUTH_URL=https://$PRODUCTION_DOMAIN"
echo "  - NEXTAUTH_SECRET=your_nextauth_secret"
echo "  - JWT_SECRET=your_jwt_secret"
echo "  - RECAPTCHA_SECRET_KEY=your_recaptcha_secret"
echo "  - SENTRY_DSN=your_sentry_dsn"
echo "  - SENTRY_AUTH_TOKEN=your_sentry_token"
echo "  - NODE_ENV=production"
echo ""
log_warn "Template available at: scripts/deployment/.env.production.template"
echo ""

read -p "Configure environment variables now? (yes/no): " -r
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log_info "Opening Vercel dashboard for environment variable configuration..."
    log_info "Navigate to: Project Settings > Environment Variables"
    
    # Optionally open browser
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://vercel.com/$PROJECT_NAME/settings/environment-variables"
    elif command -v open &> /dev/null; then
        open "https://vercel.com/$PROJECT_NAME/settings/environment-variables"
    else
        log_info "Visit: https://vercel.com/$PROJECT_NAME/settings/environment-variables"
    fi
    
    read -p "Press Enter when environment variables are configured..."
else
    log_warn "Configure environment variables via Vercel CLI:"
    echo "  cd $FRONTEND_DIR"
    echo "  vercel env add NEXT_PUBLIC_STRAPI_URL production"
    echo "  vercel env add STRAPI_API_TOKEN production"
    echo "  vercel env add NEXTAUTH_SECRET production"
    echo "  # ... (repeat for all variables)"
    echo ""
    read -p "Press Enter when environment variables are configured..."
fi

log_info "Environment variables configured ✅"

###############################################################################
# Step 4: Test Build Locally
###############################################################################
log_step "Step 4/6: Testing build locally..."

cd "$FRONTEND_DIR"

log_info "Installing dependencies..."
yarn install

log_info "Building Next.js application..."
yarn build

if [ $? -eq 0 ]; then
    log_info "Local build successful ✅"
else
    log_error "Local build failed. Fix errors before deploying."
    exit 1
fi

cd ../..

###############################################################################
# Step 5: Deploy to Production
###############################################################################
log_step "Step 5/6: Deploying to Vercel production..."

cd "$FRONTEND_DIR"

log_warn "=========================================="
log_warn "⚠️  PRODUCTION DEPLOYMENT"
log_warn "=========================================="
echo ""
log_warn "This will deploy to production (https://$PRODUCTION_DOMAIN)."
log_warn "Ensure:"
echo "  ✓ Strapi backend is running and accessible"
echo "  ✓ All environment variables are configured"
echo "  ✓ DNS is configured for $PRODUCTION_DOMAIN"
echo "  ✓ Security checklist is complete"
echo ""
read -p "Deploy to production? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log_warn "Deployment cancelled. To deploy later, run:"
    echo "  cd $FRONTEND_DIR"
    echo "  vercel --prod"
    exit 0
fi

log_info "Deploying to production..."
vercel --prod

DEPLOYMENT_STATUS=$?

cd ../..

if [ $DEPLOYMENT_STATUS -eq 0 ]; then
    log_info "Production deployment complete ✅"
else
    log_error "Deployment failed. Check logs above for errors."
    exit 1
fi

###############################################################################
# Step 6: Configure Custom Domain
###############################################################################
log_step "Step 6/6: Configuring custom domain..."

log_warn "=========================================="
log_warn "⚠️  DOMAIN CONFIGURATION"
log_warn "=========================================="
echo ""
log_warn "Configure custom domain in Vercel dashboard:"
echo "  1. Go to Project Settings > Domains"
echo "  2. Add domain: $PRODUCTION_DOMAIN"
echo "  3. Add domain: www.$PRODUCTION_DOMAIN (optional)"
echo ""
log_warn "DNS Configuration:"
echo "  Type    Name    Value"
echo "  A       @       76.76.21.21 (Vercel IP)"
echo "  CNAME   www     cname.vercel-dns.com"
echo ""
log_warn "SSL certificate will be issued automatically (5-10 minutes)"
echo ""

read -p "Configure domain now? (yes/no): " -r
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://vercel.com/$PROJECT_NAME/settings/domains"
    elif command -v open &> /dev/null; then
        open "https://vercel.com/$PROJECT_NAME/settings/domains"
    else
        log_info "Visit: https://vercel.com/$PROJECT_NAME/settings/domains"
    fi
    
    read -p "Press Enter when domain is configured..."
    log_info "Domain configuration complete ✅"
else
    log_warn "Configure domain later via Vercel dashboard"
fi

###############################################################################
# Post-Deployment Verification
###############################################################################
log_step "Post-deployment verification..."

log_info "Waiting 30 seconds for deployment to propagate..."
sleep 30

# Try to fetch deployment URL
DEPLOYMENT_URL=$(vercel ls --cwd "$FRONTEND_DIR" | head -n 2 | tail -n 1 | awk '{print $2}')

if [ -n "$DEPLOYMENT_URL" ]; then
    log_info "Testing deployment at: $DEPLOYMENT_URL"
    
    # Basic health check
    if curl -f -s -o /dev/null "$DEPLOYMENT_URL"; then
        log_info "Deployment is accessible ✅"
    else
        log_warn "Could not reach deployment. It may still be propagating."
    fi
else
    log_warn "Could not retrieve deployment URL automatically"
fi

###############################################################################
# Deployment Summary
###############################################################################
log_info "=========================================="
log_info "Vercel Deployment Complete! ✅"
log_info "=========================================="
echo ""
log_info "Next.js Frontend Status:"
echo "  - Project: $PROJECT_NAME"
echo "  - Production URL: https://$PRODUCTION_DOMAIN"
echo "  - Vercel URL: $DEPLOYMENT_URL"
echo "  - Framework: Next.js 15+"
echo "  - Edge CDN: Enabled"
echo ""
log_info "Useful Commands:"
echo "  - Deploy: cd $FRONTEND_DIR && vercel --prod"
echo "  - View logs: vercel logs"
echo "  - List deployments: vercel ls"
echo "  - View environment: vercel env ls"
echo "  - Pull env locally: vercel env pull .env.local"
echo ""
log_info "Vercel Dashboard:"
echo "  - Project: https://vercel.com/$PROJECT_NAME"
echo "  - Deployments: https://vercel.com/$PROJECT_NAME/deployments"
echo "  - Analytics: https://vercel.com/$PROJECT_NAME/analytics"
echo "  - Settings: https://vercel.com/$PROJECT_NAME/settings"
echo ""
log_info "Next Steps:"
echo "  1. Verify website accessible at https://$PRODUCTION_DOMAIN"
echo "  2. Test critical user flows (homepage, contact form, etc.)"
echo "  3. Check Vercel Analytics dashboard"
echo "  4. Configure Sentry error tracking"
echo "  5. Run E2E tests against production"
echo "  6. Setup uptime monitoring (UptimeRobot, Pingdom)"
echo "  7. Configure Vercel deployment notifications"
echo ""
log_warn "⚠️  Post-Deployment Checklist:"
echo "  - Monitor Vercel dashboard for errors"
echo "  - Check Sentry for runtime errors"
echo "  - Verify API calls to Strapi backend"
echo "  - Test form submissions (contact, newsletter)"
echo "  - Verify Core Web Vitals in analytics"
echo "  - Test on mobile devices"
echo ""
log_info "Reference Documentation:"
echo "  - docs/08-devops/deployment/02-VERCEL-DEPLOYMENT-GUIDE.md"
echo "  - docs/08-devops/deployment/03-SECURITY-CHECKLIST.md"
echo ""
log_info "🎉 Deployment successful! Your application is now live!"
