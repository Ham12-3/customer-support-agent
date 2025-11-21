@echo off
REM Customer Support Agent - Stop Development Services

echo =====================================
echo  Stopping Development Services
echo =====================================
echo.

echo Stopping Docker containers...
docker-compose stop

if errorlevel 1 (
    echo [WARNING] Failed to stop Docker containers
) else (
    echo [OK] Docker containers stopped
)
echo.

echo To stop backend and frontend:
echo   - Close their terminal windows
echo   - Or press Ctrl+C in each window
echo.

echo To remove containers and volumes (deletes data!):
echo   docker-compose down -v
echo.

echo Done!
pause


