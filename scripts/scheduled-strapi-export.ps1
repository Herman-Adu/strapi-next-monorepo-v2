# Scheduled Strapi Export Wrapper Script
# This script is called by Windows Task Scheduler at 2:05 AM (after PostgreSQL backup)

# Set working directory
Set-Location "C:\Users\herma\source\repository\strapi-next-monorepo-v2\apps\strapi"

# Log start
$LogFile = "..\..\backups\scheduled-backup-log.txt"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $LogFile -Value "[$Timestamp] Starting scheduled Strapi export..."

# Create backup filename
$BackupFile = "..\..\backups\strapi-export-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').tar.gz"

# Run Strapi export
try {
    $Output = yarn strapi export --no-encrypt --file $BackupFile 2>&1
    
    if (Test-Path $BackupFile) {
        $Size = [math]::Round((Get-Item $BackupFile).Length / 1MB, 2)
        Add-Content -Path $LogFile -Value "[$Timestamp] Strapi export completed successfully ($Size MB)"
        
        # Cleanup old exports (keep last 7 days)
        $OldExports = Get-ChildItem "..\..\backups\" -Filter "strapi-export-*.tar.gz" | 
                      Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
        if ($OldExports) {
            $OldExports | Remove-Item -Force
            Add-Content -Path $LogFile -Value "[$Timestamp] Cleaned up $($OldExports.Count) old export(s)"
        }
        
        exit 0
    } else {
        Add-Content -Path $LogFile -Value "[$Timestamp] Strapi export failed - file not created"
        Add-Content -Path $LogFile -Value "[$Timestamp] Output: $Output"
        exit 1
    }
} catch {
    Add-Content -Path $LogFile -Value "[$Timestamp] ERROR: $_"
    exit 1
}
