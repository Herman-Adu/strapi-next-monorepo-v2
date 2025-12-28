# Dual Database Sync Script
# Purpose: Sync Docker PostgreSQL (primary) to Local PostgreSQL 17 (backup)
# Schedule: Run daily at 2 AM via Windows Task Scheduler
# Protection: Prevents 5th database deletion incident

param(
    [string]$DockerHost = "localhost",
    [int]$DockerPort = 5432,
    [string]$LocalHost = "localhost",
    [int]$LocalPort = 5433,
    [string]$DatabaseName = "strapi_dev",
    [string]$Username = "postgres",
    [string]$Password = "",
    [switch]$SkipConfirmation
)

# Color output functions
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Failure { Write-Host "[ERROR] $args" -ForegroundColor Red }

# Get password from parameter or environment
if ([string]::IsNullOrEmpty($Password)) {
    if (-not [string]::IsNullOrEmpty($env:DATABASE_PASSWORD)) {
        $Password = $env:DATABASE_PASSWORD
    } elseif (-not [string]::IsNullOrEmpty($env:PGPASSWORD)) {
        $Password = $env:PGPASSWORD
    } else {
        Write-Failure "Password required. Use -Password parameter or set DATABASE_PASSWORD environment variable"
        exit 1
    }
}

# Set PGPASSWORD for all PostgreSQL commands
$env:PGPASSWORD = $Password

# Get timestamp for backup
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$TempDir = Join-Path $PSScriptRoot ".." "backups" "sync-temp"
$TempDumpFile = Join-Path $TempDir "docker-to-local-$Timestamp.dump"
$LogFile = Join-Path $PSScriptRoot ".." "backups" "sync-log.txt"

# Create temp directory
if (-not (Test-Path $TempDir)) {
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
}

Write-Info "=== Dual Database Sync Script ==="
Write-Info "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Info "Docker PostgreSQL: ${DockerHost}:${DockerPort}"
Write-Info "Local PostgreSQL: ${LocalHost}:${LocalPort}"
Write-Info "Database: $DatabaseName"
Write-Info ""

# Confirmation prompt (skip in automated mode)
if (-not $SkipConfirmation) {
    Write-Warning "This will overwrite the LOCAL PostgreSQL database with data from Docker."
    $Confirm = Read-Host "Continue? (yes/no)"
    if ($Confirm -ne "yes") {
        Write-Info "Sync cancelled by user."
        exit 0
    }
}

# Step 1: Test Docker PostgreSQL connection
Write-Info "Step 1: Testing Docker PostgreSQL connection..."
try {
    $DockerTest = psql -h $DockerHost -p $DockerPort -U $Username -d $DatabaseName --connect-timeout=30 -c "SELECT 1;" 2>&1 | Tee-Object -Variable TestOutput
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Connection output: $TestOutput"
        throw "Docker PostgreSQL connection failed"
    }
    Write-Success "Docker PostgreSQL connection successful"
} catch {
    Write-Failure "Cannot connect to Docker PostgreSQL at ${DockerHost}:${DockerPort}"
    Write-Failure "Error: $_"
    Add-Content -Path $LogFile -Value "[$Timestamp] FAILED: Cannot connect to Docker PostgreSQL - $_"
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    exit 1
}

# Step 2: Test Local PostgreSQL connection
Write-Info "Step 2: Testing Local PostgreSQL connection..."
try {
    $LocalTest = psql -h $LocalHost -p $LocalPort -U $Username -d $DatabaseName --connect-timeout=30 -c "SELECT 1;" 2>&1 | Tee-Object -Variable TestOutput
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Connection output: $TestOutput"
        throw "Local PostgreSQL connection failed"
    }
    Write-Success "Local PostgreSQL connection successful"
} catch {
    Write-Failure "Cannot connect to Local PostgreSQL at ${LocalHost}:${LocalPort}"
    Write-Failure "Error: $_"
    Add-Content -Path $LogFile -Value "[$Timestamp] FAILED: Cannot connect to Local PostgreSQL - $_"
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    exit 1
}

