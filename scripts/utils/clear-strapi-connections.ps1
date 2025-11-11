# Clear all Strapi server connections on port 1337
Write-Host "Clearing all Strapi connections on port 1337..." -ForegroundColor Cyan
Write-Host ""

# Show current connections
Write-Host "Current connections:" -ForegroundColor Yellow
netstat -ano | findstr ":1337"
Write-Host ""

# Kill all processes using port 1337
& "$PSScriptRoot\kill-port.ps1" -Port 1337

Write-Host ""
Write-Host "Verifying port is clear..." -ForegroundColor Cyan
$remaining = netstat -ano | findstr ":1337"
if ($remaining) {
    Write-Host "[!] Some connections still exist (TIME_WAIT states clear automatically):" -ForegroundColor Yellow
    Write-Host $remaining
} else {
    Write-Host "[OK] Port 1337 is completely clear!" -ForegroundColor Green
}
