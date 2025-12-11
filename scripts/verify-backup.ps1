# 🛡️ Backup Verification Script
# Verifies the contents of a Strapi backup file
# SAFE: Read-only analysis, no database changes

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    
    [switch]$Detailed = $false
)

$ErrorActionPreference = "Stop"

Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "[VERIFICATION] STRAPI BACKUP VERIFICATION" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan

# Validate backup file exists
if (-not (Test-Path $BackupFile)) {
    Write-Host "`n❌ ERROR: Backup file not found: $BackupFile" -ForegroundColor Red
    exit 1
}

$backupInfo = Get-Item $BackupFile
Write-Host "`n[INFO] Backup File Information:" -ForegroundColor Yellow
Write-Host "   Path: $($backupInfo.FullName)"
Write-Host "   Size: $([math]::Round($backupInfo.Length / 1MB, 2)) MB"
Write-Host "   Created: $($backupInfo.LastWriteTime)"

# Create temp directory for extraction
$tempDir = Join-Path $env:TEMP "strapi-backup-verify-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    Write-Host "`n[EXTRACT] Extracting backup (read-only analysis)..." -ForegroundColor Yellow
    
    # Extract .gz layer
    $gzipStream = New-Object System.IO.FileStream($BackupFile, [System.IO.FileMode]::Open)
    $gzipDecompressor = New-Object System.IO.Compression.GzipStream($gzipStream, [System.IO.Compression.CompressionMode]::Decompress)
    $tarFile = Join-Path $tempDir "backup.tar"
    $tarStream = New-Object System.IO.FileStream($tarFile, [System.IO.FileMode]::Create)
    
    $gzipDecompressor.CopyTo($tarStream)
    $tarStream.Close()
    $gzipDecompressor.Close()
    $gzipStream.Close()
    
    # Extract .tar layer
    tar -xf $tarFile -C $tempDir
    Remove-Item $tarFile
    
    Write-Host "   [OK] Extraction complete" -ForegroundColor Green
    
    # Verify structure
    Write-Host "`n[STRUCTURE] Backup Structure:" -ForegroundColor Yellow
    $requiredDirs = @('schemas', 'entities', 'assets', 'links', 'configuration')
    $missingDirs = @()
    
    foreach ($dir in $requiredDirs) {
        $dirPath = Join-Path $tempDir $dir
        if (Test-Path $dirPath) {
            Write-Host "   [OK] $dir/" -ForegroundColor Green
        } else {
            Write-Host "   [MISSING] $dir/ (MISSING)" -ForegroundColor Red
            $missingDirs += $dir
        }
    }
    
    if ($missingDirs.Count -gt 0) {
        Write-Host "`n[WARNING] Backup structure incomplete!" -ForegroundColor Yellow
        Write-Host "   Missing directories: $($missingDirs -join ', ')" -ForegroundColor Red
    }
    
    # Check metadata
    $metadataFile = Join-Path $tempDir "metadata.json"
    if (Test-Path $metadataFile) {
        Write-Host "`n[METADATA] Metadata:" -ForegroundColor Yellow
        $metadata = Get-Content $metadataFile | ConvertFrom-Json
        Write-Host "   Strapi Version: $($metadata.strapiVersion)"
        Write-Host "   Created: $($metadata.createdAt)"
    }
    
    # Analyze schemas
    Write-Host "`n[SCHEMAS] Collection Type Schemas:" -ForegroundColor Yellow
    $schemasFile = Join-Path (Join-Path $tempDir "schemas") "schemas_00001.jsonl"
    
    if (Test-Path $schemasFile) {
        $schemas = Get-Content $schemasFile | ForEach-Object { $_ | ConvertFrom-Json }
        $apiSchemas = $schemas | Where-Object { $_.uid -like 'api::*' }
        
        Write-Host "   Total schemas: $($schemas.Count)"
        Write-Host "   API collection types: $($apiSchemas.Count)"
        Write-Host ""
        
        $apiSchemas | Select-Object uid | Sort-Object uid | ForEach-Object {
            Write-Host "      - $($_.uid)" -ForegroundColor White
        }
    } else {
        Write-Host "   [ERROR] Schemas file not found" -ForegroundColor Red
    }
    
    # Analyze entities (actual data)
    Write-Host "`n[ENTITIES] Entity Data:" -ForegroundColor Yellow
    $entitiesFile = Join-Path (Join-Path $tempDir "entities") "entities_00001.jsonl"
    
    if (Test-Path $entitiesFile) {
        $entities = Get-Content $entitiesFile | ForEach-Object { $_ | ConvertFrom-Json }
        
        Write-Host "   Total entities: $($entities.Count)"
        Write-Host ""
        
        # Group by type and count
        $entityCounts = $entities | Group-Object -Property type | 
            Select-Object @{Name='Collection';Expression={$_.Name}}, Count | 
            Sort-Object Collection
        
        foreach ($group in $entityCounts) {
            $icon = if ($group.Count -gt 0) { "[OK]" } else { "[WARN]" }
            Write-Host "   $icon $($group.Collection): $($group.Count) records" -ForegroundColor $(if ($group.Count -gt 0) { "Green" } else { "Yellow" })
        }
        
        # Check critical collections
        Write-Host "`n[CRITICAL] Critical Collection Verification:" -ForegroundColor Yellow
        $criticalCollections = @(
            'api::page.page',
            'api::contact-message.contact-message',
            'api::subscriber.subscriber',
            'plugin::upload.file'
        )
        
        $warnings = @()
        foreach ($collection in $criticalCollections) {
            $count = ($entities | Where-Object { $_.type -eq $collection }).Count
            if ($count -eq 0) {
                $warnings += "   [WARN] $collection is EMPTY (0 records)"
            } else {
                Write-Host "   [OK] $collection : $count records" -ForegroundColor Green
            }
        }
        
        if ($warnings.Count -gt 0) {
            Write-Host ""
            Write-Host "   [WARNINGS] WARNINGS:" -ForegroundColor Yellow
            $warnings | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
        }
        
        # Detailed analysis (optional)
        if ($Detailed) {
            Write-Host "`n[DETAILED] Detailed Entity Breakdown:" -ForegroundColor Yellow
            
            foreach ($group in $entityCounts) {
                if ($group.Collection -like 'api::*') {
                    Write-Host "`n   Collection: $($group.Collection)" -ForegroundColor Cyan
                    $sampleEntities = $entities | Where-Object { $_.type -eq $group.Collection } | Select-Object -First 3
                    
                    foreach ($entity in $sampleEntities) {
                        Write-Host "      - ID: $($entity.id)"
                        if ($entity.data.title) { Write-Host "        Title: $($entity.data.title)" }
                        if ($entity.data.email) { Write-Host "        Email: $($entity.data.email)" }
                        if ($entity.data.name) { Write-Host "        Name: $($entity.data.name)" }
                    }
                }
            }
        }
    } else {
        Write-Host "   [ERROR] Entities file not found" -ForegroundColor Red
    }
    
    # Check assets
    Write-Host "`n[ASSETS] Media Assets:" -ForegroundColor Yellow
    $assetsDir = Join-Path $tempDir "assets"
    if (Test-Path $assetsDir) {
        $assetFiles = Get-ChildItem $assetsDir -Recurse -File
        $totalSize = ($assetFiles | Measure-Object -Property Length -Sum).Sum
        Write-Host "   Files: $($assetFiles.Count)"
        Write-Host "   Total Size: $([math]::Round($totalSize / 1MB, 2)) MB"
    } else {
        Write-Host "   [WARN] No assets directory (no media files in backup)" -ForegroundColor Yellow
    }
    
    # Final verdict
    Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
    
    if ($missingDirs.Count -eq 0 -and (Test-Path $entitiesFile)) {
        Write-Host "[PASSED] BACKUP VERIFICATION: PASSED" -ForegroundColor Green
        Write-Host ""
        Write-Host "This backup appears to be valid and can be used for restore." -ForegroundColor Green
        
        if ($warnings.Count -gt 0) {
            Write-Host ""
            Write-Host "[NOTE] Some collections are empty. This may be expected if they" -ForegroundColor Yellow
            Write-Host "   had no data at the time of backup creation." -ForegroundColor Yellow
        }
    } else {
        Write-Host "[FAILED] BACKUP VERIFICATION: FAILED" -ForegroundColor Red
        Write-Host ""
        Write-Host "This backup may be corrupted or incomplete. Do not use for restore." -ForegroundColor Red
    }
    
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "`n[ERROR] Verification failed: $_" -ForegroundColor Red
    exit 1
} finally {
    # Cleanup
    if (Test-Path $tempDir) {
        Remove-Item -Recurse -Force $tempDir
        Write-Host "[CLEANUP] Temporary files removed" -ForegroundColor Gray
    }
}

Write-Host "`n[SUCCESS] Verification complete!`n" -ForegroundColor Green
