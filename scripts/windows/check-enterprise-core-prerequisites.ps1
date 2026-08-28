param()

$ErrorActionPreference = "Stop"

$okCount = 0
$warnCount = 0
$failCount = 0

function Add-Ok {
    param([string] $Message)

    $script:okCount++
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Add-Warn {
    param([string] $Message)

    $script:warnCount++
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Add-Fail {
    param([string] $Message)

    $script:failCount++
    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

function Get-FirstOutputLine {
    param(
        [string] $Command,
        [string[]] $Arguments
    )

    try {
        $output = & $Command @Arguments 2>&1

        if ($LASTEXITCODE -ne 0 -and -not $output) {
            return $null
        }

        return ($output | Select-Object -First 1)
    } catch {
        return $null
    }
}

function Test-CommandLineTool {
    param(
        [string] $Name,
        [string[]] $VersionArguments = @("--version")
    )

    $command = Get-Command $Name -ErrorAction SilentlyContinue

    if (-not $command) {
        Add-Fail "$Name is missing or not on PATH."
        return $false
    }

    $version = Get-FirstOutputLine -Command $Name -Arguments $VersionArguments

    if ($version) {
        Add-Ok "$Name found: $version"
    } else {
        Add-Ok "$Name found."
    }

    return $true
}

function Test-Folder {
    param(
        [string] $Path,
        [string] $Label
    )

    if (Test-Path -LiteralPath $Path -PathType Container) {
        Add-Ok "$Label folder exists: $Path"
    } else {
        Add-Fail "$Label folder is missing: $Path"
    }
}

function Test-EnvironmentFile {
    param(
        [string] $Path,
        [string] $Label
    )

    if (Test-Path -LiteralPath $Path -PathType Leaf) {
        Add-Ok "$Label exists."
    } else {
        Add-Warn "$Label is missing."
    }
}

Write-Host "Enterprise Core Windows demo preflight"
Write-Host "This checker is read-only. It does not install dependencies, modify files, modify databases, run migrations, or start services."
Write-Host ""

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptRoot "..\..")).Path
$backendPath = Join-Path $repoRoot "services\enterprise-auth-service\src"
$frontendPath = Join-Path $repoRoot "apps\enterprise-admin-web"

Write-Host "Repository root: $repoRoot"
Write-Host ""

Write-Host "Command-line tools"
$phpFound = $false
Test-CommandLineTool -Name "git" | Out-Null
$phpFound = Test-CommandLineTool -Name "php" -VersionArguments @("-v")
Test-CommandLineTool -Name "composer" | Out-Null
Test-CommandLineTool -Name "node" -VersionArguments @("--version") | Out-Null
Test-CommandLineTool -Name "npm" -VersionArguments @("--version") | Out-Null
Write-Host ""

Write-Host "PHP configuration"
if ($phpFound) {
    try {
        $phpIniOutput = & php --ini 2>&1
        $loadedConfiguration = $phpIniOutput | Where-Object { $_ -like "Loaded Configuration File:*" } | Select-Object -First 1
        $scanDirectory = $phpIniOutput | Where-Object { $_ -like "Scan for additional .ini files in:*" } | Select-Object -First 1

        if ($loadedConfiguration) {
            Add-Ok "PHP ini summary: $loadedConfiguration"
        } else {
            Add-Warn "PHP ini summary was not available from php --ini."
        }

        if ($scanDirectory) {
            Write-Host "       $scanDirectory"
        }
    } catch {
        Add-Warn "Could not read PHP ini summary with php --ini."
    }

    try {
        $enabledExtensions = @{}
        & php -m 2>&1 | ForEach-Object {
            $extension = $_.Trim().ToLowerInvariant()

            if ($extension -and -not $extension.StartsWith("[") -and -not $enabledExtensions.ContainsKey($extension)) {
                $enabledExtensions[$extension] = $true
            }
        }

        foreach ($extension in @("fileinfo", "zip", "pdo_pgsql", "pgsql", "pdo_sqlite", "sqlite3")) {
            if ($enabledExtensions.ContainsKey($extension)) {
                Add-Ok "PHP extension $extension is enabled."
            } else {
                Add-Fail "PHP extension $extension is not enabled."
            }
        }
    } catch {
        Add-Fail "Could not check PHP extensions with php -m."
    }
} else {
    Add-Fail "PHP ini and extension checks skipped because PHP is missing."
}
Write-Host ""

Write-Host "PostgreSQL"
$postgresService = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue

if ($postgresService) {
    if ($postgresService.Status -eq "Running") {
        Add-Ok "PostgreSQL service postgresql-x64-17 is Running."
    } else {
        Add-Warn "PostgreSQL service postgresql-x64-17 was found but is $($postgresService.Status)."
    }
} else {
    Add-Warn "PostgreSQL service postgresql-x64-17 was not found. Verify the PostgreSQL installation and service name."
}

$psqlCommand = Get-Command "psql" -ErrorAction SilentlyContinue
$psqlFullPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
$psqlFullPathExists = Test-Path -LiteralPath $psqlFullPath -PathType Leaf

if ($psqlCommand) {
    $psqlVersion = Get-FirstOutputLine -Command "psql" -Arguments @("--version")

    if ($psqlVersion) {
        Add-Ok "psql found on PATH: $psqlVersion"
    } else {
        Add-Ok "psql found on PATH."
    }
}

if ($psqlFullPathExists) {
    Add-Ok "psql full path exists: $psqlFullPath"
}

if (-not $psqlCommand -and -not $psqlFullPathExists) {
    Add-Warn "psql was not found on PATH or at $psqlFullPath."
}
Write-Host ""

Write-Host "Project folders"
Test-Folder -Path $backendPath -Label "Backend"
Test-Folder -Path $frontendPath -Label "Frontend"
Write-Host ""

Write-Host "Local environment files"
Test-EnvironmentFile -Path (Join-Path $backendPath ".env") -Label "Backend .env"
Test-EnvironmentFile -Path (Join-Path $frontendPath ".env.local") -Label "Frontend .env.local"
Write-Host ""

Write-Host "Installed dependency folders"
$backendVendorPath = Join-Path $backendPath "vendor"
$frontendNodeModulesPath = Join-Path $frontendPath "node_modules"

if (Test-Path -LiteralPath $backendVendorPath -PathType Container) {
    Add-Ok "Backend vendor folder exists."
} else {
    Add-Warn "Backend vendor folder is missing. Run composer install from services\enterprise-auth-service\src."
}

if (Test-Path -LiteralPath $frontendNodeModulesPath -PathType Container) {
    Add-Ok "Frontend node_modules folder exists."
} else {
    Add-Warn "Frontend node_modules folder is missing. Run npm install from apps\enterprise-admin-web."
}
Write-Host ""

Write-Host "Summary"
Write-Host "[OK] $okCount"
Write-Host "[WARN] $warnCount"
Write-Host "[FAIL] $failCount"

if ($failCount -gt 0) {
    exit 1
}

exit 0
