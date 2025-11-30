@echo off
echo.
echo === Deleting Widget Application ===
echo.

echo Step 1: Stopping any running node processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel%==0 (
    echo   - Node processes stopped
) else (
    echo   - No node processes found
)

echo.
echo Step 2: Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Step 3: Deleting frontend/apps/widget folder...
rmdir /s /q frontend\apps\widget
if %errorlevel%==0 (
    echo   - Widget folder deleted successfully!
    echo.
    echo === DONE ===
    echo.
) else (
    echo   - ERROR: Could not delete widget folder
    echo   - The folder might still be locked
    echo.
    echo Try these steps manually:
    echo   1. Close any open terminals running the widget
    echo   2. Close any editors with widget files open
    echo   3. Run this script again
    echo.
)

pause

