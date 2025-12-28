# Dependabot PR Management Script
# This script helps manage the 15 pending Dependabot PRs safely

Write-Host "Dependabot PR Management" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Get all open Dependabot PRs
Write-Host "Fetching Dependabot PRs..." -ForegroundColor Yellow
$prs = gh pr list --state open --author "app/dependabot" --json number,title | ConvertFrom-Json

if ($prs.Count -eq 0) {
    Write-Host "No Dependabot PRs pending!" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($prs.Count) Dependabot PRs" -ForegroundColor Yellow
Write-Host ""

# List all PRs
Write-Host "Open Dependabot PRs:" -ForegroundColor Cyan
foreach ($pr in $prs) {
    $isMajor = $pr.title -match "18\.\d+ to 19\." -or $pr.title -match "15\.\d+ to 16\." -or $pr.title -match "7\.\d+ to 9\." -or $pr.title -match "6\.\d+ to 7\."
    $color = if ($isMajor) { "Red" } else { "Green" }
    $tag = if ($isMajor) { "[MAJOR]" } else { "[SAFE]" }
    Write-Host "  $tag PR #$($pr.number): $($pr.title)" -ForegroundColor $color
}
Write-Host ""

Write-Host "Options:" -ForegroundColor Cyan
Write-Host "1. Close all major update PRs (React 19, Next 16, etc)" -ForegroundColor Red
Write-Host "2. Auto-merge safe updates (patch/minor only)" -ForegroundColor Green
Write-Host "3. Exit" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Closing major update PRs..." -ForegroundColor Red
    Write-Host "These will be recreated Monday if needed" -ForegroundColor Yellow
    $confirm = Read-Host "Confirm? (y/n)"
    
    if ($confirm -eq "y") {
        foreach ($pr in $prs) {
            $isMajor = $pr.title -match "18\.\d+ to 19\." -or $pr.title -match "15\.\d+ to 16\." -or $pr.title -match "7\.\d+ to 9\." -or $pr.title -match "6\.\d+ to 7\."
            if ($isMajor) {
                Write-Host "  Closing PR #$($pr.number)..." -ForegroundColor Red
                gh pr close $pr.number --comment "Closing major update. Will handle breaking changes in a dedicated migration PR."
            }
        }
        Write-Host ""
        Write-Host "Done! Major updates closed." -ForegroundColor Green
    }
}
elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Auto-merging safe updates..." -ForegroundColor Green
    foreach ($pr in $prs) {
        $isMajor = $pr.title -match "18\.\d+ to 19\." -or $pr.title -match "15\.\d+ to 16\." -or $pr.title -match "7\.\d+ to 9\." -or $pr.title -match "6\.\d+ to 7\."
        if (-not $isMajor) {
            Write-Host "  Queuing PR #$($pr.number)..." -ForegroundColor Green
            gh pr merge $pr.number --auto --squash --delete-branch
        }
    }
    Write-Host ""
    Write-Host "Safe PRs queued for auto-merge after CI passes" -ForegroundColor Green
}
else {
    Write-Host "Exiting..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "- New workflow will auto-merge future safe updates" -ForegroundColor White
Write-Host "- Major updates will be flagged for review" -ForegroundColor White
Write-Host "- Check GitHub Actions for dependabot-auto-merge workflow" -ForegroundColor White
