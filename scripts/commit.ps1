#Requires -Version 5.1

<#
.SYNOPSIS
    Interactive git commit helper with conventional commit format and emoji support.

.DESCRIPTION
    This script helps create well-formatted git commits with:
    - Conventional commit types (feat, fix, docs, etc.)
    - Emoji icons for visual clarity
    - Proper scope and description formatting
    - Optional detailed body and breaking changes
    - Automatic staging of changes

.PARAMETER Type
    The type of commit (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert)

.PARAMETER Scope
    Optional scope of the commit (e.g., newsletter, strapi, ui, docs)

.PARAMETER Message
    Short description of the change (max 72 characters recommended)

.PARAMETER Body
    Optional detailed description of the change

.PARAMETER Breaking
    Optional breaking change description

.PARAMETER NoVerify
    Skip git hooks (use with caution)

.EXAMPLE
    .\scripts\commit.ps1
    # Interactive mode - will prompt for all details

.EXAMPLE
    .\scripts\commit.ps1 -Type feat -Scope newsletter -Message "add theme-pastel background option"

.EXAMPLE
    .\scripts\commit.ps1 -Type fix -Message "resolve database sync issues" -Body "Fixed Config Sync import process"

.NOTES
    Author: Herman Adu
    Project: strapi-next-monorepo-v2
    Uses Yarn package manager
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert')]
    [string]$Type,

    [Parameter(Mandatory=$false)]
    [string]$Scope,

    [Parameter(Mandatory=$false)]
    [string]$Message,

    [Parameter(Mandatory=$false)]
    [string]$Body,

    [Parameter(Mandatory=$false)]
    [string]$Breaking,

    [Parameter(Mandatory=$false)]
    [switch]$NoVerify
)

# Emoji mappings for commit types
$Emojis = @{
    'feat'     = [char]::ConvertFromUtf32(0x2728)    # ✨
    'fix'      = [char]::ConvertFromUtf32(0x1F41B)   # 🐛
    'docs'     = [char]::ConvertFromUtf32(0x1F4DD)   # 📝
    'style'    = [char]::ConvertFromUtf32(0x1F484)   # 💄
    'refactor' = [char]::ConvertFromUtf32(0x267B) + [char]::ConvertFromUtf32(0xFE0F)  # ♻️
    'perf'     = [char]::ConvertFromUtf32(0x26A1)    # ⚡
    'test'     = [char]::ConvertFromUtf32(0x2705)    # ✅
    'build'    = [char]::ConvertFromUtf32(0x1F3D7) + [char]::ConvertFromUtf32(0xFE0F)  # 🏗️
    'ci'       = [char]::ConvertFromUtf32(0x1F477)   # 👷
    'chore'    = [char]::ConvertFromUtf32(0x1F527)   # 🔧
    'revert'   = [char]::ConvertFromUtf32(0x23EA)    # ⏪
}

