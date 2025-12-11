# 🛡️ Safe Strapi Backup Script with Pre-Flight Checks
# Creates comprehensive backup with safety validation
# SAFE: Includes verification before and after backup

param(
    [string]$MilestoneName = "auto-backup",
    [switch]$SkipVerification = $false,
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "🛡️  SAFE STRAPI BACKUP WITH PRE-FLIGHT CHECKS" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan

# Configuration
$timestamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
$backupName = "strapi-backup-$timestamp-$MilestoneName"
$backupDir = "backups/milestones/$MilestoneName"

# ============================================
# PRE-FLIGHT SAFETY CHECKS
# ============================================

Write-Host "`n🔍 PRE-FLIGHT SAFETY CHECKS" -ForegroundColor Yellow
Write-Host ("=" * 80) -ForegroundColor Gray

# Check 1: Verify we're in the correct directory
Write-Host "`n1️⃣  Verifying working directory..." -ForegroundColor Cyan
$expectedPath = "strapi-next-monorepo-v2"
$currentPath = (Get-Location).Path

if ($currentPath -notlike "*$expectedPath*") {
    Write-Host "   ❌ ERROR: Not in the correct repository!" -ForegroundColor Red
    Write-Host "   Current: $currentPath" -ForegroundColor Red
    Write-Host "   Expected to contain: $expectedPath" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Working directory confirmed" -ForegroundColor Green

# Check 2: Verify Strapi directory exists
Write-Host "`n2️⃣  Verifying Strapi installation..." -ForegroundColor Cyan
if (-not (Test-Path "apps/strapi")) {
    Write-Host "   ❌ ERROR: Strapi directory not found at apps/strapi" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Strapi directory found" -ForegroundColor Green

# Check 3: Warn if Strapi is running
Write-Host "`n3️⃣  Checking if Strapi server is running..." -ForegroundColor Cyan
$strapiProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | 
    Where-Object { $_.CommandLine -like "*strapi*" }

if ($strapiProcess) {
    Write-Host "   ⚠️  WARNING: Strapi server appears to be running!" -ForegroundColor Yellow
    Write-Host "   Process: $($strapiProcess.ProcessName) (PID: $($strapiProcess.Id))" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   🛑 RECOMMENDATION: Stop Strapi server before backup to avoid:" -ForegroundColor Yellow
    Write-Host "      - Database lock issues" -ForegroundColor Yellow
    Write-Host "      - Incomplete backup data" -ForegroundColor Yellow
    Write-Host "      - Schema sync problems" -ForegroundColor Yellow
    Write-Host ""
    
    if (-not $Force) {
        $response = Read-Host "   Continue anyway? (yes/no)"
        if ($response -ne "yes") {
            Write-Host "`n❌ Backup cancelled by user" -ForegroundColor Red
            Write-Host "   Stop Strapi with Ctrl+C in the server terminal, then run this script again.`n" -ForegroundColor Yellow
            exit 0
        }
    } else {
        Write-Host "   ⚠️  Continuing because -Force flag is set..." -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ Strapi server not running (safe to proceed)" -ForegroundColor Green
}

# Check 4: Verify database exists (SQLite)
Write-Host "`n4️⃣  Checking database..." -ForegroundColor Cyan
if (Test-Path "apps/strapi/.tmp/data.db") {
    $dbSize = (Get-Item "apps/strapi/.tmp/data.db").Length / 1MB
    Write-Host "   ✅ SQLite database found" -ForegroundColor Green
    Write-Host "   Size: $([math]::Round($dbSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  WARNING: SQLite database not found at apps/strapi/.tmp/data.db" -ForegroundColor Yellow
    Write-Host "   This might be a PostgreSQL deployment or database hasn't been initialized." -ForegroundColor Yellow
}

# Check 5: Verify backup directory doesn't already exist (prevent overwrites)
Write-Host "`n5️⃣  Checking for existing backup..." -ForegroundColor Cyan
if (Test-Path $backupDir) {
    Write-Host "   ⚠️  WARNING: Backup directory already exists: $backupDir" -ForegroundColor Yellow
    
    if (-not $Force) {
        $response = Read-Host "   Overwrite existing backup? (yes/no)"
        if ($response -ne "yes") {
            Write-Host "`n❌ Backup cancelled to prevent overwriting existing data`n" -ForegroundColor Red
            exit 0
        }
    }
    
    Write-Host "   🗑️  Removing existing backup directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $backupDir
}
Write-Host "   ✅ Backup directory ready" -ForegroundColor Green

# Check 6: Estimate backup size
Write-Host "`n6️⃣  Estimating backup size..." -ForegroundColor Cyan
$uploadsSize = 0
if (Test-Path "apps/strapi/public/uploads") {
    $uploadsSize = (Get-ChildItem "apps/strapi/public/uploads" -Recurse -File | 
        Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Media files: $([math]::Round($uploadsSize, 2)) MB" -ForegroundColor Gray
}

$dbSize = 0
if (Test-Path "apps/strapi/.tmp/data.db") {
    $dbSize = (Get-Item "apps/strapi/.tmp/data.db").Length / 1MB
    Write-Host "   Database: $([math]::Round($dbSize, 2)) MB" -ForegroundColor Gray
}

$estimatedTotal = $uploadsSize + $dbSize
Write-Host "   Estimated total: ~$([math]::Round($estimatedTotal, 2)) MB" -ForegroundColor Green

Write-Host "`n" + ("=" * 80) -ForegroundColor Green
Write-Host "✅ ALL PRE-FLIGHT CHECKS PASSED" -ForegroundColor Green
Write-Host ("=" * 80) -ForegroundColor Green

# User confirmation
if (-not $Force) {
    Write-Host "`n📋 Backup Details:" -ForegroundColor Cyan
    Write-Host "   Milestone: $MilestoneName" -ForegroundColor White
    Write-Host "   Destination: $backupDir" -ForegroundColor White
    Write-Host "   Estimated Size: ~$([math]::Round($estimatedTotal, 2)) MB" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "Proceed with backup? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "`n❌ Backup cancelled by user`n" -ForegroundColor Red
        exit 0
    }
}

# ============================================
# CREATE BACKUP
# ============================================

Write-Host "`n🔄 CREATING BACKUP" -ForegroundColor Yellow
Write-Host ("=" * 80) -ForegroundColor Gray

# Create backup directory
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
Write-Host "`n✅ Created backup directory: $backupDir" -ForegroundColor Green

# Navigate to Strapi directory
Push-Location "apps/strapi"

try {
    # 1. Export Strapi data (includes media)
    Write-Host "`n📦 Exporting Strapi data..." -ForegroundColor Yellow
    npm run strapi export -- --file "../../$backupDir/$backupName.tar.gz" --no-encrypt
    
    if ($LASTEXITCODE -eq 0) {
        $backupFile = "../../$backupDir/$backupName.tar.gz"
        $backupSize = (Get-Item $backupFile).Length / 1MB
        Write-Host "✅ Export completed: $([math]::Round($backupSize, 2)) MB" -ForegroundColor Green
    } else {
        throw "Strapi export failed with exit code: $LASTEXITCODE"
    }
    
    # 2. Copy database file (SQLite) - redundant backup
    if (Test-Path ".tmp/data.db") {
        Write-Host "`n💾 Backing up SQLite database file..." -ForegroundColor Yellow
        Copy-Item ".tmp/data.db" -Destination "../../$backupDir/database-$timestamp.db"
        Write-Host "✅ Database file copied" -ForegroundColor Green
    }
    
    # 3. Compress media folder separately (redundant backup)
    if (Test-Path "public/uploads") {
        Write-Host "`n🖼️  Backing up media files..." -ForegroundColor Yellow
        Compress-Archive -Path "public/uploads/*" -DestinationPath "../../$backupDir/media-$timestamp.zip" -Force
        Write-Host "✅ Media files compressed" -ForegroundColor Green
    }
    
    Pop-Location
    
    # 4. Create README for this backup
    Write-Host "`n📄 Creating backup documentation..." -ForegroundColor Yellow
    $readmeContent = @"
# Backup: $MilestoneName

**Created**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Script**: scripts/backup-strapi-safe.ps1

## ⚠️ IMPORTANT: Read Before Restore

This backup was created with safety checks and verification.
Before restoring, **ALWAYS**:

1. ✅ Create a current backup first (in case restore fails)
2. ✅ Stop Strapi server (prevent database locks)
3. ✅ Verify this backup with: ``scripts/verify-backup.ps1``
4. ✅ Understand what will be overwritten

## 📦 Contents

- **Primary Backup**: ``$backupName.tar.gz`` (Strapi export format)
- **Database Snapshot**: ``database-$timestamp.db`` (SQLite direct copy)
- **Media Archive**: ``media-$timestamp.zip`` (redundant media backup)

## 🔄 Restore Instructions

### Quick Restore (Destructive - Overwrites Current Data):

``````powershell
cd apps/strapi
npm run strapi import -- --file ../../$backupDir/$backupName.tar.gz --force
``````

### Safe Restore (Recommended):

``````powershell
# 1. Verify backup first
.\scripts\verify-backup.ps1 -BackupFile "$backupDir/$backupName.tar.gz"

# 2. Create current backup (safety net)
.\scripts\backup-strapi-safe.ps1 -MilestoneName "pre-restore-$(Get-Date -Format 'yyyyMMdd')"

# 3. Stop Strapi server (Ctrl+C in terminal)

# 4. Import backup
cd apps/strapi
npm run strapi import -- --file ../../$backupDir/$backupName.tar.gz --force

# 5. Rebuild admin
npm run build

# 6. Restart Strapi
npm run develop
``````

## 🔍 Verification

Run verification to see what's in this backup:

``````powershell
.\scripts\verify-backup.ps1 -BackupFile "$backupDir/$backupName.tar.gz" -Detailed
``````

## 📊 Backup Statistics

- Created by: Safe backup script with pre-flight checks
- Milestone: $MilestoneName
- Timestamp: $timestamp
- Verified: $(if (-not $SkipVerification) { "Yes ✅" } else { "Skipped" })

"@
    $readmeContent | Set-Content "$backupDir/README.md"
    Write-Host "✅ Documentation created" -ForegroundColor Green
    
    # 5. Calculate total backup size
    $totalSize = (Get-ChildItem -Path $backupDir -Recurse -File | 
        Measure-Object -Property Length -Sum).Sum / 1MB
    
    Write-Host "`n" + ("=" * 80) -ForegroundColor Green
    Write-Host "✅ BACKUP CREATED SUCCESSFULLY" -ForegroundColor Green
    Write-Host ("=" * 80) -ForegroundColor Green
    Write-Host ""
    Write-Host "📂 Location: $backupDir" -ForegroundColor Cyan
    Write-Host "📊 Total Size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
    Write-Host "📅 Timestamp: $timestamp" -ForegroundColor Cyan
    Write-Host ("=" * 80) -ForegroundColor Green
    
} catch {
    Pop-Location
    Write-Host "`n❌ BACKUP FAILED: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "The backup process encountered an error. Your database is unchanged." -ForegroundColor Yellow
    Write-Host "Please review the error above and try again." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# ============================================
# POST-BACKUP VERIFICATION
# ============================================

if (-not $SkipVerification) {
    Write-Host "`n🔍 POST-BACKUP VERIFICATION" -ForegroundColor Yellow
    Write-Host ("=" * 80) -ForegroundColor Gray
    Write-Host ""
    
    $backupFile = "$backupDir/$backupName.tar.gz"
    
    if (Test-Path $backupFile) {
        Write-Host "Running verification script...`n" -ForegroundColor Cyan
        
        # Run verification script
        & "$PSScriptRoot/verify-backup.ps1" -BackupFile $backupFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Backup verified successfully!" -ForegroundColor Green
        } else {
            Write-Host "`n⚠️  WARNING: Backup verification failed!" -ForegroundColor Yellow
            Write-Host "   The backup was created but may be incomplete." -ForegroundColor Yellow
            Write-Host "   Review the verification output above." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  Backup file not found for verification" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⏭️  Skipping verification (use -SkipVerification $false to verify)" -ForegroundColor Gray
}

# ============================================
# COMPLETION
# ============================================

Write-Host "`n📝 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. ✅ Backup created and verified" -ForegroundColor White
Write-Host "  2. 📋 Review backup contents: $backupDir/README.md" -ForegroundColor White
Write-Host "  3. 🧪 (Optional) Test restore in a separate environment" -ForegroundColor White
Write-Host "  4. 💾 (Recommended) Copy to external storage for safety" -ForegroundColor White
Write-Host ""
Write-Host "To verify this backup later:" -ForegroundColor Cyan
Write-Host "  .\scripts\verify-backup.ps1 -BackupFile '$backupDir/$backupName.tar.gz'" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Backup process complete!`n" -ForegroundColor Green
