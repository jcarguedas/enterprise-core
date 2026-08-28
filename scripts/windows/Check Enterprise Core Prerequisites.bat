@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "REPO_ROOT=%SCRIPT_DIR%..\.."
for %%I in ("%REPO_ROOT%") do set "REPO_ROOT=%%~fI"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%REPO_ROOT%\scripts\windows\check-enterprise-core-prerequisites.ps1"

if errorlevel 1 (
    echo.
    echo Enterprise Core prerequisite check found failures.
    pause
    exit /b 1
)

echo.
echo Enterprise Core prerequisite check completed.
pause

endlocal
