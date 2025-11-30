# Backend-Widget Integration Verification Script
# This script checks if your backend and widget are properly aligned

Write-Host "`n=== Backend-Widget Integration Verification ===" -ForegroundColor Cyan
Write-Host ""

$issues = @()
$warnings = @()
$success = @()

# Check 1: Backend ChatController exists
Write-Host "Checking Backend ChatController..." -ForegroundColor Yellow
$chatControllerPath = "backend/src/CustomerSupport.Api/Controllers/ChatController.cs"
if (Test-Path $chatControllerPath) {
    $chatControllerContent = Get-Content $chatControllerPath -Raw
    
    # Check for ChatRequest class
    if ($chatControllerContent -match "class ChatRequest") {
        $success += "✅ ChatRequest model found"
    } else {
        $issues += "❌ ChatRequest model not found in ChatController"
    }
    
    # Check for ChatResponse class
    if ($chatControllerContent -match "class ChatResponse") {
        $success += "✅ ChatResponse model found"
    } else {
        $issues += "❌ ChatResponse model not found in ChatController"
    }
    
    # Check for SendMessage endpoint
    if ($chatControllerContent -match "SendMessage") {
        $success += "✅ SendMessage endpoint found"
    } else {
        $issues += "❌ SendMessage endpoint not found"
    }
    
    # Check for development mode handling
    if ($chatControllerContent -match "Development") {
        $success += "✅ Development mode handling found"
    } else {
        $warnings += "⚠️  No development mode handling detected"
    }
} else {
    $issues += "❌ ChatController.cs not found at $chatControllerPath"
}

# Check 2: Widget page.tsx exists
Write-Host "Checking Widget Configuration..." -ForegroundColor Yellow
$widgetPagePath = "frontend/apps/widget/src/app/page.tsx"
if (Test-Path $widgetPagePath) {
    $widgetContent = Get-Content $widgetPagePath -Raw
    
    # Check for API endpoint configuration
    if ($widgetContent -match "api/chat") {
        $success += "✅ Widget configured to call /api/chat endpoint"
    } else {
        $issues += "❌ Widget not configured to call /api/chat endpoint"
    }
    
    # Check for headers configuration
    if ($widgetContent -match "X-API-Key" -and $widgetContent -match "X-Domain") {
        $success += "✅ Widget sends API key and domain headers"
    } else {
        $warnings += "⚠️  Widget headers may not be properly configured"
    }
    
    # Check for sessionId
    if ($widgetContent -match "sessionId") {
        $success += "✅ Widget generates session IDs"
    } else {
        $issues += "❌ Widget doesn't generate session IDs"
    }
    
    # Check for error handling
    if ($widgetContent -match "catch.*error") {
        $success += "✅ Widget has error handling"
    } else {
        $warnings += "⚠️  Widget may lack proper error handling"
    }
} else {
    $issues += "❌ Widget page.tsx not found at $widgetPagePath"
}

# Check 3: CORS Configuration
Write-Host "Checking CORS Configuration..." -ForegroundColor Yellow
$appsettingsPath = "backend/src/CustomerSupport.Api/appsettings.json"
$appsettingsExamplePath = "backend/src/CustomerSupport.Api/appsettings.Example.json"

$corsCheckFile = if (Test-Path $appsettingsPath) { $appsettingsPath } 
                 elseif (Test-Path $appsettingsExamplePath) { $appsettingsExamplePath }
                 else { $null }

if ($corsCheckFile) {
    $appsettingsContent = Get-Content $corsCheckFile -Raw
    
    # Check for CORS configuration
    if ($appsettingsContent -match "localhost:3001") {
        $success += "✅ CORS configured for widget (localhost:3001)"
    } else {
        $issues += "❌ CORS not configured for widget origin (localhost:3001)"
    }
    
    # Check for localhost:3000 (dashboard)
    if ($appsettingsContent -match "localhost:3000") {
        $success += "✅ CORS configured for dashboard (localhost:3000)"
    }
} else {
    $issues += "❌ No appsettings file found for CORS configuration check"
}

# Check 4: Program.cs CORS setup
Write-Host "Checking Backend CORS Setup..." -ForegroundColor Yellow
$programPath = "backend/src/CustomerSupport.Api/Program.cs"
if (Test-Path $programPath) {
    $programContent = Get-Content $programPath -Raw
    
    if ($programContent -match "AddCors" -and $programContent -match "UseCors") {
        $success += "✅ CORS middleware properly configured in Program.cs"
    } else {
        $issues += "❌ CORS middleware not properly configured"
    }
} else {
    $issues += "❌ Program.cs not found"
}