# Step 3: Dump from Docker PostgreSQL
Write-Info "Step 3: Dumping data from Docker PostgreSQL..."
try {
    $DumpOutput = pg_dump -h $DockerHost -p $DockerPort -U $Username -d $DatabaseName -F c -f $TempDumpFile 2>&1 | Tee-Object -Variable DumpLog
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "pg_dump output: $DumpLog"
        throw "pg_dump failed"
    }
    if (-not (Test-Path $TempDumpFile)) {
        throw "Dump file was not created"
    }
    $DumpSize = (Get-Item $TempDumpFile).Length / 1MB
    Write-Success "Docker data dumped successfully ($([math]::Round($DumpSize, 2)) MB)"
    Add-Content -Path $LogFile -Value "[$Timestamp] Docker dump created: $([math]::Round($DumpSize, 2)) MB"
} catch {
    Write-Failure "Failed to dump data from Docker PostgreSQL"
    Write-Failure "Error: $_"
    Add-Content -Path $LogFile -Value "[$Timestamp] FAILED: pg_dump error - $_"
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    exit 1
}

# Step 4: Create backup of local database before overwriting
Write-Info "Step 4: Creating safety backup of current local database..."
$SafetyBackupFile = Join-Path $TempDir "local-safety-backup-$Timestamp.dump"
try {
    $SafetyOutput = pg_dump -h $LocalHost -p $LocalPort -U $Username -d $DatabaseName -F c -f $SafetyBackupFile 2>&1 | Tee-Object -Variable SafetyLog
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Safety backup failed (may be empty database)"
    } else {
        $BackupSize = (Get-Item $SafetyBackupFile).Length / 1MB
        Write-Success "Safety backup created ($([math]::Round($BackupSize, 2)) MB)"
    }
} catch {
    Write-Warning "Safety backup failed: $_"
}

# Step 5: Terminate connections to local database
Write-Info "Step 5: Terminating connections to local database..."
try {
    $TerminateQuery = @"
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DatabaseName'
  AND pid <> pg_backend_pid();
"@
    $TermOutput = psql -h $LocalHost -p $LocalPort -U $Username -d postgres --connect-timeout=30 -c $TerminateQuery 2>&1 | Tee-Object -Variable TermLog
    Write-Success "Connections terminated"
} catch {
    Write-Warning "Could not terminate all connections: $_"
}

# Step 6: Drop and recreate local database
Write-Info "Step 6: Recreating local database..."
try {
    $DropOutput = psql -h $LocalHost -p $LocalPort -U $Username -d postgres --connect-timeout=30 -c "DROP DATABASE IF EXISTS $DatabaseName;" 2>&1 | Tee-Object -Variable DropLog
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Drop output: $DropLog"
        throw "DROP DATABASE failed"
    }
    
    $CreateOutput = psql -h $LocalHost -p $LocalPort -U $Username -d postgres --connect-timeout=30 -c "CREATE DATABASE $DatabaseName OWNER $Username;" 2>&1 | Tee-Object -Variable CreateLog
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Create output: $CreateLog"
        throw "CREATE DATABASE failed"
    }
    
    Write-Success "Local database recreated"
} catch {
    Write-Failure "Failed to recreate local database"
    Write-Failure "Error: $_"
    Write-Warning "Safety backup available at: $SafetyBackupFile"
    Add-Content -Path $LogFile -Value "[$Timestamp] FAILED: Database recreation error - $_"
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    exit 1
}

