# Database Backup Script for Windows (PowerShell)
# Usage: .\scripts\backup-database.ps1

param(
    [string]$BackupDir = ".\backups",
    [string]$DatabaseUrl = $env:DATABASE_URL,
    [switch]$UploadToS3 = $false
)

# Configuration
$Date = Get-Date -Format "yyyy-MM-dd-HHmmss"
$BackupFile = "strapi-$Date.sql"
$BackupPath = Join-Path $BackupDir $BackupFile

# Create backup directory if it doesn't exist
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
    Write-Host "✅ Created backup directory: $BackupDir" -ForegroundColor Green
}

# Validate DATABASE_URL
if ([string]::IsNullOrEmpty($DatabaseUrl)) {
    Write-Host "❌ ERROR: DATABASE_URL environment variable not set" -ForegroundColor Red
    Write-Host "   Set it with: `$env:DATABASE_URL='postgresql://user:pass@host:port/db'" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Starting database backup..." -ForegroundColor Cyan
Write-Host "   Target: $BackupPath" -ForegroundColor Gray

# Run pg_dump (requires PostgreSQL client tools installed)
try {
    # Parse DATABASE_URL to extract connection parameters
    # Format: postgresql://username:password@host:port/database
    
    if ($DatabaseUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)") {
        $PgUser = $Matches[1]
        $PgPassword = $Matches[2]
        $PgHost = $Matches[3]
        $PgPort = $Matches[4]
        $PgDatabase = $Matches[5]
        
        # Set password environment variable
        $env:PGPASSWORD = $PgPassword
        
        # Execute pg_dump
        & pg_dump -h $PgHost -p $PgPort -U $PgUser -d $PgDatabase -F p -f $BackupPath
        
        # Clear password from environment
        Remove-Item Env:\PGPASSWORD
        
        if ($LASTEXITCODE -eq 0) {
            $Size = (Get-Item $BackupPath).Length / 1MB
            Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
            Write-Host "   File: $BackupPath" -ForegroundColor Gray
            Write-Host "   Size: $([Math]::Round($Size, 2)) MB" -ForegroundColor Gray
        } else {
            throw "pg_dump failed with exit code $LASTEXITCODE"
        }
    } else {
        throw "Invalid DATABASE_URL format. Expected: postgresql://user:pass@host:port/db"
    }
} catch {
    Write-Host "❌ Backup failed: $_" -ForegroundColor Red
    exit 1
}

# Upload to AWS S3 (optional)
if ($UploadToS3) {
    Write-Host "☁️  Uploading to AWS S3..." -ForegroundColor Cyan
    
    $S3Bucket = $env:AWS_S3_BACKUP_BUCKET
    if ([string]::IsNullOrEmpty($S3Bucket)) {
        Write-Host "⚠️  WARNING: AWS_S3_BACKUP_BUCKET not set, skipping upload" -ForegroundColor Yellow
    } else {
        try {
            aws s3 cp $BackupPath "s3://$S3Bucket/backups/$BackupFile"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Uploaded to S3: s3://$S3Bucket/backups/$BackupFile" -ForegroundColor Green
            } else {
                Write-Host "⚠️  S3 upload failed" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️  S3 upload error: $_" -ForegroundColor Yellow
        }
    }
}

# Cleanup old backups (keep last 30 days)
Write-Host "🧹 Cleaning up old backups..." -ForegroundColor Cyan
$CutoffDate = (Get-Date).AddDays(-30)
Get-ChildItem -Path $BackupDir -Filter "strapi-*.sql" | 
    Where-Object { $_.LastWriteTime -lt $CutoffDate } | 
    ForEach-Object {
        Remove-Item $_.FullName
        Write-Host "   Deleted: $($_.Name)" -ForegroundColor Gray
    }

Write-Host "🎉 Backup process completed!" -ForegroundColor Green
