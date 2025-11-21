# Customer Support Agent - Stop Development Services

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Stopping Development Services" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Stop Docker containers
Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
docker-compose stop

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker containers stopped" -ForegroundColor Green
} else {
    Write-Host "⚠ Failed to stop Docker containers" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "To stop backend and frontend:" -ForegroundColor Yellow
Write-Host "  - Press Ctrl+C in their terminal windows" -ForegroundColor White
Write-Host "  - Or close the terminal windows" -ForegroundColor White
Write-Host ""

Write-Host "To remove containers and volumes (deletes data!):" -ForegroundColor Red
Write-Host "  docker-compose down -v" -ForegroundColor White
Write-Host ""

Write-Host "Done!" -ForegroundColor Green
pause