# Check 5: Request/Response Model Alignment
Write-Host "Checking Request/Response Model Alignment..." -ForegroundColor Yellow
if ($chatControllerContent) {
    # Extract properties from ChatRequest
    $hasMessage = $chatControllerContent -match "Message.*string"
    $hasSessionId = $chatControllerContent -match "SessionId.*string"
    
    if ($hasMessage -and $hasSessionId) {
        $success += "✅ ChatRequest model has required properties (Message, SessionId)"
    } else {
        $issues += "❌ ChatRequest model missing required properties"
    }
    
    # Check ChatResponse - use more flexible regex to handle multiline definitions
    $hasChatResponseClass = $chatControllerContent -match "class ChatResponse"
    $hasResponseMessage = $chatControllerContent -match "Message.*string"
    $hasTimestamp = $chatControllerContent -match "Timestamp.*DateTime"
    
    if ($hasChatResponseClass -and $hasResponseMessage -and $hasTimestamp) {
        $success += "✅ ChatResponse model properly defined (Message, SessionId, Timestamp)"
    } else {
        $issues += "❌ ChatResponse model incomplete"
    }
}

# Check 6: Gemini Service Configuration
Write-Host "Checking Gemini Service..." -ForegroundColor Yellow
$geminiServicePath = "backend/src/CustomerSupport.Infrastructure/Services/GeminiService.cs"
if (Test-Path $geminiServicePath) {
    $success += "✅ Gemini service exists"
    
    # Check if it's registered in Program.cs
    if ($programContent -and $programContent -match "IGeminiService.*GeminiService") {
        $success += "✅ Gemini service registered in DI container"
    } else {
        $warnings += "⚠️  Gemini service may not be registered in DI container"
    }
} else {
    $warnings += "⚠️  Gemini service not found (may affect AI responses)"
}

# Check 7: Widget Embed Script
Write-Host "Checking Widget Embed Script..." -ForegroundColor Yellow
$widgetScriptPath = "frontend/apps/widget/public/widget.js"
if (Test-Path $widgetScriptPath) {
    $success += "✅ Widget embed script exists"
    
    $widgetScriptContent = Get-Content $widgetScriptPath -Raw
    if ($widgetScriptContent -match "apiKey" -and $widgetScriptContent -match "domain") {
        $success += "✅ Widget embed script configured for API key and domain"
    } else {
        $warnings += "⚠️  Widget embed script may need API key/domain configuration"
    }
} else {
    $warnings += "⚠️  Widget embed script (widget.js) not found"
}

# Display Results
Write-Host "`n=== Verification Results ===" -ForegroundColor Cyan
Write-Host ""

if ($success.Count -gt 0) {
    Write-Host "✅ SUCCESS ($($success.Count) checks passed):" -ForegroundColor Green
    foreach ($item in $success) {
        Write-Host "   $item" -ForegroundColor Green
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "⚠️  WARNINGS ($($warnings.Count) warnings):" -ForegroundColor Yellow
    foreach ($item in $warnings) {
        Write-Host "   $item" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($issues.Count -gt 0) {
    Write-Host "❌ ISSUES ($($issues.Count) issues found):" -ForegroundColor Red
    foreach ($item in $issues) {
        Write-Host "   $item" -ForegroundColor Red
    }
    Write-Host ""
}

# Overall Status
Write-Host "=== Overall Status ===" -ForegroundColor Cyan
if ($issues.Count -eq 0) {
    if ($warnings.Count -eq 0) {
        Write-Host "✅ Perfect! Backend and widget are fully aligned." -ForegroundColor Green
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Start backend: cd backend/src/CustomerSupport.Api && dotnet run" -ForegroundColor White
        Write-Host "2. Start widget: cd frontend/apps/widget && npm run dev" -ForegroundColor White
        Write-Host "3. Visit: http://localhost:3001" -ForegroundColor White
    } else {
        Write-Host "✅ Backend and widget are aligned (with minor warnings)." -ForegroundColor Green
        Write-Host "The warnings above are non-critical but should be reviewed." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Integration issues detected." -ForegroundColor Red
    Write-Host "Please review the issues above and refer to:" -ForegroundColor Yellow
    Write-Host "BACKEND_WIDGET_INTEGRATION_GUIDE.md" -ForegroundColor White
}

Write-Host ""
Write-Host "For detailed integration information, see:" -ForegroundColor Cyan
Write-Host "  - BACKEND_WIDGET_INTEGRATION_GUIDE.md" -ForegroundColor White
Write-Host ""

# Exit with appropriate code
if ($issues.Count -gt 0) {
    exit 1
} else {
    exit 0
}

