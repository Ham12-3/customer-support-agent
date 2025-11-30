# Simple HTTP Server for Widget Testing
# Serves the test page on http://localhost:3002

Write-Host "`n=== Starting Widget Test Server ===" -ForegroundColor Cyan
Write-Host ""

$port = 3002
$htmlFile = "widget-test-embed.html"

# Check if file exists
if (-not (Test-Path $htmlFile)) {
    Write-Host "❌ Error: $htmlFile not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this from the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting HTTP server on port $port..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Test page available at:" -ForegroundColor Green
Write-Host "   http://localhost:$port" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Before testing, make sure:" -ForegroundColor Yellow
Write-Host "   1. Backend is running (http://localhost:5000)" -ForegroundColor White
Write-Host "   2. Dashboard is running (http://localhost:3000)" -ForegroundColor White
Write-Host "   3. Widget is running (http://localhost:3001)" -ForegroundColor White
Write-Host "   4. You've added 'localhost:3002' domain in the dashboard" -ForegroundColor White
Write-Host "   5. You've updated the API key in widget-test-embed.html" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "✅ Server started successfully!" -ForegroundColor Green
    Write-Host ""

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        Write-Host "$(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $($request.Url.PathAndQuery)" -ForegroundColor Gray

        # Serve the HTML file
        $content = Get-Content $htmlFile -Raw -Encoding UTF8
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)

        # Set response headers
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $buffer.Length
        $response.StatusCode = 200

        # Add CORS headers for development
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        # Write response
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.Close()
    }
}
catch {
    Write-Host ""
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -match "port.*already in use|Address already in use") {
        Write-Host ""
        Write-Host "Port $port is already in use. Try:" -ForegroundColor Yellow
        Write-Host "  1. Close any other application using port $port" -ForegroundColor White
        Write-Host "  2. Or change the port in this script" -ForegroundColor White
    }
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
        Write-Host ""
        Write-Host "Server stopped." -ForegroundColor Yellow
    }
    $listener.Close()
}

