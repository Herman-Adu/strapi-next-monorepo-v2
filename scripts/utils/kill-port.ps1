# Kill all processes using a specific port
param(
    [Parameter(Mandatory=$true)]
    [int]$Port
)

Write-Host "Finding processes using port $Port..." -ForegroundColor Cyan

# Find all process IDs using the port
$targetProcesses = netstat -ano | findstr ":$Port" | ForEach-Object {
    if ($_ -match '\s+(\d+)\s*$') {
        $matches[1]
    }
} | Sort-Object -Unique | Where-Object { $_ -ne "0" }

if ($targetProcesses) {
    Write-Host "Found PIDs: $($targetProcesses -join ', ')" -ForegroundColor Yellow
    
    foreach ($id in $targetProcesses) {
        try {
            $process = Get-Process -Id $id -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Killing process: $($process.ProcessName) (PID: $id)" -ForegroundColor Red
                Stop-Process -Id $id -Force
                Write-Host "[OK] Process $id killed" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "[!] Could not kill PID $id - may require admin privileges" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`nPort $Port is now free!" -ForegroundColor Green
} else {
    Write-Host "No processes found using port $Port" -ForegroundColor Green
}