# Type descriptions
$TypeDescriptions = @{
    'feat'     = 'A new feature'
    'fix'      = 'A bug fix'
    'docs'     = 'Documentation only changes'
    'style'    = 'Code style changes (formatting, missing semi-colons, etc.)'
    'refactor' = 'Code change that neither fixes a bug nor adds a feature'
    'perf'     = 'Performance improvements'
    'test'     = 'Adding or updating tests'
    'build'    = 'Changes to build system or dependencies'
    'ci'       = 'CI/CD configuration changes'
    'chore'    = 'Other changes that do not modify src or test files'
    'revert'   = 'Revert a previous commit'
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = 'White'
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-CommitType {
    if ($Type) {
        return $Type
    }

    $bookEmoji = [char]::ConvertFromUtf32(0x1F4CB)  # 📋
    Write-ColorOutput "`n$bookEmoji Select commit type:" "Cyan"
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "DarkGray"
    
    $index = 1
    $TypeDescriptions.GetEnumerator() | Sort-Object Name | ForEach-Object {
        $emoji = $Emojis[$_.Key]
        Write-Host ("  {0}. {1} {2,-12} - {3}" -f $index, $emoji, $_.Key, $_.Value)
        $index++
    }
    
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "DarkGray"
    
    $selection = Read-Host "`nEnter number (1-$($TypeDescriptions.Count))"
    $selectedType = ($TypeDescriptions.GetEnumerator() | Sort-Object Name)[$selection - 1].Key
    
    return $selectedType
}
function Get-CommitScope {
    if ($Scope) {
        return $Scope
    }

    $targetEmoji = [char]::ConvertFromUtf32(0x1F3AF)  # 🎯
    Write-ColorOutput "`n$targetEmoji Enter scope (optional, e.g., newsletter, strapi, ui):" "Cyan"
    $inputScope = Read-Host "Scope"
    
    return $inputScope.Trim()
}
function Get-CommitMessage {
    if ($Message) {
        return $Message
    }

    $speechEmoji = [char]::ConvertFromUtf32(0x1F4AC)  # 💬
    $warningEmoji = [char]::ConvertFromUtf32(0x26A0) + [char]::ConvertFromUtf32(0xFE0F)  # ⚠️
    Write-ColorOutput "`n$speechEmoji Enter commit message:" "Cyan"
    Write-ColorOutput "   (Keep it short and descriptive, max 72 chars)" "DarkGray"
    $inputMessage = Read-Host "Message"
    
    if ($inputMessage.Length -gt 72) {
        Write-ColorOutput "$warningEmoji  Warning: Message is longer than 72 characters" "Yellow"
    }
    
    return $inputMessage.Trim()
}
    
function Get-CommitBody {
    if ($Body) {
        return $Body
    }

    $docEmoji = [char]::ConvertFromUtf32(0x1F4C4)  # 📄
    Write-ColorOutput "`n$docEmoji Enter detailed description (optional, press Enter to skip):" "Cyan"
    Write-ColorOutput "   (Press Enter twice when done)" "DarkGray"
    
    $lines = @()
    do {
        $line = Read-Host
        if ($line) {
            $lines += $line
        }
    } while ($line)
    
    if ($lines.Count -gt 0) {
        return ($lines -join "`n")
    }
    
    return ""
}

function Get-BreakingChange {
    if ($Breaking) {
        return $Breaking
    }

    $warningEmoji = [char]::ConvertFromUtf32(0x26A0) + [char]::ConvertFromUtf32(0xFE0F)  # ⚠️
    Write-ColorOutput "`n$warningEmoji  Is this a breaking change? (y/N):" "Cyan"
    $isBreaking = Read-Host
    
    if ($isBreaking -eq 'y' -or $isBreaking -eq 'Y') {
        Write-ColorOutput "   Enter breaking change description:" "Cyan"
        return Read-Host
    }
    
    return ""
}

function Build-CommitMessage {
    param(
        [string]$CommitType,
        [string]$CommitScope,
        [string]$CommitMessage,
        [string]$CommitBody,
        [string]$BreakingChange
    )

    $emoji = $Emojis[$CommitType]
    
    # Build the commit header
    if ($CommitScope) {
        $header = "$emoji $CommitType($CommitScope): $CommitMessage"
    } else {
        $header = "$emoji ${CommitType}: $CommitMessage"
    }
    
    # Build the full commit message
    $fullMessage = $header
    
    if ($CommitBody) {
        $fullMessage += "`n`n$CommitBody"
    }
    
    if ($BreakingChange) {
        $fullMessage += "`n`nBREAKING CHANGE: $BreakingChange"
    }
    
    return $fullMessage
}

function Show-CommitPreview {
    param([string]$CommitMessage)
    
    Write-ColorOutput "`n" "White"
    Write-ColorOutput "═══════════════════════════════════════════════════════════" "Green"
    Write-ColorOutput "                    COMMIT PREVIEW" "Green"
    Write-ColorOutput "═══════════════════════════════════════════════════════════" "Green"
    Write-ColorOutput $CommitMessage "White"
    Write-ColorOutput "═══════════════════════════════════════════════════════════" "Green"
    Write-ColorOutput "`n" "White"
}

# Main execution
try {
    $rocketEmoji = [char]::ConvertFromUtf32(0x1F680)  # 🚀
    Write-ColorOutput "`n$rocketEmoji Git Commit Helper" "Green"
    
    # Check if we're in a git repository
    $isGitRepo = git rev-parse --git-dir 2>$null
    if (-not $isGitRepo) {
        $crossEmoji = [char]::ConvertFromUtf32(0x274C)  # ❌
        Write-ColorOutput "$crossEmoji Error: Not a git repository" "Red"
        exit 1
    }
    
    # Check for staged changes
    $stagedChanges = git diff --cached --name-only
    if (-not $stagedChanges) {
        $warningEmoji = [char]::ConvertFromUtf32(0x26A0) + [char]::ConvertFromUtf32(0xFE0F)  # ⚠️
        Write-ColorOutput "`n$warningEmoji  No staged changes found." "Yellow"
        $stageAll = Read-Host "Stage all changes? (y/N)"
        
        if ($stageAll -eq 'y' -or $stageAll -eq 'Y') {
            git add -A
            $checkEmoji = [char]::ConvertFromUtf32(0x2705)  # ✅
            Write-ColorOutput "$checkEmoji All changes staged" "Green"
        } else {
            $crossEmoji = [char]::ConvertFromUtf32(0x274C)  # ❌
            Write-ColorOutput "$crossEmoji Commit cancelled - no changes staged" "Red"
            exit 1
        }
    }
    
    # Gather commit information
    $commitType = Get-CommitType
    $commitScope = Get-CommitScope
    $commitMessage = Get-CommitMessage
    $commitBody = Get-CommitBody
    $breakingChange = Get-BreakingChange
    
    # Build the commit message
    $fullCommitMessage = Build-CommitMessage `
        -CommitType $commitType `
        -CommitScope $commitScope `
        -CommitMessage $commitMessage `
        -CommitBody $commitBody `
        -BreakingChange $breakingChange
    
    # Show preview
    Show-CommitPreview -CommitMessage $fullCommitMessage
    
    # Confirm commit
    Write-ColorOutput "Proceed with commit? (Y/n):" "Cyan"
    $confirm = Read-Host
    
    if ($confirm -eq 'n' -or $confirm -eq 'N') {
        Write-ColorOutput "❌ Commit cancelled" "Yellow"
        exit 0
    }
    
    # Execute commit
    $commitArgs = @('-m', $fullCommitMessage)
    if ($NoVerify) {
        $commitArgs += '--no-verify'
    }
    
    git commit @commitArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "`n✅ Commit successful!" "Green"
        Write-ColorOutput "`n📊 Recent commits:" "Cyan"
        git log --oneline -5
    } else {
        Write-ColorOutput "`n❌ Commit failed" "Red"
        exit 1
    }
    
} catch {
    Write-ColorOutput "`n❌ Error: $_" "Red"
    exit 1
}
