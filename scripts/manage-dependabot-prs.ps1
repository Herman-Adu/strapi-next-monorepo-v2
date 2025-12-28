# Dependabot PR Management Script
# This script helps manage the 15 pending Dependabot PRs safely

Write-Host "🤖 Dependabot PR Management" -ForegroundColor Cyan
Write-Host "============================`n" -ForegroundColor Cyan

# Get all open Dependabot PRs
Write-Host "📋 Fetching Dependabot PRs..." -ForegroundColor Yellow
$prs = gh pr list --state open --author "app/dependabot" --json number,title,updatedAt,headRefName | ConvertFrom-Json

if ($prs.Count -eq 0) {
    Write-Host "✅ No Dependabot PRs pending!" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($prs.Count) Dependabot PRs`n" -ForegroundColor Yellow

# Categorize PRs
$majorUpdates = @()
$minorUpdates = @()
$patchUpdates = @()

foreach ($pr in $prs) {
    $title = $pr.title
    
    # Detect update type from title
    if ($title -match "18\..*to 19\." -or $title -match "15\..*to 16\." -or $title -match "7\..*to 9\." -or $title -match "6\..*to 7\.") {
        $majorUpdates += $pr
    } elseif ($title -match "bump.*from \d+\.\d+\.\d+ to \d+\.\d+\.\d+") {
        # Parse versions to determine if minor or patch
        if ($title -match "from (\d+)\.(\d+)\.(\d+) to (\d+)\.(\d+)\.(\d+)") {
            $oldMajor = [int]$matches[1]
            $oldMinor = [int]$matches[2]
            $newMajor = [int]$matches[4]
            $newMinor = [int]$matches[5]
            
            if ($newMinor -gt $oldMinor) {
                $minorUpdates += $pr
            } else {
                $patchUpdates += $pr
            }
        }
    }
}

Write-Host "📊 PR Categories:" -ForegroundColor Cyan
Write-Host "  🔴 Major Updates (require review): $($majorUpdates.Count)" -ForegroundColor Red
Write-Host "  🟡 Minor Updates (auto-mergeable): $($minorUpdates.Count)" -ForegroundColor Yellow
Write-Host "  🟢 Patch Updates (auto-mergeable): $($patchUpdates.Count)`n" -ForegroundColor Green

# Show major updates that need review
if ($majorUpdates.Count -gt 0) {
    Write-Host "⚠️  MAJOR UPDATES (Manual Review Required):" -ForegroundColor Red
    foreach ($pr in $majorUpdates) {
        Write-Host "  PR #$($pr.number): $($pr.title)" -ForegroundColor Red
    }
    Write-Host ""
}

# Offer options
Write-Host "🎯 What would you like to do?`n" -ForegroundColor Cyan
Write-Host "1. Auto-merge SAFE updates (patch only)" -ForegroundColor Green
Write-Host "2. Auto-merge SAFE + MINOR updates (recommended)" -ForegroundColor Yellow
Write-Host "3. Close all major update PRs (will recreate weekly)" -ForegroundColor Red
Write-Host "4. Show detailed PR info" -ForegroundColor Blue
Write-Host "5. Exit`n" -ForegroundColor Gray

$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n🟢 Merging patch updates..." -ForegroundColor Green
        foreach ($pr in $patchUpdates) {
            Write-Host "  Merging PR #$($pr.number)..." -ForegroundColor Green
            gh pr merge $pr.number --auto --squash --delete-branch
        }
        Write-Host "`n✅ Queued $($patchUpdates.Count) patch updates for auto-merge" -ForegroundColor Green
    }
    
    "2" {
        Write-Host "`n🟢 Merging patch + minor updates..." -ForegroundColor Green
        $safeUpdates = $patchUpdates + $minorUpdates
        foreach ($pr in $safeUpdates) {
            Write-Host "  Merging PR #$($pr.number)..." -ForegroundColor Green
            gh pr merge $pr.number --auto --squash --delete-branch
        }
        Write-Host "`n✅ Queued $($safeUpdates.Count) safe updates for auto-merge" -ForegroundColor Green
        Write-Host "⏳ PRs will merge automatically when CI checks pass" -ForegroundColor Yellow
    }
    
    "3" {
        Write-Host "`n🔴 Closing major update PRs..." -ForegroundColor Red
        Write-Host "These will be recreated in the next Dependabot run (Monday)" -ForegroundColor Yellow
        $confirm = Read-Host "Are you sure? (y/n)"
        if ($confirm -eq "y") {
            foreach ($pr in $majorUpdates) {
                Write-Host "  Closing PR #$($pr.number)..." -ForegroundColor Red
                gh pr close $pr.number --comment "Closing to prevent confusion. Will handle major updates in a separate migration PR after evaluating breaking changes."
            }
            Write-Host "`n✅ Closed $($majorUpdates.Count) major update PRs" -ForegroundColor Green
        }
    }
    
    "4" {
        Write-Host "`n📋 Detailed PR Information:`n" -ForegroundColor Cyan
        foreach ($pr in $prs) {
            Write-Host "PR #$($pr.number): $($pr.title)" -ForegroundColor White
            Write-Host "  Branch: $($pr.headRefName)" -ForegroundColor Gray
            Write-Host "  Updated: $($pr.updatedAt)" -ForegroundColor Gray
            Write-Host ""
        }
    }
    
    "5" {
        Write-Host "`nExiting..." -ForegroundColor Gray
        exit 0
    }
    
    default {
        Write-Host "`n❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n📚 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Wait for CI checks to pass on auto-merged PRs" -ForegroundColor White
Write-Host "2. Review major updates manually (React 19, Next 16)" -ForegroundColor White
Write-Host "3. Future PRs will auto-merge with new workflow" -ForegroundColor White
Write-Host "`n✅ Done!" -ForegroundColor Green
