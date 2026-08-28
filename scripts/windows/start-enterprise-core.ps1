param(
    [string] $AdminUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Write-Info {
    param([string] $Message)
    Write-Host "[Enterprise Core] $Message"
}

function Write-WarningMessage {
    param([string] $Message)
    Write-Host "[Enterprise Core] WARNING: $Message" -ForegroundColor Yellow
}

function Escape-PowerShellLiteral {
    param([string] $Value)
    return $Value.Replace("'", "''")
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptRoot "..\..")).Path
$backendPath = Join-Path $repoRoot "services\enterprise-auth-service\src"
$frontendPath = Join-Path $repoRoot "apps\enterprise-admin-web"

Write-Info "Starting local demo runtime from: $repoRoot"

if (-not (Test-Path -LiteralPath $backendPath -PathType Container)) {
    throw "Backend folder not found: $backendPath"
}

if (-not (Test-Path -LiteralPath $frontendPath -PathType Container)) {
    throw "Frontend folder not found: $frontendPath"
}

if (-not (Test-Path -LiteralPath (Join-Path $backendPath ".env") -PathType Leaf)) {
    Write-WarningMessage "Backend .env file is missing. Configure services\enterprise-auth-service\src\.env before using the API."
}

if (-not (Test-Path -LiteralPath (Join-Path $frontendPath ".env.local") -PathType Leaf)) {
    Write-WarningMessage "Frontend .env.local file is missing. Configure apps\enterprise-admin-web\.env.local if the app needs local API settings."
}

$backendCommand = "Set-Location -LiteralPath '$(Escape-PowerShellLiteral $backendPath)'; php artisan serve"
$frontendCommand = "Set-Location -LiteralPath '$(Escape-PowerShellLiteral $frontendPath)'; npm run dev"

Write-Info "Opening backend PowerShell window: php artisan serve"
Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    $backendCommand
)

Write-Info "Opening frontend PowerShell window: npm run dev"
Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    $frontendCommand
)

Write-Info "Waiting a few seconds before opening Admin Web..."
Start-Sleep -Seconds 3

Write-Info "Opening Admin Web: $AdminUrl"
Start-Process $AdminUrl

Write-Info "Startup commands launched. Keep the backend and frontend PowerShell windows open while demoing Enterprise Core."
