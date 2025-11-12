# Strapi Backup Script
# Creates comprehensive backup with database + media files

param(
    [string]$MilestoneName = "auto-backup"
)

$timestamp = Get-Date -Format 'yyyy-MM-dd-HHmm'
$backupName = "strapi-export-$timestamp-$MilestoneName"
$backupDir = "backups/milestones/$MilestoneName"

Write-Host "🔄 Starting Strapi backup: $MilestoneName" -ForegroundColor Cyan

# Create backup directory
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

# Navigate to Strapi directory
Push-Location "apps/strapi"

try {
    # 1. Export Strapi data (includes media)
    Write-Host "📦 Exporting Strapi data..." -ForegroundColor Yellow
    npm run strapi export -- --file "../../$backupDir/$backupName.tar.gz" --no-encrypt
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Export completed successfully" -ForegroundColor Green
    } else {
        throw "Strapi export failed with exit code: $LASTEXITCODE"
    }
    
    # 2. Copy database file (SQLite)
    if (Test-Path ".tmp/data.db") {
        Write-Host "💾 Backing up database file..." -ForegroundColor Yellow
        Copy-Item ".tmp/data.db" -Destination "../../$backupDir/database-$timestamp.db"
        Write-Host "✅ Database backup completed" -ForegroundColor Green
    }
    
    # 3. Compress media folder separately (for redundancy)
    if (Test-Path "public/uploads") {
        Write-Host "🖼️  Backing up media files..." -ForegroundColor Yellow
        Compress-Archive -Path "public/uploads/*" -DestinationPath "../../$backupDir/media-$timestamp.zip" -Force
        Write-Host "✅ Media backup completed" -ForegroundColor Green
    }
    
    # 4. Note about environment file (skip copying for now due to PowerShell regex issues)
    Write-Host "📝 Note: Manually backup .env file separately" -ForegroundColor Yellow
    
    # 5. Create README for this backup
    Write-Host "📄 Creating backup documentation..." -ForegroundColor Yellow
    $readmeContent = @"
# Backup: $MilestoneName
**Created**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Contents
- Strapi export: $backupName.tar.gz
- Database: database-$timestamp.db
- Media: media-$timestamp.zip

## Restore Instructions

Quick Restore:
```
cd apps/strapi
npm run strapi import -- --file ../../$backupDir/$backupName.tar.gz --force
```

Newsletter CTA Component Complete
Schema changes synced
Ready for atomic component refactor

"@
    $readmeContent | Set-Content "../../$backupDir/README.md"
    
    Write-Host "✅ Documentation created" -ForegroundColor Green
    
    # 6. Calculate total backup size
    $totalSize = (Get-ChildItem -Path "../../$backupDir" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    
    Write-Host ""
    Write-Host "=" * 60 -ForegroundColor Green
    Write-Host "✅ BACKUP COMPLETED SUCCESSFULLY" -ForegroundColor Green
    Write-Host "=" * 60 -ForegroundColor Green
    Write-Host "📂 Location: $backupDir" -ForegroundColor Cyan
    Write-Host "📊 Total Size: $("{0:N2}" -f $totalSize) MB" -ForegroundColor Cyan
    Write-Host "📅 Timestamp: $timestamp" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Green
    
} catch {
    Write-Host "❌ Backup failed: $_" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review backup in: $backupDir" -ForegroundColor White
Write-Host "  2. Test restore process" -ForegroundColor White
Write-Host "  3. Commit to git (if milestone backup)" -ForegroundColor White
