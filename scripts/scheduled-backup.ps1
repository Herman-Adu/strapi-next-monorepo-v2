# Scheduled Backup Wrapper Script
# This script is called by Windows Task Scheduler

# Set working directory
Set-Location "C:\Users\herma\source\repository\strapi-next-monorepo-v2"

# Set environment variables from .env file
$EnvFile = ".\apps\strapi\.env"
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^DATABASE_URL=(.+)$') {
            $env:DATABASE_URL = $matches[1]
        }
    }
}

# Log start
$LogFile = ".\backups\scheduled-backup-log.txt"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $LogFile -Value "[$Timestamp] Starting scheduled PostgreSQL backup..."

# Run backup
try {
    & ".\scripts\backup-database.ps1"
    $Success = $?
    
    if ($Success) {
        Add-Content -Path $LogFile -Value "[$Timestamp] PostgreSQL backup completed successfully"
        exit 0
    } else {
        Add-Content -Path $LogFile -Value "[$Timestamp] PostgreSQL backup failed"
        exit 1
    }
} catch {
    Add-Content -Path $LogFile -Value "[$Timestamp] ERROR: $_"
    exit 1
}
