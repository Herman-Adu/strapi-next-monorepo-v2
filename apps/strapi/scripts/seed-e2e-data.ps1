# ==============================================================================
# E2E Test Data Seeding Script (Windows PowerShell)
# ==============================================================================
#
# Purpose: Seeds database with test data required for Playwright E2E tests
#
# Usage:
#   - Local: yarn seed:e2e (from apps/strapi directory)
#   - CI: Uses bash version (Linux)
#
# Requirements:
#   - PostgreSQL database running (Docker or local)
#   - Strapi built (yarn build:strapi)
#   - Environment variables configured
#
# ==============================================================================

param(
    [string]$DatabaseUrl = $env:DATABASE_URL
)

$ErrorActionPreference = "Stop"

Write-Host "🌱 E2E Test Data Seeding" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

# ------------------------------------------------------------------------------
# 1. VERIFY DATABASE CONNECTION
# ------------------------------------------------------------------------------

Write-Host "📊 Checking database connection..." -ForegroundColor Yellow

if (-not $DatabaseUrl) {
    Write-Host "❌ ERROR: DATABASE_URL environment variable not set" -ForegroundColor Red
    Write-Host "   Set it in apps/strapi/.env or as environment variable" -ForegroundColor Red
    Write-Host "   Example: postgresql://strapi:strapi@localhost:5432/strapi_dev" -ForegroundColor Yellow
    exit 1
}

# Extract database name from connection string
$DbName = (($DatabaseUrl -split '/')[-1] -split '\?')[0]
Write-Host "✅ Connected to database: $DbName" -ForegroundColor Green

# ------------------------------------------------------------------------------
# 2. RESET DATABASE (CLEAN SLATE)
# ------------------------------------------------------------------------------

Write-Host "🗑️  Resetting database (drop + recreate schema)..." -ForegroundColor Yellow

try {
    # Drop and recreate public schema
    $resetQuery = "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
    & psql $DatabaseUrl -c $resetQuery 2>&1 | Out-Null
    
    Write-Host "✅ Database reset complete" -ForegroundColor Green
} catch {
    Write-Host "❌ Database reset failed" -ForegroundColor Red
    Write-Host "   Make sure PostgreSQL is running and DATABASE_URL is correct" -ForegroundColor Yellow
    exit 1
}

# ------------------------------------------------------------------------------
# 3. RUN STRAPI MIGRATIONS (CREATE SCHEMA)
# ------------------------------------------------------------------------------

Write-Host "🔄 Running Strapi migrations..." -ForegroundColor Yellow

# Change to Strapi directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "..")

try {
    $env:NODE_ENV = "production"
    & yarn strapi db:migrate
    
    Write-Host "✅ Migrations complete" -ForegroundColor Green
} catch {
    Write-Host "❌ Migrations failed" -ForegroundColor Red
    exit 1
}

# ------------------------------------------------------------------------------
# 4. SEED E2E TEST DATA
# ------------------------------------------------------------------------------

Write-Host "🌱 Seeding E2E test data..." -ForegroundColor Yellow

try {
    $env:NODE_ENV = "production"
    
    # Create temp script to run seed
    $seedScript = @"
(async () => {
    const strapi = await require('@strapi/strapi').default().load();
    const seedData = require('./database/seeds/e2e-test-data.ts').default;
    await seedData({ strapi });
    await strapi.destroy();
})();
"@
    
    $seedScript | & node
    
    Write-Host "✅ Seeding complete" -ForegroundColor Green
} catch {
    Write-Host "❌ Seeding failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# ------------------------------------------------------------------------------
# 5. VERIFY DATA WAS CREATED
# ------------------------------------------------------------------------------

Write-Host "🔍 Verifying seed data..." -ForegroundColor Yellow

try {
    $verifyQuery = "SELECT COUNT(*) FROM pages WHERE slug = 'e2e-test-page';"
    $pageCount = (& psql $DatabaseUrl -t -c $verifyQuery).Trim()
    
    if ($pageCount -eq "1") {
        Write-Host "✅ E2E test page verified in database" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNING: E2E test page not found in database" -ForegroundColor Yellow
        Write-Host "   Expected 1 page, found: $pageCount" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not verify database (non-critical)" -ForegroundColor Yellow
}

# ------------------------------------------------------------------------------
# 6. COMPLETION SUMMARY
# ------------------------------------------------------------------------------

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 E2E Test Data Seeding Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Test page available at:"
Write-Host "  http://localhost:3000/en/e2e-test-page" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Start Strapi: yarn dev:strapi"
Write-Host "  2. Start UI: yarn dev:ui"
Write-Host "  3. Run E2E tests: yarn test:e2e"
Write-Host ""
Write-Host "💡 TIP: Create SQL snapshot for faster resets:" -ForegroundColor Yellow
Write-Host "   yarn db:snapshot"
Write-Host ""

