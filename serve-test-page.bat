@echo off
echo.
echo === Starting Widget Test Server ===
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel%==0 (
    echo Using Python HTTP Server...
    echo.
    echo Test page available at:
    echo    http://localhost:3002
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 3002
    goto :end
)

REM If Python not available, check for Node/npm
node --version >nul 2>&1
if %errorlevel%==0 (
    echo Using Node.js HTTP Server...
    echo.
    echo Installing http-server if needed...
    call npx -y http-server -p 3002 -c-1 --cors
    goto :end
)

REM Neither Python nor Node available
echo ERROR: Neither Python nor Node.js is available!
echo.
echo Please install one of the following:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
pause
goto :end

:end