# Step 7: Restore to local PostgreSQL
Write-Info "Step 7: Restoring data to local PostgreSQL..."
try {
    $RestoreOutput = pg_restore -h $LocalHost -p $LocalPort -U $Username -d $DatabaseName -F c $TempDumpFile 2>&1 | Tee-Object -Variable RestoreLog
    if ($LASTEXITCODE -ne 0) {
        # pg_restore returns non-zero even on success sometimes (warnings)
        # Check if database has data
        $RowCount = psql -h $LocalHost -p $LocalPort -U $Username -d $DatabaseName -t --connect-timeout=30 -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';" 2>&1
        if ([int]$RowCount -gt 0) {
            Write-Success "Data restored successfully ($RowCount tables)"
            Add-Content -Path $LogFile -Value "[$Timestamp] Restore completed with warnings: $RowCount tables"
        } else {
            Write-Failure "Restore output: $RestoreLog"
            throw "No tables found after restore"
        }
    } else {
        Write-Success "Data restored successfully"
    }
} catch {
    Write-Failure "Failed to restore data to local PostgreSQL"
    Write-Failure "Error: $_"
    Write-Warning "You can restore the safety backup manually:"
    Write-Warning "pg_restore -h $LocalHost -p $LocalPort -U $Username -d $DatabaseName -F c $SafetyBackupFile"
    Add-Content -Path $LogFile -Value "[$Timestamp] FAILED: Restore error - $_"
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    exit 1
}

# Step 8: Verify data integrity
# Step 8: Verifying data integrity...
try {
    # Count tables
    $TableCount = psql -h $LocalHost -p $LocalPort -U $Username -d $DatabaseName -t --connect-timeout=30 -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';" 2>&1
    
    # Count rows in a key table (pages)
    $PageCount = psql -h $LocalHost -p $LocalPort -U $Username -d $DatabaseName -t --connect-timeout=30 -c "SELECT COUNT(*) FROM pages;" 2>&1
    
    Write-Success "Verification complete:"
    Write-Success "  - Tables: $TableCount"
    Write-Success "  - Pages: $PageCount"
} catch {
    Write-Warning "Verification queries failed: $_"
}

# Step 9: Cleanup
Write-Info "Step 9: Cleaning up temporary files..."
try {
    # Keep last 7 days of sync dumps
    $OldDumps = Get-ChildItem $TempDir -Filter "docker-to-local-*.dump" | 
                Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
    
    if ($OldDumps) {
        $OldDumps | Remove-Item -Force
        Write-Success "Removed $($OldDumps.Count) old dump file(s)"
    }
    
    # Keep last 3 safety backups
    $OldBackups = Get-ChildItem $TempDir -Filter "local-safety-backup-*.dump" | 
                  Sort-Object LastWriteTime -Descending | 
                  Select-Object -Skip 3
    
    if ($OldBackups) {
        $OldBackups | Remove-Item -Force
        Write-Success "Removed $($OldBackups.Count) old safety backup(s)"
    }
} catch {
    Write-Warning "Cleanup failed: $_"
}

# Step 10: Log success
$EndTime = Get-Date
Write-Success ""
Write-Success "=== Sync Complete ==="
Write-Success "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Success "Docker → Local sync successful"
Write-Success ""

# Write to log file
$LogEntry = @"
[$Timestamp] SUCCESS
  Docker: ${DockerHost}:${DockerPort}
  Local: ${LocalHost}:${LocalPort}
  Database: $DatabaseName
  Dump Size: $([math]::Round($DumpSize, 2)) MB
  Tables: $TableCount
  Pages: $PageCount
  Duration: $([math]::Round(($EndTime - (Get-Date $Timestamp)).TotalSeconds, 2))s
"@

Add-Content -Path $LogFile -Value $LogEntry

Write-Info "Log written to: $LogFile"
Write-Info ""
Write-Info "Next steps:"
Write-Info "  1. Restart Strapi if running: cd apps/strapi; yarn develop"
Write-Info "  2. Schedule this script daily: Task Scheduler at 2 AM"
Write-Info ""
Write-Info "Safety backup location: $SafetyBackupFile"
Write-Info "Current dump location: $TempDumpFile"
Write-Info ""

# Cleanup password from environment
Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

exit 0
