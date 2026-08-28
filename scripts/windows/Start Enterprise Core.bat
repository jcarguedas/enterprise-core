@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "REPO_ROOT=%SCRIPT_DIR%..\.."
for %%I in ("%REPO_ROOT%") do set "REPO_ROOT=%%~fI"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%REPO_ROOT%\scripts\windows\start-enterprise-core.ps1"

if errorlevel 1 (
    echo.
    echo Enterprise Core startup failed.
    pause
)

endlocal
