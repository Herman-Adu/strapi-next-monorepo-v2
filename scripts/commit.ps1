#Requires -Version 5.1

<#
.SYNOPSIS
    Interactive git commit helper - DEPRECATED

.DESCRIPTION
    This script is deprecated due to PowerShell emoji encoding issues on Windows 11.
    
    RECOMMENDED WORKFLOW:
    1. Create a commit message file (e.g., commit-msg.txt)
    2. Use: git commit -F commit-msg.txt
    
    See STRAPI_BEST_PRACTICES.md for the recommended git workflow.

.NOTES
    Author: Herman Adu
    Project: strapi-next-monorepo-v2
    Status: DEPRECATED
#>

Write-Host ""
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "  WARNING: This script is deprecated" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "This script has PowerShell emoji encoding issues." -ForegroundColor White
Write-Host ""
Write-Host "Recommended workflow:" -ForegroundColor Cyan
Write-Host "  1. Create a commit message file" -ForegroundColor White
Write-Host "  2. Run: git commit -F <message-file>" -ForegroundColor White
Write-Host ""
Write-Host "Example:" -ForegroundColor Cyan
Write-Host "  echo 'docs(workflow): update commit process' > commit-msg.txt" -ForegroundColor Gray
Write-Host "  git commit -F commit-msg.txt" -ForegroundColor Gray
Write-Host ""
Write-Host "See STRAPI_BEST_PRACTICES.md for details." -ForegroundColor Cyan
Write-Host ""

exit 0

